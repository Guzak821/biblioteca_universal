"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.enableCors({
        origin: 'http://192.168.137.11:5173',
        credentials: true,
    });
    await app.listen(3003, '0.0.0.0');
    console.log('API disponible en: http://0.0.0.0:3003');
}
bootstrap();
//# sourceMappingURL=main.js.map