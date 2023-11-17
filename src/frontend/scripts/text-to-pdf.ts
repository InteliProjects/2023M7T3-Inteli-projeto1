import * as fs from 'fs';
import * as path from 'path';
import { texto } from './mock.js';

const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');

const caminhoPastaDocs = path.join(__dirname, '../docs');

if (!fs.existsSync(caminhoPastaDocs)) {
  fs.mkdirSync(caminhoPastaDocs);
}

const caminhoArquivoPDF = path.join(caminhoPastaDocs, 'exemplo.pdf');

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const documentDefinition = {
  content: [
    { text: texto, fontSize: 14 },
  ],
};

const pdfDoc = pdfMake.createPdf(documentDefinition);

pdfDoc.getBuffer(async (buffer: any) => {
  try {
    fs.writeFileSync(caminhoArquivoPDF, buffer);
    console.log(`PDF criado com sucesso: ${caminhoArquivoPDF}`);
  } catch (error) {
    console.error(`Erro ao salvar o PDF: ${error}`);
  }
});
