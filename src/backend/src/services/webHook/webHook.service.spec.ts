import { Test, TestingModule } from '@nestjs/testing';
import { WebhookService } from './webhook.service';
const webhooks = require('node-webhooks');

describe('WebhookService', () => {
  let webhookService: WebhookService;

  // Mock de node-webhooks para evitar chamadas reais durante o teste
  const webhooksMock = {
    trigger: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookService,
        { provide: webhooks, useValue: webhooksMock }, // Substitui node-webhooks real pelo mock
      ],
    }).compile();

    webhookService = module.get<WebhookService>(WebhookService);
  });

  it('deve enviar o texto para o webhook com sucesso', async () => {
    const textoDeExemplo = 'Este é um texto de exemplo';

    await webhookService.sendTextHooks(textoDeExemplo);

    expect(webhooksMock.trigger).toHaveBeenCalledWith('callback_hook', { data: textoDeExemplo });
  });

  it('deve lidar com erros ao enviar o texto para o webhook', async () => {
    const textoDeExemplo = 'Este é um texto de exemplo';
    const mockError = new Error('Erro no webhook');

    webhooksMock.trigger.mockRejectedValueOnce(mockError);

    try {
      await webhookService.sendTextHooks(textoDeExemplo);
    } catch (error) {
      expect(error).toEqual(mockError);
    }
  });
});
