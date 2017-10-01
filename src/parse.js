import path from 'path';

const fileFilter = fileKey => path.extname(fileKey).toLowerCase() === '.json';

const parse = options => {
  return (files, metalsmith, done) => {
    Object.keys(files)
      .filter(fileFilter)
      .forEach(fileKey => {
        const file = files[fileKey];

        if (fileKey.match(/^movies\//)) {
          file.layout = 'movie';
        } else if (fileKey.match(/^actors\//)) {
          file.layout = 'actor';
        }

        try {
          const data = JSON.parse(file.contents.toString());
          Object.keys(data).forEach(
            dataKey => file[dataKey] = data[dataKey]
          );

        } catch (ex) {
          console.error(`Cannot parse file ${fileKey}`);
        }
      });

    done();
  };
};

export default parse;
