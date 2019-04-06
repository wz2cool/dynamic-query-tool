import { ApiModelProperty } from "@nestjs/swagger";

export class UserDTO {
  @ApiModelProperty({ description: "用户名" })
  public name: string;
  @ApiModelProperty({ description: "年龄" })
  public age: number;
}
