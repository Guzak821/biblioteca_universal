// Información separada de los usuarios
export interface UsuarioDao {
    findByUsername(username: string): Promise<{ username: string; password: string } | null>;
}