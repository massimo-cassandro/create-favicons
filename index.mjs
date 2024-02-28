#!/usr/bin/env node

/* eslint-disable no-console */
/* eslint-env node */


import * as fs from 'fs';
import * as path from 'path';

import chalk from 'chalk';

import { createFavicons } from './src/create-favicons.mjs';
import { defaults } from './src/defaults.mjs';
import { init } from './src/init.mjs';

// nome del file di configurazione, se utilizzato
const cfg_filename = 'create-favicons-cfg.mjs';

try {

  // init: creazione file cfg base
  if(process.argv.indexOf('init') !== -1) {

    init();

  } else {

    let params = {};
    const dir_param_idx = process.argv.findIndex(el => /^--dir/.test(el) );

    if(dir_param_idx !== -1) {
      [, params.work_dir] = process.argv[dir_param_idx].split('=');

    } else {
      params.work_dir = './';
    }

    if(fs.existsSync(path.resolve(params.work_dir, cfg_filename))) {

      import(path.resolve(params.work_dir, cfg_filename))
        .then((custom_params) => {

          if(Array.isArray(custom_params.default)) {

            custom_params.default.forEach(item => {
              createFavicons({ ...defaults, ...params, ...item });
            });

          } else {
            createFavicons({ ...defaults, ...params, ...custom_params.default });
          }
        });

    } else if(fs.existsSync(path.resolve(params.work_dir, defaults.src_img))) {

      createFavicons({...defaults, ...params});

    } else {

      throw `'${cfg_filename}' e '${defaults.src_img}' non presenti`;
    }

  }



} catch(err) {
  console.error(chalk.bgRed(`\n ${err} \n`));
}
