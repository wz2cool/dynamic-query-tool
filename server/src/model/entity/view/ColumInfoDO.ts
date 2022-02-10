import { Entity, column } from "tsbatis";

export class ColumnInfoDO extends Entity {
  @column({ columnName: "name" })
  public name: string;
  @column({ columnName: "type" })
  public type: string;
  @column({ columnName: "pk" })
  public pk: number;
  @column({ columnName: "auto_increment" })
  public autoIncrement: number;
  @column({ columnName: "column_comment" })
  public comment: string;
  @column({ columnName: "is_unsigned" })
  public isUnsigned: number
}
