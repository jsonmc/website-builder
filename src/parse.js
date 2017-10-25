import path from 'path';

const fileFilter = fileKey => path.extname(fileKey).toLowerCase() === '.json';

const parse = options => {
  return (files, metalsmith, done) => {
    const metadata = metalsmith.metadata();
    metadata.movie = [];
    metadata.actor = [];

    // TODO: delete test files

    Object.keys(files)
      .filter(fileFilter)
      .forEach(fileKey => {
        const file = files[fileKey];

        if (fileKey.match(/^movies\//)) {
          file.layout = 'movie';
        } else if (fileKey.match(/^actors\//)) {
          file.layout = 'actor';
        }
        file.filename = fileKey;
        file.url = '/' + file.filename.replace('.json', '/');

        try {
          const data = JSON.parse(file.contents.toString());
          Object.keys(data).forEach(
            dataKey => file[dataKey] = data[dataKey]
          );

          if (file.layout === 'movie' || file.layout === 'actor') {
            metadata[file.layout].push(file);
          }
        } catch (ex) {
          console.error(`Cannot parse file ${fileKey}`);
        }
      });

    done();
  };
};

export default parse;
