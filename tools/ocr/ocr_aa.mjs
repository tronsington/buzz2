import { PNG } from 'pngjs';
import { createWorker, PSM } from 'tesseract.js';
import fs from 'fs';

const FILE = 'dylan-aa-screenshot.png';
const png = PNG.sync.read(fs.readFileSync(FILE));
const W = png.width, H = png.height, D = png.data;
console.log(`IMAGE ${W}x${H}`);

// luminance helper
const lum = (x, y) => {
  const i = (y * W + x) * 4;
  return 0.2126 * D[i] + 0.7152 * D[i + 1] + 0.0722 * D[i + 2];
};

function bandLum(y0, y1) {
  let s = 0, n = 0;
  for (let y = y0; y < y1; y += 4) for (let x = 0; x < W; x += 8) { s += lum(x, y); n++; }
  return s / n;
}

function crop(x0, y0, x1, y1, name, S, invert) {
  const w = x1 - x0, h = y1 - y0;
  const out = new PNG({ width: w * S, height: h * S });
  for (let y = 0; y < h * S; y++) for (let x = 0; x < w * S; x++) {
    const si = ((y0 + Math.floor(y / S)) * W + (x0 + Math.floor(x / S))) * 4;
    const di = (y * out.width + x) * 4;
    let r = D[si], g = D[si + 1], b = D[si + 2];
    if (invert) { r = 255 - r; g = 255 - g; b = 255 - b; }
    out.data[di] = r; out.data[di + 1] = g; out.data[di + 2] = b; out.data[di + 3] = 255;
  }
  fs.writeFileSync(name, PNG.sync.write(out));
}

// 4 bands of ~600px
const bands = [[0, 600], [600, 1200], [1200, 1800], [1800, 2400]];
const worker = await createWorker('eng', 1, { langPath: '.', cachePath: '.' });

for (const [y0, y1] of bands) {
  const L = bandLum(y0, y1);
  const inv = L < 128;
  const name = `band_${y0}.png`;
  crop(0, y0, W, y1, name, 3, inv);
  console.log(`\n##### BAND y=${y0}-${y1} meanLum=${L.toFixed(0)} inverted=${inv} #####`);
  for (const psm of [PSM.AUTO, PSM.SPARSE_TEXT]) {
    await worker.setParameters({ tessedit_pageseg_mode: psm, preserve_interword_spaces: '1' });
    const { data } = await worker.recognize(name);
    const txt = data.text.replace(/[ \t]+/g, ' ').replace(/\n{2,}/g, '\n').trim();
    console.log(`--- PSM ${psm} conf=${data.confidence} ---`);
    console.log(txt || '(empty)');
  }
}
await worker.terminate();
console.log('\nDONE');
