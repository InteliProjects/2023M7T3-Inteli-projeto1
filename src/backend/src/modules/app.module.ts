import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from '../controllers/health/app.controller';
import { TextToSpeechController } from '../controllers/textToSpeech/textToSpeech.controller';
import { TextToSpeechService } from '../services/textToSpeech/textToSpeech.service';
import { KafkaModule } from './kafka.module';
import { SpeechToTextController } from 'src/controllers/speechToText/speechToText.controller';
import { WebhookService } from 'src/services/webHook/webHook.service';
import { UploadsController } from 'src/controllers/fileUp/fileUp.controller';
import { FileUpService } from 'src/services/fileUp/fileUp.service';

@Module({
  imports: [HttpModule, KafkaModule],
  controllers: [AppController, TextToSpeechController, SpeechToTextController, UploadsController],
  providers: [TextToSpeechService, WebhookService, FileUpService],
})
export class AppModule { }
