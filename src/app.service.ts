import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InteractOllamaDto } from './dto/interact-ollama.dto';
import { Readable } from 'stream';

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
}
