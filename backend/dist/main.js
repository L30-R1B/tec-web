"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    const reflector = app.get(core_1.Reflector);
    app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard(reflector));
    const port = process.env.PORT || 3333;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Aplicação rodando em: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map