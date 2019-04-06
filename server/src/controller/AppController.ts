import { Controller, Get } from "@nestjs/common";
import { AppService } from "../service/AppService";
import { ApiUseTags } from "@nestjs/swagger";

@ApiUseTags("AppController")
@Controller()
export class AppController {
  private readonly appService: AppService;

  constructor(appService: AppService) {
    this.appService = appService;
  }

  @Get()
  public getHello(): string {
    return this.appService.getHello();
  }
}
