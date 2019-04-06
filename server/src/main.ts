import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle("Dynamic query tool")
    .setDescription("The cats API description")
    .setVersion("1.0")
    .addTag("AppController")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger-ui", app, document);

  await app.listen(3000);
}
bootstrap();
