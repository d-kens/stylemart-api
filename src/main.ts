import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { HttpExceptionFilter } from "./filter/http-exception/http-exception.filter";

async function bootstrap() {
  const logger = new Logger('HTTP');
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.use((req, res, next) => {
    logger.log(`Incoming ${req.method} request to ${req.url}`);
    logger.debug(`Headers: ${JSON.stringify(req.headers)}`);
    
    const oldSend = res.send;
    res.send = function(data) {
      logger.log(`Response for ${req.method} ${req.url}: Status ${res.statusCode}`);
      return oldSend.apply(res, arguments);
    };
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
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