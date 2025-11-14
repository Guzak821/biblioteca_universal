// Información separada de los usuarios

import { UsuarioModel } from "../models/usuario-model";

export class UsuarioDao {

async findByUser(user: string, password: string): Promise<UsuarioModel | null> {
    // Simulación de búsqueda en base de datos
    const usuarios: UsuarioModel[] = [
        { id: 1, user: 'user1', password: 'user123', rol: 'Bibliotecario' },
        { id: 2, user: 'student', password: 'student123', rol: 'Alumno' },
    ];
    const usuario = usuarios.find(u => u.user === user);
    return usuario || null;
  }
}

