import { Injectable } from "@nestjs/common";
import { UserDTO } from "src/model/dto/response/UserDTO";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }

  public getExampleUser(): UserDTO {
    const dto = new UserDTO();
    dto.name = "Jack";
    dto.age = 20;
    return dto;
  }
}
