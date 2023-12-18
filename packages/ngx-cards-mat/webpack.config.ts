import webpackMerge from 'webpack-merge';
import { Configuration } from 'webpack';
import baseConfig from '~~webpack.config';
import { resolve } from 'node:path';
import { getEntriesSync, readSync } from '@engineers/nodejs';

let tsConfig = readSync(resolve(__dirname, 'tsconfig.json')) as {
  [key: string]: any;
};
let entry: { [key: string]: string } = {};
// convert path to posix, i.e using "/" in all platforms
let pattern = new RegExp(`${__dirname.replace(/\\/g, '/')}/(.+).ts$`);
for (let file of getEntriesSync(__dirname, /(?<!.config|.spec).ts$/)) {
  entry[file.replace(/\\/g, '/').match(pattern)![1]] = file;
}

export default webpackMerge(baseConfig, {
  entry,
  output: {
    path: resolve(__dirname, tsConfig.compilerOptions.outDir),
  },
});
