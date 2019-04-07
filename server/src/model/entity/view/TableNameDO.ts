import { column, Entity } from "tsbatis";

export class TableName extends Entity {
  @column({ columnName: "name" })
  public name: string;
}
