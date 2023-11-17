import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { S3 } from 'aws-sdk';
const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');

@Injectable()
export class FileUpService {
  private readonly s3: S3;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadToS3(
    file: any[],
    fileName: string,
    bucketName: string,
  ): Promise<string> {
    try {
      const apiKey = process.env.API_KEY;
      const url = process.env.URL;

      if (!apiKey || !url) {
        throw new Error(
          'As variáveis de ambiente API_KEY e URL não foram configuradas corretamente.',
        );
      }

      const audioData = file[0].buffer;

      const response = await axios.post(url, audioData, {
        auth: {
          username: 'apikey',
          password: apiKey,
        },
        headers: {
          'Content-Type': 'audio/flac',
          model: 'pt-BR_BroadbandModel',
        },
      });

      const transcript = response.data.results
        .map((result) => result.alternatives[0].transcript)
        .join(' ');

      pdfMake.vfs = pdfFonts.pdfMake.vfs;

      const documentDefinition = {
        content: [{ text: transcript, fontSize: 14 }],
      };

      const pdfDoc = pdfMake.createPdf(documentDefinition);

      const bufferPromise = new Promise<Buffer>((resolve, reject) => {
        pdfDoc.getBuffer((buffer: any) => {
          if (buffer) {
            resolve(buffer);
          } else {
            reject(new Error('Erro ao gerar PDF'));
          }
        });
      });

      const buffer = await bufferPromise;

      const params = {
        Bucket: bucketName,
        Key: `pdfs/audioFile.pdf`,
        Body: buffer,
      };

      const { Location } = await this.s3.upload(params).promise();

      return Location;
    } catch (error) {
      console.error('Error:', error.message);
      return error;
    }
  }
}
