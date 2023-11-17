import { Test, TestingModule } from '@nestjs/testing';
import { TextToSpeechService } from './textToSpeech.service';
import axios from 'axios';

describe('TextToSpeechService', () => {
  let textToSpeechService: TextToSpeechService;

  // Mock axios para evitar chamadas reais durante o teste
  const axiosMock = {
    post: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TextToSpeechService,
        { provide: axios, useValue: axiosMock }, // Substitui axios real pelo mock
      ],
    }).compile();

    textToSpeechService = module.get<TextToSpeechService>(TextToSpeechService);
  });

  it('deve enviar o texto para o serviço de text to speech com sucesso', async () => {
    const textoDeExemplo = 'Este é um texto de exemplo';
    const mockResponseData = { resultado: 'Texto convertido para discurso' };

    axiosMock.post.mockResolvedValueOnce({ data: mockResponseData });

    const resultado = await textToSpeechService.sendText(textoDeExemplo);

    expect(resultado).toEqual(mockResponseData);
    expect(axiosMock.post).toHaveBeenCalledWith('http://localhost:3030/api/transcriptText', { data: textoDeExemplo });
  });

  it('deve lidar com erros ao enviar o texto para o serviço de text to speech', async () => {
    const textoDeExemplo = 'Este é um texto de exemplo';
    const mockError = new Error('Erro ao enviar o texto para a API de text to speech');

    axiosMock.post.mockRejectedValueOnce(mockError);

    try {
      await textToSpeechService.sendText(textoDeExemplo);
    } catch (error) {
      expect(error).toEqual(mockError);
    }
  });
});
