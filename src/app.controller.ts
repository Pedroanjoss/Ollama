import { Body, Controller, Header, Post, Res, StreamableFile } from '@nestjs/common';
import { AppService } from './app.service';
import { InteractOllamaDto } from './dto/interact-ollama.dto';
import { Response } from 'express';
import { Readable } from 'stream';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async interactOllama(@Body() interactOllamaDto: InteractOllamaDto, @Res() res: Response): Promise<any> {
    const stream = await this.appService.converse(interactOllamaDto);

    stream.pipe(res); // Pipe the stream directly to the response
  }

  @Post('transcribe')
  async transcribeVideo(@Body('url') url: string): Promise<any> {
    return this.appService.transcribe(url);
  }

  @Post('resume')
  async resumeVideo(@Body('url') url: string): Promise<any> {
    return this.appService.resumeVideo(url);
  }

  @Post('upload')
  @Header('Content-Type', 'application/octet-stream')
  async uploadImage(@Body('image') base64Image: string): Promise<StreamableFile> {
    // Valida se a imagem foi enviada
    if (!base64Image) {
      throw new Error('Nenhuma imagem fornecida.');
    }

    // Chama o serviço para processar a imagem
    const imageStream: Readable = await this.appService.image(base64Image);

    // Retorna o stream como uma StreamableFile
    return new StreamableFile(imageStream);
  }

}
