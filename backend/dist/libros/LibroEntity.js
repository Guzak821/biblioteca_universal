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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibroEntity = void 0;
const typeorm_1 = require("typeorm");
let LibroEntity = class LibroEntity {
};
exports.LibroEntity = LibroEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LibroEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], LibroEntity.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'genero_literario', length: 100 }),
    __metadata("design:type", String)
], LibroEntity.prototype, "generoLiterario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'portada_base64', type: 'text', nullable: true }),
    __metadata("design:type", String)
], LibroEntity.prototype, "portadaBase64", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pdf_base64', type: 'text', nullable: true }),
    __metadata("design:type", String)
], LibroEntity.prototype, "pdfBase64", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'universidad_propietaria', length: 50, default: 'UTL' }),
    __metadata("design:type", String)
], LibroEntity.prototype, "universidadPropietaria", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LibroEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], LibroEntity.prototype, "updated_at", void 0);
exports.LibroEntity = LibroEntity = __decorate([
    (0, typeorm_1.Entity)('libros')
], LibroEntity);
//# sourceMappingURL=LibroEntity.js.map