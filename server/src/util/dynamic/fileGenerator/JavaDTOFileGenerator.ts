import _ = require("lodash");

import { FileGeneratorBase } from "./FileGeneratorBase";
import { IColumnInfo } from "../model/interface/IColumnInfo";
import { DatabaseType } from "tsbatis";
import { JavaType } from "../model/constant/JavaType";
import { ArrayUtils, StringUtils } from "ts-commons";

export class JavaDTOFileGenerator extends FileGeneratorBase {
  constructor(databaseType: DatabaseType) {
    super(databaseType);
  }

  public generateFileString(tableName: string, columnInfos: IColumnInfo[]): string {
    const className = `${_.upperFirst(_.camelCase(tableName.toLowerCase()))}DTO`;
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
      `import io.swagger.annotations.*;\r\n\r\n` +
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
        result += `${space}@ApiModelProperty("${columnInfo.comment}")\r\n`;
      }
      result += `${space}private ${javaType} ${javaProperty};\r\n`;
    }
    return result;
  }
}
