const filter = options => {
  return (files, metadata, done) => {
    const fileNames = Object.keys(files);
    
    fileNames.forEach(fileKey => {
      if (!fileKey.match(/^\/?(movies|actors)\/.*\.json$/)) {
        delete files[fileKey];
      }
    });

    done();
  };
};

export default filter;