const parseActorContents = file => {
  return file;
};

const parseMovieContents = file => {
  return file;
};

const layout = options => {
  return (files, metalsmith, done) => {
    const allFiles = Object.keys(files);

    allFiles.forEach(fileName => {
      const file = files[fileName];

      switch (file.layout) {
        case 'movie': {
          delete files[fileName];
          const newFileName = fileName.replace('.json', '/index.html');
          files[newFileName] = parseMovieContents(file);
        };

        case 'actor': {
          delete files[fileName];
          const newFileName = fileName.replace('.json', '/index.html');
          files[newFileName] = parseActorContents(file);
        };

        default:
          break;
      };
    })

    done();
  };
};

export default layout;
