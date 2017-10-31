// Adds the contents of a given folder to the current build

import fs from 'fs';
import path from 'path';

import async from 'async';

const loadFileContents = (fileName, callback) => {
  const fileData = {
    mode: '0644',
    contents: '',
  };

  // TODO: Add stats

  fs.readFile(fileName, 'utf8', (err, data) => {
    fileData.contents = new Buffer(data);

    callback(fileData);
  });
};

const addFolder = folderPath => {
  return (files, metalsmith, done) => {
    const addToFiles = (file, fileData) => files[file] = fileData;

    const addFilenameToMetalsmith = (destinationFile, fileName, callback) =>
      loadFileContents(fileName, contents => {
        addToFiles(destinationFile, contents);
        callback();
      });

    fs.readdir(
      folderPath,
      (err, files) => {
        if (err) throw err;

        async.each(
          files,
          (file, callback) => {
            const fileName = path.join(folderPath, file);

            addFilenameToMetalsmith(file, fileName, callback);
          },
          (err) => {
            if (err) throw err;
            done();
          }
        );
      }
    )
  };
};

export default addFolder;
