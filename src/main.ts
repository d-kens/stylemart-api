import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BadRequestException, Logger, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { HttpExceptionFilter } from "./filter/http-exception/http-exception.filter";

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

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Application is running on port ${port}`);
}

bootstrap();
