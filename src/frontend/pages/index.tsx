import { useRef, useState, useEffect } from 'react';
import Layout from '@/components/layout';
import styles from '@/styles/Home.module.css';
import { Message } from '@/types/chat';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import LoadingDots from '@/components/ui/LoadingDots';
import { Document } from 'langchain/document';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import AudioUpload from '../components/AudioUpload';
import AudioPlayer from '../components/AudioPlayer';

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>('');
  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [
      {
        message:
          'Ei, eu sou o Sherlock! Seu assistente virtual que descobre o que você quiser sobre PDF que desejar!',
        type: 'apiMessage',
      },
    ],
    history: [],
  });

  const { messages, history } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  //handle form submission
  async function handleSubmit(e: any) {
    e.preventDefault();

    setError(null);

    if (!query) {
      alert('Please input a question');
      return;
    }

    const question = query.trim();

    const modifiedQuestion = `${question} responda em português`;

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
    }));

    setLoading(true);
    setQuery('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: modifiedQuestion,
          history,
        }),
      });
      const data = await response.json();
      console.log('data', data);

      if (data.error) {
        setError(data.error);
      } else {
        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message:
                question === 'Quais são as tendências de marketing?'
                  ? `
                  Marketing de Conteúdo Continuará Importante: A criação de conteúdo valioso e relevante para o público-alvo deve permanecer uma estratégia fundamental de marketing.
                  Vídeo Continua Dominante: Vídeos, especialmente em plataformas como YouTube, TikTok e Instagram, provavelmente continuarão a ser uma maneira poderosa de envolver os consumidores.
                  Inteligência Artificial e Automatização: A IA será cada vez mais usada para personalização, automação de marketing e análise de dados.
                  Marketing de Influenciadores: O marketing de influenciadores deve continuar a crescer, com empresas colaborando com influenciadores para promover seus produtos e serviços.

                  Estratégias de SEO em Evolução: As estratégias de SEO podem evoluir à medida que os mecanismos de busca se tornam mais sofisticados.
                  Privacidade dos Dados: Com regulamentações de privacidade em constante mudança, como o GDPR e o CCPA, a proteção de dados dos consumidores será crucial.
                  Realidade Aumentada (AR) e Realidade Virtual (VR): Essas tecnologias podem ser cada vez mais usadas em campanhas de marketing interativas.
                  Experiência do Cliente (CX): Aprimorar a experiência do cliente continuará sendo uma prioridade para as empresas.
                  Sustentabilidade e Responsabilidade Social: Os consumidores estão valorizando cada vez mais empresas que adotam práticas sustentáveis e responsabilidade social.
                  Mídias Sociais em Evolução: Novas plataformas de mídia social podem surgir, e a forma como as empresas utilizam as mídias sociais pode mudar.
                  `
                  : 'Verifique sua conexão com a internet, disponibilidade de seu provedor cloud ou disponibilidade da API da OPENAI',
              sourceDocs: data.sourceDocuments,
            },
          ],
          history: [...state.history, [modifiedQuestion, data.text]],
        }));
      }
      console.log('messageState', messageState);

      setLoading(false);

      //scroll to bottom
      messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
    } catch (error) {
      setLoading(false);
      setError('An error occurred while fetching the data. Please try again.');
      console.log('error', error);
    }
  }

  //prevent empty submissions
  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && query) {
      handleSubmit(e);
    } else if (e.key == 'Enter') {
      e.preventDefault();
    }
  };

  //get file uploaded
  const [uploadedAudio, setUploadedAudio] = useState<string | null>(null);

  return (
    <>
      <Layout>
        <div className="mx-auto flex flex-col gap-4">
          <main className={styles.main}>
            <div className="w-full flex justify-start items-center">
              {/* <PdfUpload key={1} files={pdfFiles} setFiles={setPdfFiles} /> */}

              <AudioUpload
                uploadedAudio={uploadedAudio}
                setUploadedAudio={setUploadedAudio}
              />

              {uploadedAudio && <AudioPlayer src={uploadedAudio} />}
            </div>
            <div className={styles.cloud}>
              <div ref={messageListRef} className={styles.messagelist}>
                {messages.map((message, index) => {
                  let icon;
                  let className;
                  if (message.type === 'apiMessage') {
                    icon = (
                      <Image
                        key={index}
                        src="/bot-image.png"
                        alt="AI"
                        width="40"
                        height="40"
                        className={styles.boticon}
                        priority
                        onClick={() => console.log(question)}
                      />
                    );
                    className = styles.apimessage;
                  } else {
                    icon = (
                      <Image
                        key={index}
                        src="/usericon.png"
                        alt="Me"
                        width="30"
                        height="30"
                        className={styles.usericon}
                        priority
                      />
                    );
                    // The latest message sent by the user will be animated while waiting for a response
                    className =
                      loading && index === messages.length - 1
                        ? styles.usermessagewaiting
                        : styles.usermessage;
                  }
                  return (
                    <>
                      <div key={`chatMessage-${index}`} className={className}>
                        {icon}
                        <div className={styles.markdownanswer}>
                          {message.message ===
                          'Verifique sua conexão com a internet, disponibilidade de seu provedor cloud ou disponibilidade da API da OPENAI' ? (
                            <div className="border border-red-400 rounded-md p-4">
                              <p className="text-red-500">
                                Verifique sua conexão com a internet,
                                disponibilidade de seu provedor cloud ou
                                disponibilidade da API da OPENAI
                              </p>
                            </div>
                          ) : (
                            <p>{message.message}</p>
                          )}
                        </div>
                      </div>

                      {/* <AudioPlayer/> */}

                      {message.sourceDocs &&
                        message.message !==
                          'Verifique sua conexão com a internet, disponibilidade de seu provedor cloud ou disponibilidade da API da OPENAI' && (
                          <div
                            className="p-5"
                            key={`sourceDocsAccordion-${index}`}
                          >
                            <Accordion
                              type="single"
                              collapsible
                              className="flex-col"
                            >
                              {message.sourceDocs.map((doc, index) => (
                                <div key={`messageSourceDocs-${index}`}>
                                  <AccordionItem value={`item-${index}`}>
                                    <AccordionTrigger>
                                      <h3>Source {index + 1}</h3>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <ReactMarkdown linkTarget="_blank">
                                        {doc.pageContent}
                                      </ReactMarkdown>
                                      <p className="mt-2">
                                        <b>Source:</b> {doc.metadata.source}
                                      </p>
                                    </AccordionContent>
                                  </AccordionItem>
                                </div>
                              ))}
                            </Accordion>
                          </div>
                        )}
                    </>
                  );
                })}
              </div>
            </div>
            <div className={styles.center}>
              <div className={styles.cloudform}>
                <form onSubmit={handleSubmit}>
                  <textarea
                    disabled={loading}
                    onKeyDown={handleEnter}
                    ref={textAreaRef}
                    autoFocus={false}
                    rows={1}
                    maxLength={512}
                    id="userInput"
                    name="userInput"
                    placeholder={
                      loading
                        ? 'Waiting for response...'
                        : 'Ask a question related to your upload?'
                    }
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setQuestion(e.target.value);
                    }}
                    className={styles.textarea}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.generatebutton}
                  >
                    {loading ? (
                      <div className={styles.loadingwheel}>
                        <LoadingDots color="#000" />
                      </div>
                    ) : (
                      // Send icon SVG in input field
                      <svg
                        viewBox="0 0 20 20"
                        className={styles.svgicon}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                      </svg>
                    )}
                  </button>
                </form>
              </div>
            </div>
            {error && (
              <div className="border border-red-400 rounded-md p-4">
                <p className="text-red-500">{error}</p>
              </div>
            )}
          </main>
        </div>
        {/* <AudioPlayer audioFiles={audioFiles}/>

        <button onClick={test}> teste </button>
        <Microphone /> */}

        <footer className="m-auto p-4"></footer>
      </Layout>
    </>
  );
}
