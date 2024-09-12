import { Body, Controller, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { InteractOllamaDto } from './dto/interact-ollama.dto';
import { Response } from 'express';

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
}
