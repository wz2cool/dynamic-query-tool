import { column, TableEntity } from "tsbatis";

export class MysqlTableInfoDO extends TableEntity {
  @column({ columnName: "TABLE_SCHEMA" })
  public tableSchema: string;
  @column({ columnName: "TABLE_NAME" })
  public tableName: string;

  public getTableName(): string {
    return "information_schema.tables";
  }
}
