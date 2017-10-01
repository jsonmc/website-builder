import metalsmith from 'metalsmith';
import path from 'path';

import parse from './parse';
import categories from './categories';
import layout from './layout';

const jsonSource = path.join(__dirname, '..', 'json');
const webOutput = path.join(__dirname, '..', 'web');

metalsmith(__dirname)
  .source(jsonSource)
  .destination(webOutput)
  .clean(true)
  .use(parse())
  .use(categories())
  // TODO: A plugin to organize years
  .use(layout())
  .build(err => {
    if (err) throw err;
  });
