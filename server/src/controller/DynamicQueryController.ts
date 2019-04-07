import * as path from "path";

import { Controller, Body, Post, Res } from "@nestjs/common";
import { ApiUseTags } from "@nestjs/swagger";
import { GenerateFileRequestDTO } from "../model/dto/request/GenerateFileRequestDTO";
import { MysqlService } from "src/service/MysqlService";

@ApiUseTags("DynamicQueryController")
@Controller("dynamicQuery")
export class DynamicQueryController {
  private readonly mysqlService: MysqlService;

  constructor(mysqlService: MysqlService) {
    this.mysqlService = mysqlService;
  }

  @Post("/java/file")
  public async generateFile(@Body() requestDTO: GenerateFileRequestDTO, @Res() res: any) {
    const uri = requestDTO.uri;
    const user = requestDTO.user;
    const pwd = requestDTO.pwd;
    const database = requestDTO.database;
    const tableNames = requestDTO.tableNames;
    const filePath = await this.mysqlService.generateTableZipFile(uri, user, pwd, database, tableNames);
    res.download(filePath, path.basename(filePath));
  }
}
