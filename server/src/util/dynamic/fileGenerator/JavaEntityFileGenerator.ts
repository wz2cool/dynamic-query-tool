import * as _ from "lodash";

import { FileGeneratorBase } from "./FileGeneratorBase";
import { IColumnInfo } from "../model/interface/IColumnInfo";
import { DatabaseType } from "tsbatis";

import { StringUtils, ArrayUtils, ObjectUtils } from "ts-commons";
import { JavaType } from "../model/constant/JavaType";

export class JavaEntityFileGenerator extends FileGeneratorBase {
  constructor(databaseType: DatabaseType) {
    super(databaseType);
  }

  public generateFileString(tableName: string, columnInfos: IColumnInfo[]): string {
    const className = `${_.upperFirst(_.camelCase(tableName.toLowerCase()))}DO`;
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
      if (StringUtils.isNotBlank(columnInfo.comment) && ObjectUtils.hasValue(columnInfo.comment)) {
        result += `${space}/**\r\n${space} * ${StringUtils.trim(columnInfo.comment)}\r\n ${space}*/\r\n`;
      }
      if (columnInfo.pk === 1) {
        result += `${space}@Id\r\n`;
      }
      result += `${space}@Column\r\n`;
      result += `${space}private ${javaType} ${javaProperty};\r\n`;
    }
    return result;
  }
}
