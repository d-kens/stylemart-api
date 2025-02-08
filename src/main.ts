import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { HttpExceptionFilter } from "./filter/http-exception/http-exception.filter";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const logger = new Logger("HTTP");
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.enableCors({
    origin: [
      process.env.WEB_DOMAIN,
      "http://localhost:4200",
      "https://api.safaricom.co.ke",
    ],
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
    allowedHeaders: ["content-type", "authorization"],
    credentials: true,
  });

  app.use(cookieParser());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle("Stylemart API")
    .setDescription("API documentation for Stylemart platform")
    .setVersion("1.0")
    .addBearerAuth() // Adds JWT authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Application is running on port ${port}`);
  logger.log(`📄 Swagger Docs available at http://localhost:${port}/api/docs`);
}

bootstrap();
