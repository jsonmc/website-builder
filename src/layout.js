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
const getActorCompiler = metadata => pugLoader('actor.pug', metadata);

const buildActorUrl = actorName => '/actors/' + actorName
  .replace(/  /g, ' ')
  .replace(/ /g, '-')
  .replace(/ö/g, 'o')
  .replace(/é/g, 'e')
  .replace(/[\.\:,]/g, '')
  .toLowerCase() + '/';

const buildActorFilename = actorName => (buildActorUrl(actorName) + 'index.html').replace(/^\//, '');

const layout = options => {
  return (files, metalsmith, done) => {
    const allFiles = Object.keys(files);
    const metadata = metalsmith.metadata();

    let frontpageCompiler = null;
    let movieCompiler = null;
    let actorCompiler = null;

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
        getActorCompiler(options)
          .then(compiler => {
            actorCompiler = compiler;
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
                  buildActorUrl,
                  movie: file,
                });
                break;

              case 'actor':
                file.contents = actorCompiler({
                  ...metadata,
                  buildActorUrl,
                  actor: file,
                  actorMovies: metadata.actorToMovies[file.name] || [],
                });
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
        // Add pages for missing actors
        const allActors = Object.keys(metadata.actorToMovies);
        const allFiles = Object.keys(files);

        allActors.forEach(actorName => {
          const actorFileName = buildActorFilename(actorName);

          if (allFiles.indexOf(actorFileName) < 0) {
            files[actorFileName] = {
              contents: 'We don\'t have a page for <strong>' + actorName + '</strong>. Head out to our project site and create one!',
            };
          }
        });

        callback();
      },
      callback => {
        done();
        callback();
      }
    ]);
  };
};

export default layout;
