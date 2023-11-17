import {
    Controller,
    HttpException,
    HttpStatus,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ConsumerService } from '../../services/kafka/consumer.service';
import { ProducerService } from '../../services/kafka/producer.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from 'multer';
import { Logger } from '@nestjs/common'; // Importe o módulo Logger

@Controller('api')
export class SpeechToTextController {
    private readonly logger = new Logger(SpeechToTextController.name); // Crie uma instância do Logger

    constructor(
        private readonly producerService: ProducerService,
        private readonly consumerService: ConsumerService,
    ) { }

    @Post('transcriptAudio')
    @UseInterceptors(FileInterceptor('audio'))
    async speechToText(@UploadedFile() audio: MulterFile) {
        if (!audio) {
            this.logger.error('Nenhum arquivo enviado'); // Adicione um log de erro
            throw new HttpException('Nenhum arquivo enviado', HttpStatus.BAD_REQUEST);
        }

        this.logger.log('Arquivo enviado com sucesso'); // Adicione um log de informação

        await this.producerService.produce({
            topic: 'client-producer-topic',
            messages: [
                {
                    value: JSON.stringify(audio),
                },
            ],
        });

        this.logger.log('Mensagem enviada para o Kafka'); // Adicione um log de informação

        const message = await this.consumerService.consume('result');
        this.logger.log('Mensagem consumida do Kafka'); // Adicione um log de informação

        return message;
    }
}
