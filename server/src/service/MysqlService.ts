import * as _ from "lodash";

import { Injectable } from "@nestjs/common";
import { ObjectUtils } from "ts-commons";
import { MysqlConnectionConfig, ConnectionFactory, FilterOperator, DynamicQuery, DatabaseType } from "tsbatis";
import { MysqlTableInfoMapper } from "src/mapper/MysqlTableInfoMapper";
import { MysqlTableInfoDO } from "src/model/entity/table/MysqlTableInfoDO";
import { ColumnInfoDO } from "src/model/entity/view/ColumInfoDO";
import { CompressHelper } from "src/util/compress/CompressHelper";
import { TextFileInfo } from "src/util/compress/model/TextFileInfo";
import { JavaEntityFileGenerator } from "src/util/dynamic/fileGenerator/JavaEntityFileGenerator";

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
      await this.checkParamEmpty("uri", uri);
      await this.checkParamEmpty("user", user);
      await this.checkParamEmpty("pwd", pwd);
      await this.checkParamEmpty("database", database);
      await this.checkParamEmpty("tableName", tableName);
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

  public async generateTableEntitiesZipFile(
    uri: string,
    user: string,
    pwd: string,
    database: string,
    tableNames: string[]
  ): Promise<string> {
    try {
      const textFileInfos = await this.generateTableEntities(uri, user, pwd, database, tableNames);
      const zipFile = await CompressHelper.compressTextFile(textFileInfos);
      return new Promise<string>((resolve, reject) => resolve(zipFile));
    } catch (e) {
      return new Promise<string>((resolve, reject) => reject(e));
    }
  }

  public async generateTableEntities(
    uri: string,
    user: string,
    pwd: string,
    database: string,
    tableNames: string[]
  ): Promise<TextFileInfo[]> {
    try {
      const result: TextFileInfo[] = [];
      for (const tableName of tableNames) {
        const textFileInfo = await this.generateTableEntity(uri, user, pwd, database, tableName);
        result.push(textFileInfo);
      }
      return new Promise<TextFileInfo[]>((resolve, reject) => resolve(result));
    } catch (e) {
      return new Promise<TextFileInfo[]>((resolve, reject) => reject(e));
    }
  }

  public async generateTableEntity(
    uri: string,
    user: string,
    pwd: string,
    database: string,
    tableName: string
  ): Promise<TextFileInfo> {
    try {
      const dbColumInfos = await this.getColumnInfos(uri, user, pwd, database, tableName);
      const javaEntityFileGenerator = new JavaEntityFileGenerator(DatabaseType.MYSQL);
      const content = javaEntityFileGenerator.generateFileString(tableName, dbColumInfos);
      const textFileInfo = new TextFileInfo();
      textFileInfo.fileName = _.upperFirst(_.camelCase(tableName)) + ".java";
      textFileInfo.content = content;
      return new Promise<TextFileInfo>((resolve, reject) => resolve(textFileInfo));
    } catch (e) {
      return new Promise<TextFileInfo>((resolve, reject) => reject(e));
    }
  }

  private checkParamEmpty(paramName: string, paramValue: string): void {
    if (ObjectUtils.isNullOrUndefined(paramValue)) {
      throw new Error(`"${paramName}" can not be empty!`);
    }
  }
}
