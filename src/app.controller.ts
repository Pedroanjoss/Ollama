import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { InteractOllamaDto } from './dto/interact-ollama.dto';



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async interactOllama(@Body() interactOllamaDto: InteractOllamaDto): Promise<string> {
    console.log(interactOllamaDto)
    console.log(interactOllamaDto.text)
    return this.appService.converse(interactOllamaDto);
  }
}
