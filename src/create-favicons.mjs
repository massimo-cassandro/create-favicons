/* eslint-disable no-console */

import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

import sharp from 'sharp';
import toIco from 'to-ico';
import { optimize } from 'svgo';

import { printFrame } from './print-frame.mjs';
import { remove_homedir_string } from './remove-homedir-string.mjs';


export function createFavicons(params) {

  // const files = [];

  try {

    const output_dir = path.resolve(params.work_dir, params.output_dir);

    if (!fs.existsSync(output_dir)){
      fs.mkdirSync(output_dir);
    }


    // https://sharp.pixelplumbing.com/api-constructor
    // https://sharp.pixelplumbing.com/api-output#png
    Promise.all([
      ['apple-touch-icon.png', 180],
      ['icon-192.png', 192],
      ['icon-512.png', 512]
    ].map(size => {
      sharp(path.resolve(params.work_dir, params.src_img))
        .resize({ width: size[1], fit: 'inside' })
        .png(params.png_parameters)
        // .then(info => console.log(info))
        // .toFile(`${output_dir}/${size[0]}`)
        .toBuffer()
        .then(bufferData => {
          fs.writeFileSync(`${output_dir}/${size[0]}`, bufferData);

          const stats = fs.statSync(`${output_dir}/${size[0]}`);
          // console.log(`${size[0]}: ${(stats.size / 1024).toFixed(2)} kb`);
          // files.push(`${size[0]}: ${(stats.size / 1024).toFixed(2)} kb`);

        })
        .catch(err => { throw err; });

    }));

    // favicon.ico
    // https://github.com/kevva/to-ico
    // alternativa: https://github.com/steambap/png-to-ico

    // const ico_source = fs.readFileSync(`${output_dir}/apple-touch-icon.png`);

    sharp(path.resolve(params.work_dir, params.small_src_img?? params.src_img))
      .png()
      // .then(info => console.log(info))
      .toBuffer()
      .then(bufferData => {

        toIco([bufferData], {
          sizes: [16, 32],
          resize: true
        }).then( result => {
          fs.writeFileSync(`${output_dir}/favicon.ico`, result);
        });

      })
      .catch(err => { throw err; });


    // favicon.svg (SVGO)
    // TODO add extra config ???
    const svgString = fs.readFileSync(path.resolve(params.work_dir, params.small_src_img?? params.src_img), 'utf8');
    const svg_result = optimize(svgString, {
      multipass: true,
    });
    fs.writeFileSync(`${output_dir}/favicon.svg`, svg_result.data, {force: true});

    // web manifest
    const manifest = {
      icons: [192, 512].map( size => {
        return { src: `./icon-${size}.png`, type: 'image/png', sizes: `${size}x${size}` };
      }),
      ...(params.webmanifest_extra?? {})
    };

    fs.writeFileSync(`${output_dir}/manifest.webmanifest`, JSON.stringify(manifest, null, ' '));


    const snippet_path = params.snippet_path? path.resolve(params.work_dir, params.snippet_path) : output_dir;

    // snippet
    if(params.snippet_name || params.snippet_target_file) {

      if (!params.snippet_target_file && !fs.existsSync(snippet_path)){
        fs.mkdirSync(snippet_path);
      }

      params.snippet_language = params.snippet_language.toLowerCase();

      const cache_buster = params.add_cache_buster? `?_=${Date.now()}` : '',
        create_href = nome_file => params.href_template.replace('%_file_name_%', nome_file)
          .replace('%_cache_buster_%', cache_buster);


      let snippet_content = `<link rel="icon" href="${create_href('favicon.ico')}" sizes="any">\n` +
        `<link rel="icon" href="${create_href('favicon.svg')}" type="image/svg+xml">\n` +
        `<link rel="apple-touch-icon" href="${create_href('apple-touch-icon.png')}">\n` +
        `<link rel="manifest" href="${create_href('manifest.webmanifest')}">`;

      if (params.snippet_language === 'pug') {
        snippet_content = snippet_content.replace(/<link (.*?)>/g, 'link($1)');
      }

      snippet_content = params.snippet_template.replace('%_link_tags_%', snippet_content);

      if (params.snippet_target_file) {

        params.snippet_target_file = path.resolve(params.work_dir, params.snippet_target_file);

        if (fs.existsSync(params.snippet_target_file)) {
          const targetFileContent = fs.readFileSync(path.resolve(params.snippet_target_file), 'utf8'),
            regexp = /<!-- ?favicon-snippet-start ?-->(.*?)<!-- ?favicon-snippet-end ?-->/mis;

          fs.writeFileSync(params.snippet_target_file,
            targetFileContent.replace(regexp,
              `<!-- favicon-snippet-start -->\n${snippet_content}\n<!-- favicon-snippet-end -->`
            )
          );

        } else {
          throw `Il file '${params.snippet_target_file}' non esiste`;
        }

      } else {

        fs.writeFileSync(
          `${snippet_path}/${params.snippet_name}`,
          snippet_content
        );

      }
    }

    // print result
    let extra_strings = [];

    if(snippet_path !== output_dir && params.snippet_name !== null) {
      extra_strings = [
        {string: ''},
        {string: `Il file snippet '${params.snippet_name}' è stato salvato nella directory:`, color: 'green'},
        {string: remove_homedir_string(snippet_path), color: 'yellow'},
      ];

    } else if(params.snippet_name === null) {
      extra_strings = [
        {string: ''},
        {string: 'Il file snippet non è stato generato', color: 'magentaBright'},
      ];
    }


    printFrame({
      strings: [
        {string: '** Creazione favicons completata **', color: 'bgGreen'},
        {string: ''},
        {string: 'I file generati sono nella directory:', color: 'green'},
        {string: remove_homedir_string(output_dir), color: 'yellow'},
        // {string: ''},
        // {string: '*' + files.join('\n'), color: 'yellow'},
        ...extra_strings
      ],
      frameColor: 'green',
      frameType: 'single'
    });

  } catch(err) {

    console.error(chalk.bgRed(` ${err} `));
  }

}
