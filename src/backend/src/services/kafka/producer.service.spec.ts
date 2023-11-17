import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService } from './producer.service';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

describe('ProducerService', () => {
    let producerService: ProducerService;

    // Mock de uma instância do Kafka para evitar conexão real durante o teste
    const mockKafka: Partial<Kafka> = {
        producer: () => new MockProducer() as any,
    };

    class MockProducer {
        async connect() { }
        async send() { }
        async disconnect() { }
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProducerService,
                { provide: Kafka, useValue: mockKafka }, // Substitui o Kafka real pelo mock
            ],
        }).compile();

        producerService = module.get<ProducerService>(ProducerService);
    });

    it('deve conectar ao produtor Kafka com sucesso durante a inicialização', async () => {
        const mockConnect = jest.spyOn(MockProducer.prototype, 'connect');

        await producerService.onModuleInit();

        expect(mockConnect).toHaveBeenCalled();
    });

    it('deve produzir uma mensagem Kafka com sucesso', async () => {
        const mockSend = jest.spyOn(MockProducer.prototype, 'send');

        const record: ProducerRecord = {
            topic: 'meu-topico',
            messages: [{ value: 'Minha mensagem de exemplo' }],
        };

        await producerService.produce(record);

        expect(mockSend).toHaveBeenCalledWith(record);
    });

    it('deve desconectar do produtor Kafka com sucesso durante o desligamento da aplicação', async () => {
        const mockDisconnect = jest.spyOn(MockProducer.prototype, 'disconnect');

        await producerService.onApplicationShutdown();

        expect(mockDisconnect).toHaveBeenCalled();
    });
});
