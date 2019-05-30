import { Controller, Get } from "@nestjs/common";
import { AppService } from "../service/AppService";
import { ApiUseTags, ApiResponse } from "@nestjs/swagger";
import { UserDTO } from "../model/dto/response/UserDTO";

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

  @Get("/example/user")
  @ApiResponse({
    status: 201,
    type: UserDTO,
    description: "Creates get user object.",
  })
  public getExampleUser(): UserDTO {
    return this.appService.getExampleUser();
  }
}
