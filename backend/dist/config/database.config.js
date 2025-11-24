"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const LibroEntity_1 = require("../libros/LibroEntity");
const usuario_entity_1 = require("../usuarios/usuario.entity");
exports.databaseConfig = {
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [__dirname + '/../**/*.entity{.ts,.js}', LibroEntity_1.LibroEntity, usuario_entity_1.UsuarioEntity],
    synchronize: true,
    logging: true,
};
//# sourceMappingURL=database.config.js.map