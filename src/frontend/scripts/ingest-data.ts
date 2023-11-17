import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/utils/pinecone-client';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { PINECONE_INDEX_NAME } from '@/config/pinecone';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import fs from 'fs/promises';
import f from 'fs';

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-provider-env';

const credentials = fromEnv();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials,
})

const filePath = 'docs';

export const run = async () => {
  try {
    const s3Params = {
      Bucket: 'pdf-upload-sherlock',
      Key: 'pdfs/audioFile.pdf',
    };

    const response = await s3Client.send(new GetObjectCommand(s3Params));
    if (!response.Body) {
      throw new Error('Failed to get file from S3');
    }
    const localFilePath = './docs/audioFile.pdf';

    const localFileStream = f.createWriteStream(localFilePath);

    // @ts-ignore
    response.Body.pipe(localFileStream);

    await new Promise((resolve, reject) => {
      localFileStream.on('finish', resolve);
      localFileStream.on('error', reject);
    });

    /*load raw docs from the all files in the directory */
    const directoryLoader = new DirectoryLoader(filePath, {
      '.pdf': (path) => new PDFLoader(path),
    });

    const files = await fs.readdir(filePath);
    if (files.length === 0) {
      console.log('Não há arquivos na pasta "docs". O código não será executado.');
      return;
    }

    // const loader = new PDFLoader(filePath);
    const rawDocs = await directoryLoader.load();

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);
    console.log('AQUI O DOCUMENTO VIRA TEXTO', docs);

    console.log('creating vector store...');
    /*create and store the embeddings in the vectorStore*/
    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(PINECONE_INDEX_NAME); //change to your own index name

    //embed the PDF documents
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      textKey: 'text',
    });
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

(async () => {
  await run();
  console.log('ingestion complete');
})();