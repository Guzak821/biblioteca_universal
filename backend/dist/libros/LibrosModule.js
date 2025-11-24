"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibrosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const LibroEntity_1 = require("../libros/LibroEntity");
const LibroDao_1 = require("../libros/domain/dao/LibroDao");
const LibroCqrs_1 = require("../libros/aplication/mvc/LibroCqrs");
const LibroController_1 = require("../controller/LibroController");
const libros_controller_1 = require("./libros.controller");
const UnamApiService_1 = require("./infraestucture/api-service/UnamApiService");
const OxfordApiService_1 = require("./infraestucture/api-service/OxfordApiService");
const typeorm_2 = require("typeorm");
const typeorm_3 = require("@nestjs/typeorm");
let LibrosModule = class LibrosModule {
    constructor(libroRepository) {
        this.libroRepository = libroRepository;
    }
    async onModuleInit() {
        const count = await this.libroRepository.count();
        if (count === 0) {
            console.log('📚 Insertando libros iniciales...');
            const librosMock = [
                {
                    titulo: 'Álgebra de Baldor',
                    generoLiterario: 'Matemáticas',
                    portadaBase64: 'https://placehold.co/200x300/087990/ffffff?text=Algebra',
                    pdfBase64: 'mock_pdf_base64_baldor',
                    universidadPropietaria: 'UTL',
                },
                {
                    titulo: 'Cálculo Diferencial',
                    generoLiterario: 'Matemáticas',
                    portadaBase64: 'https://placehold.co/200x300/2ecc71/ffffff?text=Calculo',
                    pdfBase64: 'mock_pdf_base64_calculo',
                    universidadPropietaria: 'UTL',
                },
                {
                    titulo: 'Biología Molecular',
                    generoLiterario: 'Biología',
                    portadaBase64: 'https://placehold.co/200x300/e74c3c/ffffff?text=Biologia',
                    pdfBase64: 'mock_pdf_base64_biologia',
                    universidadPropietaria: 'UTL',
                },
            ];
            for (const libroData of librosMock) {
                const libro = this.libroRepository.create(libroData);
                await this.libroRepository.save(libro);
                console.log(`✅ Libro creado: ${libroData.titulo}`);
            }
            console.log('✅ Libros mock insertados');
        }
        else {
            console.log('ℹ️  La base de datos ya tiene libros');
        }
    }
};
exports.LibrosModule = LibrosModule;
exports.LibrosModule = LibrosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([LibroEntity_1.LibroEntity])],
        controllers: [libros_controller_1.LibrosController],
        providers: [
            LibroDao_1.LibroDao,
            LibroCqrs_1.LibroCqrs,
            LibroController_1.LibroController,
            UnamApiService_1.UnamApiService,
            OxfordApiService_1.OxfordApiService,
        ],
        exports: [LibroController_1.LibroController, LibroDao_1.LibroDao, LibroCqrs_1.LibroCqrs],
    }),
    __param(0, (0, typeorm_3.InjectRepository)(LibroEntity_1.LibroEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LibrosModule);
//# sourceMappingURL=LibrosModule.js.map