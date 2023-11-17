const express = require('express');
const bodyParser = require('body-parser');
const transcriptRoutes = require('./routes/index');
const { Kafka } = require('kafkajs');
const { transcriptAudio } = require('./controllers');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3333;

const kafka = new Kafka({
  clientId: 'express-backend',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'express-group' });
const producer = kafka.producer();

const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: 'client-producer-topic',
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const text = await transcriptAudio(message.value)

      console.log("Transcrição: ", text)

      const result = `Transcrição: ${text}`;

      await producer.connect();
      await producer.send({
        topic: 'result',
        messages: [{ value: result }],
      });
      await producer.disconnect();
    },
  });
};

startConsumer();

app.use(bodyParser.raw({ type: 'audio/x-flac', limit: '10mb' }));
app.use('/api', transcriptRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
