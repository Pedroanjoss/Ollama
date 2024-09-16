import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InteractOllamaDto } from './dto/interact-ollama.dto';
import { Readable } from 'stream';
//import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { YoutubeTranscript } from 'youtube-transcript';

@Injectable()
export class AppService {
  private readonly apiUrl = 'http://localhost:11434';

  async converse(text: InteractOllamaDto): Promise<Readable> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/api/generate`,
        {
          model: 'llama3',
          prompt: text.text,
          stream: true
        },
        {
          responseType: 'stream' // This makes Axios handle the response as a stream
        }
      );

      // Log the response to inspect the structure
      console.log('Response structure:', response.data.response);

      // Ensure that response.data is a stream
      if (response.data && typeof response.data.pipe === 'function') {
        return response.data; // Return the stream
      } else {
        throw new Error('The response is not a stream');
      }
    } catch (error) {
      throw new Error(`Erro ao conversar com Ollama: ${error.message}`);
    }
  }

  async transcribe(url: string): Promise<any> {
    try {
      // Verifique se a URL contém o ID do vídeo
      if (!url || !url.includes('v=')) {
        throw new Error('URL inválida. Certifique-se de que a URL do vídeo do YouTube está correta.');
      }

      // Tenta buscar a transcrição
      const transcript = await YoutubeTranscript.fetchTranscript(url);

      // Concatena todos os trechos de texto em uma única string
      const fullTranscript = transcript.map(item => item.text).join(' ');

      // Retorna a transcrição completa
      return  fullTranscript;
    } catch (error) {
      console.error('Erro ao tentar transcrever o vídeo:', error.message);
      throw new Error('Não foi possível transcrever o vídeo. Verifique se o vídeo contém legendas.');
    }
  }

  async resumeVideo(url: string): Promise<any> {
    try {
      const transcript = await this.transcribe(url);
  
      // Debug log to check the length and content of the transcript
      console.log('Transcript length:', transcript.length);
      console.log('Transcript preview:', transcript.substring(0, 500)); // Preview first 500 characters
  
      const summaryStream = await this.converse({ text: `Resuma esse video: ${transcript}` });
  
      // Buffer the summary stream to handle it properly
      const summaryData = await new Promise<string>((resolve, reject) => {
        const chunks: Buffer[] = [];
        summaryStream.on('data', chunk => chunks.push(chunk));
        summaryStream.on('end', () => resolve(Buffer.concat(chunks).toString()));
        summaryStream.on('error', reject);
      });
  
      return summaryData;
    } catch (error) {
      console.error('Erro ao tentar resumir o vídeo:', error.message);
      throw new Error('Não foi possível resumir o vídeo. Verifique se o vídeo contém legendas.');
    }
  }

  async image(image: string): Promise<Readable> {
    try {
      const base64Data = image.replace(/^data:image\/jpeg;base64,/, '');
      const response = await axios.post(
        `${this.apiUrl}/api/generate`,
        {
          model: 'llava',
          prompt: 'Explique o que há nessa imagem',
          stream: true,
          images: [base64Data]
        },
        {
          responseType: 'stream',
          headers: {
            'Content-Type': 'application/json', // Certifique-se de que o Content-Type está correto
            
          }
        }
      );
  

     
  
      // Certifique-se de que response.data é um stream
      if (response.data && typeof response.data.pipe === 'function') {
        return response.data; // Retorna o stream
      } else {
        throw new Error('A resposta não é um stream');
      }
    } catch (error) {
      console.log(image)
      throw new Error(`Erro ao conversar com Ollama: ${error.message}`);
      
    }
  }
  
}
