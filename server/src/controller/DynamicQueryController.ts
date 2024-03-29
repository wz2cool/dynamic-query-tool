import * as path from "path";

import { Controller, Body, Post, Res } from "@nestjs/common";
import { ApiUseTags } from "@nestjs/swagger";
import { GenerateFileRequestDTO } from "../model/dto/request/GenerateFileRequestDTO";
import { MysqlService } from "../service/MysqlService";
import { Response } from "express";

@ApiUseTags("DynamicQueryController")
@Controller("dynamicQuery")
export class DynamicQueryController {
  private readonly mysqlService: MysqlService;

  constructor(mysqlService: MysqlService) {
    this.mysqlService = mysqlService;
  }

  @Post("/java/file")
  public async generateJavaFile(@Body() requestDTO: GenerateFileRequestDTO, @Res() res: Response) {
    const uri = requestDTO.uri;
    const user = requestDTO.user;
    const pwd = requestDTO.pwd;
    const database = requestDTO.database;
    const tableNames = requestDTO.tableNames;
    const filePath = await this.mysqlService.generateJavaTableZipFile(uri, user, pwd, database, tableNames);
    res.download(filePath, path.basename(filePath));
  }

  @Post("/proto/file")
  public async generateProtoFile(@Body() requestDTO: GenerateFileRequestDTO, @Res() res: Response) {
    const uri = requestDTO.uri;
    const user = requestDTO.user;
    const pwd = requestDTO.pwd;
    const database = requestDTO.database;
    const tableNames = requestDTO.tableNames;
    const filePath = await this.mysqlService.generateProtoTableZipFile(uri, user, pwd, database, tableNames);
    res.download(filePath, path.basename(filePath));
  }
}
