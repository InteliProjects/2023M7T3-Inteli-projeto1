import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TextToSpeechService {
    private readonly logger = new Logger(TextToSpeechService.name);

    // lógica para enviar o texto para o serviço de text to speech
    async sendText(dataText: string): Promise<any> {
        const urlReceiveText = 'http://localhost:3030/api/transcriptText';
        try {
            this.logger.log(`Enviando texto para API de text to speech: ${dataText}`);
            const response = await axios.post(urlReceiveText, { data: dataText });
            this.logger.log(`Texto enviado com sucesso: ${dataText}`);
            return response.data;
        } catch (error) {
            this.logger.error('Erro ao enviar o texto para a API de text to speech', error);
            throw new Error('Erro ao enviar o texto para a API de text to speech');
        }
    }
}
