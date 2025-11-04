// path: src/main.ts
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configura um pipe de validação global para DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Usa o interceptor para remover campos sensíveis (como senha) das respostas
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Aplica o guard JWT globalmente em toda a aplicação
  // Rotas públicas devem usar o decorador @IsPublic()
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  const port = process.env.PORT || 3333;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Aplicação rodando em: ${await app.getUrl()}`);
}
bootstrap();

