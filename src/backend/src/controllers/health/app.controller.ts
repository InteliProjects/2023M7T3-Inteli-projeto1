import { Controller, Get, Post, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ConsumerService } from 'src/services/kafka/consumer.service';
import { ProducerService } from 'src/services/kafka/producer.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';


@Controller()
export class AppController {
  constructor(
    private readonly producerService: ProducerService,
    private readonly consumerService: ConsumerService,
  ) {}

  @Get('health')
  async getHello() {
    await this.producerService.produce({
      topic: 'client-producer-topic',
      messages: [
        {
          value: 'hello world',
        },
      ],
    });

    const message = await this.consumerService.consume('result');
    return message;
  }
}
