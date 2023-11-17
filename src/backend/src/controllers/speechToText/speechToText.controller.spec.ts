import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SpeechToTextController } from './speechToText.controller';
import { ProducerService } from 'src/services/kafka/producer.service';
import { ConsumerService } from 'src/services/kafka/consumer.service';
import { Logger } from 'winston';

describe('SpeechToTextController', () => {
  let controller: SpeechToTextController;
  let producerService: ProducerService;
  let consumerService: ConsumerService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpeechToTextController],
      providers: [
        {
          provide: ProducerService,
          useValue: {
            produce: jest.fn(),
          },
        },
        {
          provide: ConsumerService,
          useValue: {
            consume: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SpeechToTextController>(SpeechToTextController);
    producerService = module.get<ProducerService>(ProducerService);
    consumerService = module.get<ConsumerService>(ConsumerService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('speechToText', () => {
    it('should return a message', async () => {
      const audio = {} as any; // Mock do objeto de áudio

      producerService.produce = jest.fn().mockResolvedValue(undefined);
      consumerService.consume = jest.fn().mockResolvedValue('Transcrição de áudio');

      const result = await controller.speechToText(audio);

      expect(result).toBe('Transcrição de áudio');
    });

    it('should throw a bad request exception if no audio file is provided', async () => {
      const audio = null;

      try {
        await controller.speechToText(audio);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response).toBe('Nenhum arquivo enviado');
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw an internal server error if an error occurs during processing', async () => {
      const audio = {} as any; // Mock do objeto de áudio

      producerService.produce = jest.fn().mockRejectedValue(new Error('Erro durante o processamento'));

      try {
        await controller.speechToText(audio);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response).toBe('Erro interno do servidor');
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(logger.error).toHaveBeenCalledWith('Ocorreu um erro durante o processamento de áudio:', expect.any(Error));
      }
    });
  });
});
