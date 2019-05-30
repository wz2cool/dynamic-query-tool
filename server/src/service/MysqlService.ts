import * as _ from "lodash";

import { Injectable } from "@nestjs/common";
import { ObjectUtils } from "ts-commons";
import { MysqlConnectionConfig, ConnectionFactory, FilterOperator, DynamicQuery, DatabaseType } from "tsbatis";
import { MysqlTableInfoMapper } from "../mapper/MysqlTableInfoMapper";
import { MysqlTableInfoDO } from "../model/entity/table/MysqlTableInfoDO";
import { ColumnInfoDO } from "../model/entity/view/ColumInfoDO";
import { CompressHelper } from "../util/compress/CompressHelper";
import { TextFileInfo } from "../util/compress/model/TextFileInfo";
import { JavaEntityFileGenerator } from "../util/dynamic/fileGenerator/JavaEntityFileGenerator";
import { JavaDTOFileGenerator } from "../util/dynamic/fileGenerator/JavaDTOFileGenerator";

@Injectable()
export class MysqlService {
  public async getTableNames(uri: string, user: string, pwd: string, database: string): Promise<string[]> {
    try {
      this.checkParamEmpty("uri", uri);
      this.checkParamEmpty("user", user);
      this.checkParamEmpty("pwd", pwd);
      this.checkParamEmpty("database", database);

      const uriInfos = uri.split(":");
      const host = uriInfos[0];
      const port = uriInfos[1];

      const config = new MysqlConnectionConfig();
      config.host = host;
      config.port = parseInt(port, 10);
      config.user = user;
      config.password = pwd;
      config.database = database;

      const connectionFactory = new ConnectionFactory(config, true);
      const connection = await connectionFactory.getConnection();
      const mysqlTableInfoMapper = new MysqlTableInfoMapper(connection);

      const query = DynamicQuery.createQuery(MysqlTableInfoDO).addFilterDescriptor({
        propertyPath: "tableSchema",
        operator: FilterOperator.EQUAL,
        value: database,
      });
      const mysqlTableInfos = await mysqlTableInfoMapper.selectByDynamicQuery(query);
      const result = _.uniq(_.map(mysqlTableInfos, x => x.tableName));
      return result;
    } catch (e) {
      return new Promise<string[]>((resolve, reject) => reject(e));
    }
  }

  public async getColumnInfos(
    uri: string,
    user: string,
    pwd: string,
    database: string,
    tableName: string
  ): Promise<ColumnInfoDO[]> {
    try {
      this.checkParamEmpty("uri", uri);
      this.checkParamEmpty("user", user);
      this.checkParamEmpty("pwd", pwd);
      this.checkParamEmpty("database", database);
      this.checkParamEmpty("tableName", tableName);
      const uriInfos = uri.split(":");
      const host = uriInfos[0];
      const port = uriInfos[1];
      const config = new MysqlConnectionConfig();
      config.host = host;
      config.port = parseInt(port, 10);
      config.user = user;
      config.password = pwd;
      config.database = database;

      const sql =
        `SELECT COLUMN_NAME AS name, DATA_TYPE AS type, column_comment AS comment,` +
        `(CASE WHEN COLUMN_KEY = 'PRI' THEN 1 ELSE 0 END) AS pk, ` +
        `(CASE WHEN extra = 'auto_increment' THEN 1 ELSE 0 END) as auto_increment ` +
        `FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '${database}' AND TABLE_NAME = '${tableName}'`;

      const connectionFactory = new ConnectionFactory(config, true);
      const connection = await connectionFactory.getConnection();
      const dbColumnInfos = await connection.selectEntities<ColumnInfoDO>(ColumnInfoDO, sql, []);
      return dbColumnInfos;
    } catch (e) {
      return new Promise<ColumnInfoDO[]>((resolve, reject) => reject(e));
    }
  }

