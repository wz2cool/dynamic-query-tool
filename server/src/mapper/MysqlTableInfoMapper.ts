import { BaseTableMapper } from "tsbatis";
import { MysqlTableInfoDO } from "../model/entity/table/MysqlTableInfoDO";

export class MysqlTableInfoMapper extends BaseTableMapper<MysqlTableInfoDO> {
  public getEntityClass(): new () => MysqlTableInfoDO {
    return MysqlTableInfoDO;
  }
}
