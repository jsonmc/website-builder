import metalsmith from 'metalsmith';
import path from 'path';

import parse from './parse';
import categories from './categories';
import layout from './layout';
import buildIndex from './build_index';

const jsonSource = path.join(__dirname, '..', 'json');
const webOutput = path.join(__dirname, '..', 'web');

const layoutOptions = {
};

metalsmith(__dirname)
  .source(jsonSource)
  .destination(webOutput)
  .clean(true)
  .use(parse())
  .use(categories())
  // TODO: A plugin to organize years
  .use(buildIndex())
  .use(layout(layoutOptions))
  .build(err => {
    if (err) throw err;
  });
