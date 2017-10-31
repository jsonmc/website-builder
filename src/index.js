import metalsmith from 'metalsmith';
import metalsmithLesser from 'metalsmith-lesser';
import path from 'path';

import filter from './filter';
import parse from './parse';
import categories from './categories';
import layout from './layout';
import buildIndex from './build_index';
import addFolder from './add_folder';

const jsonSource = path.join(__dirname, '..', 'json');
const webOutput = path.join(__dirname, '..', 'web');

const staticFilesFolder = path.join(__dirname, 'static');

const layoutOptions = {
};

metalsmith(__dirname)
  .source(jsonSource)
  .destination(webOutput)
  .clean(true)
  .use(addFolder(staticFilesFolder))
  .use(filter())
  .use(parse())
  .use(categories())
  // TODO: A plugin to organize years
  .use(buildIndex())
  .use(layout(layoutOptions))
  .use(metalsmithLesser({}))
  .build(err => {
    if (err) throw err;
  });
