import { Injectable, Logger } from '@nestjs/common';
const webhooks = require('node-webhooks');

@Injectable()
export class WebhookService {
    private webhook;
    private readonly logger = new Logger(WebhookService.name);

    constructor() {
        this.webhook = new webhooks({
            db: { 'callback_hook': ['http://localhost:3030/api/transcriptText'] }
        });
    }

    async sendTextHooks(dataText) {
        try {
            this.logger.log(`Enviando texto para API de text to speech: ${dataText}`);
            await this.webhook.trigger('callback_hook', { data: dataText });
            this.logger.log(`Texto enviado com sucesso: ${dataText}`);
            return 'Texto enviado com sucesso para a API de text to speech';
        } catch (error) {
            this.logger.error('Erro no webhook ao enviar o texto para a API de text to speech', error);
            throw new Error('Erro no webhook ao enviar o texto para a API de text to speech');
        }
    }
}
