import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InteractOllamaDto } from './dto/interact-ollama.dto';

@Injectable()
export class AppService {
  private readonly apiUrl = 'http://localhost:11434';

  async converse(text: InteractOllamaDto): Promise<string> {
    try {
      const response = await axios.post(`${this.apiUrl}/api/generate`, {
        "model": "llama3",
        "prompt": "teste",
        "stream": false
      });
      return response.data.response; // Ajuste conforme a estrutura da resposta do Ollama
    } catch (error) {
      throw new Error(`Erro ao conversar com Ollama: ${error.message}`);
    }
  }
}
