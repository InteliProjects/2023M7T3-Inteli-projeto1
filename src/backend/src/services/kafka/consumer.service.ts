import { Injectable, Logger } from '@nestjs/common';
import { EachMessagePayload, Kafka } from 'kafkajs';

@Injectable()
export class ConsumerService {
    private readonly kafka = new Kafka({
        brokers: ['localhost:9092'],
    });

    private readonly logger = new Logger(ConsumerService.name);

    async consume(topic: string): Promise<string> {
        const consumer = this.kafka.consumer({ groupId: 'nestjs-kafka' });
        await consumer.connect();
        await consumer.subscribe({ topic: topic, fromBeginning: true });

        return new Promise<string>(async (resolve) => {
            await consumer.run({
                eachMessage: async ({ topic, message }: EachMessagePayload) => {
                    const value = message.value.toString();
                    this.logger.log(`Mensagem recebida no tópico ${topic}: ${value}`);

                    resolve(value);
                },
            });
        });
    }
}
