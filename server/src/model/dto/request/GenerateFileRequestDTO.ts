import { ApiModelProperty } from "@nestjs/swagger";

export class GenerateFileRequestDTO {
  @ApiModelProperty({ description: "数据库地址" })
  readonly uri: string;
  @ApiModelProperty({ description: "数据库用户" })
  readonly user: string;
  @ApiModelProperty({ description: "数据库密码" })
  readonly pwd: string;
  @ApiModelProperty({ description: "数据库schema" })
  readonly database: string;
  @ApiModelProperty({ description: "数据表集合" })
  readonly tableNames: string[];
}
