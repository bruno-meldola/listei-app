// Gerador de PNGs leves para o PWA
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(width, height) {
  // Cria um PNG monocromático básico com fundo escuro e detalhes
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw image data: scanlines with filter byte 0
  const scanlineLength = width * 4 + 1;
  const rawData = Buffer.alloc(scanlineLength * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.42;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Fundo escuro com cantos arredondados
      if (Math.abs(dx) < radius && Math.abs(dy) < radius) {
        // Corpo da sacola
        if (x > cx - width * 0.28 && x < cx + width * 0.28 && y > cy - height * 0.2 && y < cy + height * 0.3) {
          // Checkmark dentro
          const inCheck = (x > cx - width * 0.15 && x < cx - width * 0.02 && Math.abs(y - (cy + (x - (cx - width * 0.15)))) < width * 0.03) ||
                          (x >= cx - width * 0.02 && x < cx + width * 0.18 && Math.abs(y - (cy + width * 0.13 - (x - (cx - width * 0.02)))) < width * 0.03);
          if (inCheck) {
            rawData[pxOffset] = 18;     // R
            rawData[pxOffset + 1] = 18; // G
            rawData[pxOffset + 2] = 18; // B
            rawData[pxOffset + 3] = 255;
          } else {
            rawData[pxOffset] = 248;     // R
            rawData[pxOffset + 1] = 249; // G
            rawData[pxOffset + 2] = 250; // B
            rawData[pxOffset + 3] = 255;
          }
        } else {
          rawData[pxOffset] = 18;     // R
          rawData[pxOffset + 1] = 18; // G
          rawData[pxOffset + 2] = 18; // B
          rawData[pxOffset + 3] = 255;
        }
      } else {
        // Transparente / fundo
        rawData[pxOffset] = 18;
        rawData[pxOffset + 1] = 18;
        rawData[pxOffset + 2] = 18;
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(8 + length + 4);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = calculateCrc(chunk.subarray(4, 8 + length));
  chunk.writeUInt32BE(crc, 8 + length);
  return chunk;
}

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1));
  }
  crcTable[n] = c;
}

function calculateCrc(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

const pubDir = path.join(__dirname, 'public');
if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

fs.writeFileSync(path.join(pubDir, 'icon-192.png'), createPng(192, 192));
fs.writeFileSync(path.join(pubDir, 'icon-512.png'), createPng(512, 512));
fs.writeFileSync(path.join(pubDir, 'apple-touch-icon.png'), createPng(180, 180));
console.log('✅ Ícones PWA gerados com sucesso!');
