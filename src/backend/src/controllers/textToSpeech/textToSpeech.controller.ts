import { Controller, Post, Body, HttpStatus, Res, Logger } from '@nestjs/common';
import { WebhookService } from '../../services/webHook/webHook.service';
import { Response } from 'express';

@Controller('testToSpeech')
export class TextToSpeechController {
  private readonly logger = new Logger(TextToSpeechController.name);

  constructor(
    private readonly webhookService: WebhookService,
  ) { }

  @Post('sendText')
  async sendText(@Body() dataText: string) {
    try {
      this.logger.log('Recebido texto para processamento: ' + dataText);
      const hooks = this.webhookService.sendTextHooks(dataText);
      return hooks;
    } catch (error) {
      this.logger.error('Erro ao enviar texto para processamento: ' + error.message);
      throw error;
    }
  }

  @Post('receiveBuffer')
  async receiveBuffer(@Body() dataBuffer: any, @Res() res: Response) {
    try {
      this.logger.log('Dentro do callback hook: ' + JSON.stringify(dataBuffer));
      return res
        .status(HttpStatus.OK)
        .json({ success: true, data: dataBuffer });
    } catch (error) {
      this.logger.error('Erro ao receber o buffer da API de text to speech: ' + error.message);
      throw new Error('Erro ao receber o buffer da API de text to speech');
    }
  }
}
