import { Test, TestingModule } from '@nestjs/testing';
import { SpeechToTextController } from './speechToText.controller';
import { ConsumerService } from '../../services/kafka/consumer.service';
import { ProducerService } from '../../services/kafka/producer.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('SpeechToTextController', () => {
  let controller: SpeechToTextController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpeechToTextController],
      providers: [ConsumerService, ProducerService],
    }).compile();

    controller = module.get<SpeechToTextController>(SpeechToTextController);
  });

  it('deve lançar uma exceção HTTP BadRequest se nenhum arquivo for enviado', async () => {
    try {
      await controller.speechToText(null); // Simula a ausência de arquivo
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.response).toBe('Nenhum arquivo enviado');
      expect(error.status).toBe(HttpStatus.BAD_REQUEST);
    }
  });

  // Adicione mais testes conforme necessário para testar outros cenários
});
