import { Test, TestingModule } from '@nestjs/testing';
import { TextToSpeechController } from './textToSpeech.controller';
import { WebhookService } from '../../services/webHook/webHook.service';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

describe('TextToSpeechController', () => {
  let controller: TextToSpeechController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextToSpeechController],
      providers: [WebhookService],
    }).compile();

    controller = module.get<TextToSpeechController>(TextToSpeechController);
  });

  it('deve enviar texto para processamento', async () => {
    const textoDeExemplo = 'Isso é um texto de exemplo';

    // Substitua esta parte pelo seu serviço de webhook real ou crie um mock para ele
    const mockWebhookService = {
      sendTextHooks: jest.fn(() => 'Resposta do serviço de webhook'),
    };

    controller['WebhookService'] = mockWebhookService;

    const resultado = await controller.sendText(textoDeExemplo);

    expect(resultado).toBe('Texto enviado com sucesso para a API de text to speech');
  });

  it('deve receber um buffer e retornar uma resposta HTTP OK', async () => {
    const mockResponse: Response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        sendStatus: jest.fn(),
        links: jest.fn(),
        send: jest.fn(),
        jsonp: jest.fn(),
        // Adicione outras propriedades conforme necessário
      } as any as Response;

    const dataBufferDeExemplo = { exemplo: 'dados do buffer' };

    await controller.receiveBuffer(dataBufferDeExemplo, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(mockResponse.status(HttpStatus.OK).json).toHaveBeenCalledWith({
      success: true,
      data: dataBufferDeExemplo,
    });
  });
});
