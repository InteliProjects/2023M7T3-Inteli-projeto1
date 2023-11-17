const TextToSpeechService = require("../services");
const textToSpeechService = new TextToSpeechService();

//endpoint que pega o texto vindo do back (integrado com webhooks) e faz a sintetização de texto para áudio e envia o buffer para o back
exports.transcriptText = async (req, res) => {
    try {
        // mostra o texto passado no body do sendText vindo do back
        console.log('Inside Callback hook', req.body)
        const inputText = req.body.data.text;
        if (!inputText) {
            return res.status(400).json({ error: 'Texto não fornecido na solicitação.' });
        }
        const audioBuffer = await textToSpeechService.synthesizeText(inputText);
        // const hooks = await textToSpeechService.sendBufferHooks(inputText);
        res.setHeader('Content-Type', 'audio/mpeg');
        res.status(200).send(audioBuffer);
    }
    catch (err) {
        console.error('Erro:', err);
        res.status(500).json({ error: 'Ocorreu um erro durante a síntese de texto.' });
    }
}

