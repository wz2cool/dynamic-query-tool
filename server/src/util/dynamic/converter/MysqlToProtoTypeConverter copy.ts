import { StringUtils } from "ts-commons";
import { ITypeConverter } from "./ITypeConverter";
import { MySqlType } from "../model/constant/MySqlType";
import { ProtoType } from "../model/constant/ProtoType";

export class MysqlToProtoTypeConverter implements ITypeConverter {
  public convert(mysqlType: string): string | undefined {
    if (StringUtils.isBlank(mysqlType)) {
      return undefined;
    }

    switch (mysqlType.toUpperCase()) {
      case MySqlType.BOOL:
      case MySqlType.BOOLEAN:
        return ProtoType.BOOLEAN;
      case MySqlType.BIT:
      case MySqlType.TINYINT:
      case MySqlType.SMALLINT:
      case MySqlType.MEDIUMINT:
      case MySqlType.INT:
      case MySqlType.INTEGER:
        return ProtoType.INTEGER;
      case MySqlType.BIGINT:
        return ProtoType.LONG;
      case MySqlType.FLOAT:
        return ProtoType.FLOAT;
      case MySqlType.DOUBLE:
      case MySqlType.DECIMAL:
         return ProtoType.DOUBLE;
      case MySqlType.DATE:
      case MySqlType.YEAR:
      case MySqlType.TIMESTAMP:
      case MySqlType.DATETIME:
      case MySqlType.TIME:
        return ProtoType.LONG;
      case MySqlType.CHAR:
      case MySqlType.VARCHAR:
      case MySqlType.TINYTEXT:
      case MySqlType.TEXT:
      case MySqlType.MEDIUMTEXT:
      case MySqlType.LONGTEXT:
        return ProtoType.STRING;
      case MySqlType.BINARY:
      case MySqlType.VARBINARY:
      case MySqlType.TINYBLOB:
      case MySqlType.BLOB:
      case MySqlType.MEDIUMBLOB:
      case MySqlType.LONGBLOB:
        return ProtoType.BYTES;
      default:
        throw new Error(`can not resolve type: ${mysqlType.toUpperCase()}`);
    }
  }
}
