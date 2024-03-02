import * as fs from 'fs/promises';

export async function createWebmanifest(params) {
  // web manifest
  const manifest = {
    icons: [192, 512].map( size => {
      return { src: `./icon-${size}.png`, type: 'image/png', sizes: `${size}x${size}` };
    }),
    ...(params.webmanifest_extra?? {})
  };

  fs.writeFile(`${params.output_dir}/manifest.webmanifest`, JSON.stringify(manifest, null, ' '));

}
