import * as _ from "lodash";

import { DatabaseType } from "tsbatis";
import { IColumnInfo } from "../model/interface/IColumnInfo";
import { ITypeConverter } from "../converter/ITypeConverter";
import { MysqlToJavaTypeConverter } from "../converter/MysqlToJavaTypeConverter";

export abstract class FileGeneratorBase {
  public readonly databaseType: DatabaseType;
  public typeConverter: ITypeConverter;
  constructor(databaseType: DatabaseType) {
    this.databaseType = databaseType;

    if (databaseType === DatabaseType.MYSQL) {
      this.typeConverter = new MysqlToJavaTypeConverter();
    } else if (databaseType === DatabaseType.SQLITE3) {
      // TODO:
    }
  }

  public abstract generateFileString(tableName: string, columnInfos: IColumnInfo[]): string;

  protected genreatePublicMethodText(columnInfos: IColumnInfo[]): string {
    const space = "    ";
    let result = "";
    for (const columnInfo of columnInfos) {
      const javaType = this.typeConverter.convert(columnInfo.type);
      const javaProperty = _.camelCase(columnInfo.name.toLowerCase());

      let useProperty: string;
      if (javaType === "Timestamp") {
        useProperty = `${javaProperty} == null ? null : new Timestamp(${javaProperty}.getTime())`;
      } else if (javaType === "Date") {
        useProperty = `${javaProperty} == null ? null : new Date(${javaProperty}.getTime())`;
      } else if (javaType === "Time") {
        useProperty = `${javaProperty} == null ? null : new Time(${javaProperty}.getTime())`;
      } else {
        useProperty = javaProperty;
      }

      const startCaseJavaProperty = _.upperFirst(javaProperty);
      result +=
        `${space}public ${javaType} get${startCaseJavaProperty}() {\r\n` +
        `${space}${space}return ${useProperty};\r\n` +
        `${space}}\r\n\r\n`;

      result +=
        `${space}public void set${startCaseJavaProperty}(${javaType} ${javaProperty}) {\r\n` +
        `${space}${space}this.${javaProperty} = ${useProperty};\r\n` +
        `${space}}\r\n\r\n`;
    }
    return result;
  }
}
