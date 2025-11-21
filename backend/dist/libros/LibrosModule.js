"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibrosModule = void 0;
const common_1 = require("@nestjs/common");
const LibroController_1 = require("../controller/LibroController");
const LibrosService_1 = require("../libros/domain/service/LibrosService");
const LibroDao_1 = require("./domain/dao/LibroDao");
const LibroCqrs_1 = require("./aplication/mvc/LibroCqrs");
const ExternalApiService_1 = require("./infraestucture/api-service/ExternalApiService");
const LibroViewModel_1 = require("./domain/view-model/LibroViewModel");
let LibrosModule = class LibrosModule {
};
exports.LibrosModule = LibrosModule;
exports.LibrosModule = LibrosModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [LibroController_1.LibrosController],
        providers: [
            LibrosService_1.LibrosService,
            LibroDao_1.LibroDao,
            LibroCqrs_1.LibroCqrs,
            LibroViewModel_1.LibroViewModelMapper,
            ExternalApiService_1.ExternalApiService,
        ],
    })
], LibrosModule);
//# sourceMappingURL=LibrosModule.js.map