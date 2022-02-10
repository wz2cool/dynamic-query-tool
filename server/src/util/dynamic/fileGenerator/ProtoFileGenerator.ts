import * as _ from "lodash";

import { FileGeneratorBase } from "./FileGeneratorBase";
import { IColumnInfo } from "../model/interface/IColumnInfo";
import { DatabaseType } from "tsbatis";
import { StringUtils, ObjectUtils } from "ts-commons";
import { MysqlToProtoTypeConverter } from "../converter/MysqlToProtoTypeConverter copy";

export class ProtoFileGenerator extends FileGeneratorBase {
  constructor(databaseType: DatabaseType) {
    super(databaseType);
    this.typeConverter = new MysqlToProtoTypeConverter();
  }

  public generateFileString(tableName: string, columnInfos: IColumnInfo[]): string {
    const className = `${_.upperFirst(_.camelCase(tableName.toLowerCase()))}`;
    const privateFiledText = this.generatePrivateFieldText(columnInfos);
    let result = "";

    result +=
      `message ${className} {\r\n${privateFiledText}\r\n}`;
    return result;
  }

  private generatePrivateFieldText(columnInfos: IColumnInfo[]): string {
    const space = "    ";
    let result = "";
    for (let i = 0; i < columnInfos.length; i++) {

      const columnInfo = columnInfos[i];
      let needUnsgined = false;
      if (columnInfo.is_unsigned == 1 || StringUtils.containsIgnoreCase(columnInfo.type, "date") || StringUtils.containsIgnoreCase(columnInfo.type, "time")) {
        needUnsgined = true;
      }
      const protoType = (needUnsgined ? "u" : "") + this.typeConverter.convert(columnInfo.type);
      const protoProperty = columnInfo.name;
      if (StringUtils.isNotBlank(columnInfo.comment) && ObjectUtils.hasValue(columnInfo.comment)) {
        result += `${space}/**\r\n${space} * ${StringUtils.trim(columnInfo.comment)}\r\n ${space}*/\r\n`;
      }

      result += `${space}${protoType} ${protoProperty} = ${i + 1};\r\n`;
    }
    return result;
  }
}
