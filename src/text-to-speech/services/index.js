const { IamAuthenticator } = require('ibm-watson/auth');
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const webhooks = require('node-webhooks');

class TextToSpeechService {
    async synthesizeText(inputText) {
        const apiKey = process.env.IBM_API_KEY;
        const serviceUrl = process.env.IBM_API_URL;
        const webhookURL = "http://localhost:3000/testToSpeech/receiveBuffer";

        const textToSpeech = new TextToSpeechV1({
            authenticator: new IamAuthenticator({
                apikey: apiKey,
            }),
            serviceUrl: serviceUrl,
        });

        console.log("Setting parameters...");
        const synthesizeParams = {
            text: inputText,
            accept: 'audio/mpeg',
            voice: 'pt-BR_IsabelaV3Voice',
        };

        try {
            console.log("Synthesizing...");
            const response = await textToSpeech.synthesize(synthesizeParams);

            const repairBuffer = await new Promise((resolve, reject) => {
                const chunks = [];
                response.result.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                response.result.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });
                response.result.on('error', reject);
            });

            const base64Buffer = repairBuffer.toString('base64');
            const data = {
                "buffer": base64Buffer
            };
            console.log(base64Buffer)

            this.webhook = new webhooks({
                db: { 'callback_hook': [webhookURL] }
            });
            try {
                await this.webhook.trigger('callback_hook', { data: data });
                return {
                    message: "Texto enviado com sucesso para a API backend",
                    buffer: repairBuffer
                };
            } catch (error) {
                throw new Error('Erro ao enviar o buffer para a API backend');
            }
        } catch (err) {
            console.log('error: ', err);
            throw err;
        }
    }
}

module.exports = TextToSpeechService;
