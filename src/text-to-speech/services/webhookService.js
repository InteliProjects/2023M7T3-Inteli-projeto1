
class WebhookService {
    constructor() {
        this.webhook = new webhooks({
            db: { 'callback_hook': ['http://localhost:3030/api/transcriptText'] }
        });
    }

    async sendTextHooks(dataText) {
        try {
            await this.webhook.trigger('callback_hook', { data: dataText });
            return 'Texto enviado com sucesso para a API de text to speech';
        } catch (error) {
            throw new Error('Erro ao enviar o texto para a API de text to speech');
        }
    }
}


