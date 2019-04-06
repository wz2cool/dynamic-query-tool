import * as _ from "lodash";

import { FileGeneratorBase } from "./FileGeneratorBase";
import { IColumnInfo } from "../model/interface/IColumnInfo";
import { DatabaseType } from "tsbatis";
import { ITypeConverter } from "../converter/ITypeConverter";
import { MysqlToJavaTypeConverter } from "../converter/MysqlToJavaTypeConverter";
import { StringUtils, ArrayUtils } from "ts-commons";
import { JavaType } from "../model/constant/JavaType";

export class JavaEntityFileGenerator extends FileGeneratorBase {
  private readonly typeConverter: ITypeConverter;
  constructor(databaseType: DatabaseType) {
    super(databaseType);

    if (databaseType === DatabaseType.MYSQL) {
      this.typeConverter = new MysqlToJavaTypeConverter();
    } else if (databaseType === DatabaseType.SQLITE3) {
      // TODO:
    }
  }

  public generateFileString(tableName: string, columnInfos: IColumnInfo[]): string {
    const className = _.upperFirst(_.camelCase(tableName.toLowerCase()));
    const privateFiledText = this.generatePrivateFieldText(columnInfos);
    const publicMothodText = this.genreatePublicMethodText(columnInfos);
    const allJavaTypes = columnInfos.map(x => this.typeConverter.convert(x.type));
    const needImportJavaMathPackage = allJavaTypes.findIndex(x => x === JavaType.BIG_DECIMAL) > 0;
    const sqlPackageTypes = [JavaType.DATE, JavaType.TIME, JavaType.TIMESTAMP];
    const needImportSqlPacakge = allJavaTypes.findIndex(x => ArrayUtils.contains(sqlPackageTypes, x)) > 0;

    let result = "";
    if (needImportJavaMathPackage) {
      result += "import java.math.*;\r\n";
    }
    if (needImportSqlPacakge) {
      result += "import java.sql.*;\r\n";
    }
    result +=
      `import javax.persistence.*;\r\n\r\n` +
      `@Table(name = "${tableName}")\r\n` +
      `public class ${className} {\r\n${privateFiledText}\r\n${publicMothodText}}`;
    return result;
  }

  private generatePrivateFieldText(columnInfos: IColumnInfo[]): string {
    const space = "    ";
    let result = "";
    for (const columnInfo of columnInfos) {
      const javaType = this.typeConverter.convert(columnInfo.type);
      const javaProperty = _.camelCase(columnInfo.name.toLowerCase());
      if (StringUtils.isNotBlank(columnInfo.comment)) {
        result += `${space}// ${columnInfo.comment}\r\n`;
      }
      if (columnInfo.pk === 1) {
        result += `${space}@Id\r\n`;
      }
      result += `${space}private ${javaType} ${javaProperty};\r\n`;
    }
    return result;
  }

  private genreatePublicMethodText(columnInfos: IColumnInfo[]): string {
    const space = "    ";
    let result = "";
    for (const columnInfo of columnInfos) {
      const javaType = this.typeConverter.convert(columnInfo.type);
      const javaProperty = _.camelCase(columnInfo.name.toLowerCase());
      const startCaseJavaProperty = _.upperFirst(javaProperty);
      result +=
        `${space}public ${javaType} get${startCaseJavaProperty}() {\r\n` +
        `${space}${space}return ${javaProperty};\r\n` +
        `${space}}\r\n\r\n`;

      result +=
        `${space}public void set${startCaseJavaProperty}(${javaType} ${javaProperty}) {\r\n` +
        `${space}${space}this.${javaProperty} = ${javaProperty};\r\n` +
        `${space}}\r\n\r\n`;
    }
    return result;
  }
}
