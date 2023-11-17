import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerService } from './consumer.service';
import { Kafka, EachMessagePayload } from 'kafkajs';

describe('ConsumerService', () => {
    let consumerService: ConsumerService;

    // Mock de uma instância do Kafka para evitar conexão real durante o teste
    const mockKafka: Partial<Kafka> = {
        consumer: () => new MockConsumer() as any,
    };

    class MockConsumer {
        async connect() { }
        async subscribe() { }
        async run(options: { eachMessage: (payload: EachMessagePayload) => Promise<void> }) {
            const message: EachMessagePayload = {
                topic: 'meu-topico',
                partition: 0,
                message: {
                    offset: '0',
                    key: null,
                    value: Buffer.from('Minha mensagem de exemplo'),
                    headers: null,
                    timestamp: '0',
                    attributes: 0,
                },
                heartbeat: null, // Adicionamos essa propriedade para corresponder à interface EachMessagePayload
                pause: null, // Adicionamos essa propriedade para corresponder à interface EachMessagePayload
            };
            await options.eachMessage(message);
        }
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConsumerService,
                { provide: Kafka, useValue: mockKafka }, // Substitui o Kafka real pelo mock
            ],
        }).compile();

        consumerService = module.get<ConsumerService>(ConsumerService);
    });

    it('deve consumir mensagens de um tópico Kafka', async () => {
        const topic = 'meu-topico';

        const mensagemRecebida = await consumerService.consume(topic);

        expect(mensagemRecebida).toEqual('Minha mensagem de exemplo');
    });
});