  public async generateTableZipFile(
    uri: string,
    user: string,
    pwd: string,
    database: string,
    tableNames: string[]
  ): Promise<string> {
    try {
      const columInfoMap = await this.getColumnInfoMap(uri, user, pwd, database, tableNames);
      const textFileInfos = await this.generateTableEntities(columInfoMap);
      const dtoFileInfos = await this.generateTableDTOs(columInfoMap);
      const zipFile = await CompressHelper.compressTextFile(textFileInfos.concat(dtoFileInfos));
      return new Promise<string>((resolve, reject) => resolve(zipFile));
    } catch (e) {
      return new Promise<string>((resolve, reject) => reject(e));
    }
  }

  public async generateTableEntities(map: Map<string, ColumnInfoDO[]>): Promise<TextFileInfo[]> {
    try {
      const result: TextFileInfo[] = [];
      for (const tableName of map.keys()) {
        const columnInfos = map.get(tableName);
        if (ObjectUtils.hasValue(columnInfos)) {
          const textFileInfo = await this.generateTableEntity(tableName, columnInfos);
          result.push(textFileInfo);
        }
      }

      return new Promise<TextFileInfo[]>((resolve, reject) => resolve(result));
    } catch (e) {
      return new Promise<TextFileInfo[]>((resolve, reject) => reject(e));
    }
  }

  public async generateTableDTOs(map: Map<string, ColumnInfoDO[]>): Promise<TextFileInfo[]> {
    try {
      const result: TextFileInfo[] = [];
      for (const tableName of map.keys()) {
        const columnInfos = map.get(tableName);
        if (ObjectUtils.hasValue(columnInfos)) {
          const textFileInfo = await this.generateTableDTO(tableName, columnInfos);
          result.push(textFileInfo);
        }
      }

      return new Promise<TextFileInfo[]>((resolve, reject) => resolve(result));
    } catch (e) {
      return new Promise<TextFileInfo[]>((resolve, reject) => reject(e));
    }
  }

  private async generateTableEntity(tableName: string, columnInfos: ColumnInfoDO[]): Promise<TextFileInfo> {
    try {
      const javaEntityFileGenerator = new JavaEntityFileGenerator(DatabaseType.MYSQL);
      const content = javaEntityFileGenerator.generateFileString(tableName, columnInfos);
      const textFileInfo = new TextFileInfo();
      textFileInfo.fileName = `${_.upperFirst(_.camelCase(tableName))}DO.java`;
      textFileInfo.content = content;
      return new Promise<TextFileInfo>((resolve, reject) => resolve(textFileInfo));
    } catch (e) {
      return new Promise<TextFileInfo>((resolve, reject) => reject(e));
    }
  }

  private async generateTableDTO(tableName: string, columnInfos: ColumnInfoDO[]): Promise<TextFileInfo> {
    try {
      const javaDTOFileGenerator = new JavaDTOFileGenerator(DatabaseType.MYSQL);
      const content = javaDTOFileGenerator.generateFileString(tableName, columnInfos);
      const textFileInfo = new TextFileInfo();
      textFileInfo.fileName = `${_.upperFirst(_.camelCase(tableName))}DTO.java`;
      textFileInfo.content = content;
      return new Promise<TextFileInfo>((resolve, reject) => resolve(textFileInfo));
    } catch (e) {
      return new Promise<TextFileInfo>((resolve, reject) => reject(e));
    }
  }

  private async getColumnInfoMap(
    uri: string,
    user: string,
    pwd: string,
    database: string,
    tableNames: string[]
  ): Promise<Map<string, ColumnInfoDO[]>> {
    try {
      const result = new Map<string, ColumnInfoDO[]>();
      for (const tableName of tableNames) {
        const columnInfos = await this.getColumnInfos(uri, user, pwd, database, tableName);
        result.set(tableName, columnInfos);
      }
      return new Promise<Map<string, ColumnInfoDO[]>>(resolve => resolve(result));
    } catch (ex) {
      return new Promise<Map<string, ColumnInfoDO[]>>((resolve, reject) => reject(ex));
    }
  }

  private checkParamEmpty(paramName: string, paramValue: string): void {
    if (ObjectUtils.isNullOrUndefined(paramValue)) {
      throw new Error(`"${paramName}" can not be empty!`);
    }
  }
}
