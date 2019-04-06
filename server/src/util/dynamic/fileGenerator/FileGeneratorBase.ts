import { DatabaseType } from "tsbatis";
import { IColumnInfo } from "../model/interface/IColumnInfo";

export abstract class FileGeneratorBase {
  public readonly databaseType: DatabaseType;

  constructor(databaseType: DatabaseType) {
    this.databaseType = databaseType;
  }

  public abstract generateFileString(tableName: string, columnInfos: IColumnInfo[]): string;
}
