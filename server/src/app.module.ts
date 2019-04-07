import { Module } from "@nestjs/common";
import { AppController } from "./controller/AppController";
import { AppService } from "./service/AppService";
import { DynamicQueryController } from "./controller/DynamicQueryController";
import { MysqlService } from "./service/MysqlService";

@Module({
  imports: [],
  controllers: [AppController, DynamicQueryController],
  providers: [AppService, MysqlService],
})
export class AppModule {}
