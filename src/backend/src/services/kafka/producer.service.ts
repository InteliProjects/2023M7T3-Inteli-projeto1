import { Injectable, OnApplicationShutdown, OnModuleInit, Logger } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
    private readonly kafka = new Kafka({
        brokers: ['localhost:9092'],
    });
    private readonly producer: Producer = this.kafka.producer();
    private readonly logger = new Logger(ProducerService.name);

    async onModuleInit() {
        try {
            await this.producer.connect();
            this.logger.log('Conexão com o produtor Kafka estabelecida com sucesso');
        } catch (error) {
            this.logger.error('Erro ao estabelecer a conexão com o produtor Kafka', error);
        }
    }

    async produce(record: ProducerRecord) {
        try {
            await this.producer.send(record);
            this.logger.log('Mensagem Kafka enviada com sucesso');
        } catch (error) {
            this.logger.error('Erro ao enviar mensagem Kafka', error);
        }
    }

    async onApplicationShutdown() {
        try {
            await this.producer.disconnect();
            this.logger.log('Desconexão do produtor Kafka realizada com sucesso');
        } catch (error) {
            this.logger.error('Erro ao desconectar o produtor Kafka', error);
        }
    }
}
