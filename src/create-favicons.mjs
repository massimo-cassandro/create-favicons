/* eslint-disable no-console */

// import * as fs from 'fs';
// import * as path from 'path';
import chalk from 'chalk';

import { createIco } from './create-ico.mjs';
import { createPng } from './create-png.mjs';
import { createSvg } from './create-svg.mjs';
import { createWebmanifest } from './create-webmanifest.mjs';
import { createSnippet } from './create-snippet.mjs';
import { printResult } from './print-result.mjs';


export async function createFavicons(params) {

  try {

    console.error(chalk.green('Creating favicons...'));

    await Promise.all([
      createSvg(params),
      createPng(params),
      createIco(params),
      createWebmanifest(params),
      createSnippet(params),
    ])
      .then(result => {
        printResult(params);

      })

  } catch(err) {
    console.error(chalk.bgRed(` ${err} `));
  }

}
