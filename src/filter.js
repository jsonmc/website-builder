// Filter files

// TODO: Add filter options to the options

const filter = options => {
  return (files, metadata, done) => {
    const fileNames = Object.keys(files);
    
    fileNames.forEach(fileKey => {
      if (!fileKey.match(/^\/?(movies|actors)\/.*\.json$/) && !fileKey.match(/\.(css|less|html?)$/)) {
        delete files[fileKey];
      }
    });

    done();
  };
};

export default filter;