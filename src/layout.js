// Renders our json into html files by using pug

import path from 'path';
import fs from 'fs';
import async from 'async';
import pug from 'pug';

const pugRoot = path.join(__dirname, 'templates');

const pugLoader = (fileName, metadata) => {
  return new Promise((accept, reject) => {
    const fullPath = path.join(pugRoot, fileName);
    fs.readFile(fullPath, 'utf8', (err, pugContents) => {
      if (err) {
        reject(err);
        return;
      }

      accept(pug.compile(pugContents, {
        filename: fullPath,
        basedir: pugRoot,
      }));
    });
  });
};

const getFrontPageCompiler = metadata => pugLoader('frontpage.pug', metadata);
const getMovieCompiler = metadata => pugLoader('movie.pug', metadata);

const layout = options => {
  return (files, metalsmith, done) => {
    const allFiles = Object.keys(files);
    const metadata = metalsmith.metadata();

    let frontpageCompiler = null;
    let movieCompiler = null;

    async.series([
      callback => {
        getMovieCompiler(options)
          .then(compiler => {
            movieCompiler = compiler;
            callback();
          });
      },
      callback => {
        getFrontPageCompiler(options)
          .then(compiler => {
            frontpageCompiler = compiler;
            callback();
          });
      },
      callback => {
        async.each(
          allFiles,
          (fileName, subcb) => {
            const file = files[fileName];
            let newFileName = fileName.replace('.json', '/index.html');

            switch (file.layout) {
              case 'frontpage': 
                //console.log(metadata);
                file.contents = frontpageCompiler(metadata);
                break;

              case 'movie':
                file.contents = movieCompiler({
                  ...metadata,
                  movie: file
                });
                break;

              case 'actor':
                break;

              default:
                newFileName = fileName;
                break;
            };

            if (fileName !== newFileName) {
              delete files[fileName];
              files[newFileName] = file;              
            }

            subcb();
          },
          callback
        );
      },
      callback => {
        done();
        callback();
      }
    ]);
  };
};

export default layout;
