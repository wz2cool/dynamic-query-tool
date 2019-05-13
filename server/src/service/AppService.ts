import { Injectable } from "@nestjs/common";
import { UserDTO } from "src/model/dto/response/UserDTO";

@Injectable()
export class AppService {
  getHello(): string {
    return "aaaaaaa\rbbbbbbbbbbbbbbbbb";
  }

  public getExampleUser(): UserDTO {
    const dto = new UserDTO();
    dto.name = "aaaaaaa\r\nbbbbbbbbbbbbbbbbb";
    dto.age = 20;
    return dto;
  }
}
