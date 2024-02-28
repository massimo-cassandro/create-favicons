/* eslint-disable no-console */
import chalk from 'chalk';

export function printFrame(options) {

  /*
    stringsArray = [
      {string: '__string__', color: 'green', bg: false, bold: false, underline: false},
      {...}
    ]
  */

  const defaults = {
      strings: [],
      frameColor: 'green',
      frametype: 'single'
    },
    string_defaults = { string: '', color: 'green', bg: false, bold: false, underline: false},
    frame_lines = {
      single: ['┌', '┐', '└', '┘', '┈', '│'],
      double: ['╔', '╗', '╚', '╝', '═', '║']
    };

  options = {...defaults, ...options};

  const frames_elements = frame_lines[options.frametype];

  options.strings = options.strings.map(item => {return {...string_defaults, ...item }; });

  // TODO bold underline ecc...
  // aggiunta spazi sulle righe `bg`
  options.strings.forEach(item => {
    if(/^bg/.test(item.color)) {
      item.string = ` ${item.string} `;
    }
  });

  const total_length = Math.max( ...(options.strings.map(item => item.string.length)) ) + 2;

  console.log( chalk[options.frameColor]( `\n${frames_elements[0]}` + frames_elements[4].repeat(total_length) + frames_elements[1]) );

  options.strings.forEach(item => {
    console.log(
      chalk[options.frameColor](`${frames_elements[5]} `) +
      chalk[item.color](item.string)  + ' '.repeat(total_length - item.string.length - 2) +
      chalk[options.frameColor](` ${frames_elements[5]}`)
    );
  });

  console.log( chalk[options.frameColor]( frames_elements[2] + frames_elements[4].repeat(total_length) + `${frames_elements[3]}\n` ) );
}
