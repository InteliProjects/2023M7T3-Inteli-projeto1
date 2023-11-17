import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileUpService } from '../../services/fileUp/fileUp.service';

@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly fileUpService: FileUpService,
  ) {}

  // @Post('pdf')
  // @UseInterceptors(FileInterceptor('pdf'))
  // async uploadPdf(@UploadedFile() pdf): Promise<string> {
  //   const fileName = pdf.originalname;
  //   const fileBuffer = pdf.buffer;
  //   const bucketName = 'pdf-upload-sherlock';

  //   const fileUrl = await this.s3Service.uploadFile(
  //     fileBuffer,
  //     fileName,
  //     bucketName,
  //   );

  //   return fileUrl;
  // }

  @Post('audio')
  @UseInterceptors(FilesInterceptor('file', 2))
  async uploadAudio(@UploadedFiles() file) {
    const fileName = file[0].originalname;
    const bucketName = 'pdf-upload-sherlock';

    try {
      const result = await this.fileUpService.uploadToS3(
        file,
        fileName,
        bucketName,
      );

      return result;
    } catch (error) {
      return { error: 'Erro ao processar upload e transcrição de áudio' };
    }
  }
}
