import path from 'path';


const buildIndex = options => {
  return (files, metalsmith, done) => {
    var metadata = metalsmith.metadata();

    const fileData = {
      mode: '0644',
      layout: 'frontpage',
      contents: new Buffer(''),
    };

    files['index.html'] = fileData;

    done();
  };
};

export default buildIndex;