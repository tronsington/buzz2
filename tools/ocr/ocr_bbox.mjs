import { PNG } from 'pngjs';
import { createWorker, PSM } from 'tesseract.js';
import fs from 'fs';

const png = PNG.sync.read(fs.readFileSync('dylan-aa-screenshot.png'));
const W = png.width, H = png.height, D = png.data;

function crop(x0, y0, x1, y1, name, S) {
  const w = x1 - x0, h = y1 - y0;
  const out = new PNG({ width: w * S, height: h * S });
  for (let y = 0; y < h * S; y++) for (let x = 0; x < w * S; x++) {
    const si = ((y0 + Math.floor(y / S)) * W + (x0 + Math.floor(x / S))) * 4;
    const di = (y * out.width + x) * 4;
    out.data[di] = D[si]; out.data[di + 1] = D[si + 1]; out.data[di + 2] = D[si + 2]; out.data[di + 3] = 255;
  }
  fs.writeFileSync(name, PNG.sync.write(out));
}

const worker = await createWorker('eng', 1, { langPath: '.', cachePath: '.' });

// full-image bbox line dump at scale 2
crop(0, 0, W, H, 'full2x.png', 2);
await worker.setParameters({ tessedit_pageseg_mode: PSM.AUTO, preserve_interword_spaces: '1' });
const { data } = await worker.recognize('full2x.png', {}, { blocks: true });
const lines = [];
for (const b of data.blocks || []) for (const p of b.paragraphs || []) for (const l of p.lines || []) {
  const t = l.text.replace(/\s+/g, ' ').trim();
  if (t) lines.push({ y: Math.round(l.bbox.y0 / 2), x: Math.round(l.bbox.x0 / 2), t });
}
lines.sort((a, b) => a.y - b.y);
console.log('== FULL LINE DUMP (y, x, text) ==');
for (const l of lines) console.log(`y=${String(l.y).padStart(4)} x=${String(l.x).padStart(3)}  ${l.t}`);

// targeted zooms
for (const [y0, y1, name] of [[1090, 1275, 'z1.png'], [1575, 1665, 'z2.png'], [180, 320, 'z3.png'], [2300, 2400, 'z4.png']]) {
  crop(0, y0, W, y1, name, 5);
  await worker.setParameters({ tessedit_pageseg_mode: PSM.SINGLE_BLOCK, preserve_interword_spaces: '1' });
  const r = await worker.recognize(name);
  console.log(`== ZOOM ${y0}-${y1} ==\n${r.data.text.replace(/[ \t]+/g, ' ').replace(/\n{2,}/g, '\n').trim()}`);
}
await worker.terminate();
console.log('DONE');
