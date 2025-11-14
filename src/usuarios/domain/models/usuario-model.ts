// modulo de usuarios

import { Request, Response } from 'express';
import { UsuarioDao } from 'src/usuarios/domain/dao/usuario-dao';

export class UsuarioModel {
  // Estos campos se mapeen a la BD
  id: number;
  user: string; 
  password: string;
  rol: 'Bibliotecario' | 'Alumno'; // Valida los 2 tipos de usuarios
}