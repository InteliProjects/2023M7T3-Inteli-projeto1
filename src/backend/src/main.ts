import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
const cors = require('cors');
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config(); 

// Caminho para a pasta docs
const docsFolderPath = path.join(__dirname, '..', '..', '..', 'frontend', 'docs');

async function bootstrap() {
  limparArquivosPDF(docsFolderPath);

  const app = await NestFactory.create(AppModule);
  app.use(cors())
  await app.listen(3000);
}

// Função para limpar arquivos PDF na pasta
function limparArquivosPDF(pastaAlvo) {
  fs.readdirSync(pastaAlvo).forEach((arquivo) => {
    const caminhoArquivo = path.join(pastaAlvo, arquivo);
    if (arquivo.toLowerCase().endsWith('.pdf')) {
      fs.unlinkSync(caminhoArquivo);
      console.log(`Arquivo ${caminhoArquivo} apagado.`);
    }
  });
}

bootstrap();
