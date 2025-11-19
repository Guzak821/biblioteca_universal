import { Controller, Get } from '@nestjs/common'

@Controller('banco')
export class BancoController {
    @Get()
    findAll(): string {
        return 'Esta acción regresa los bancos'
    }
}