import { Router, Request, Response } from 'express';
import { AuthController } from '../auth/AuthController';
import { AuthService } from 'src/auth/AuthService';

const router = Router();
const authService = new AuthService();

/**
 * POST /api/auth/login
 * Endpoint para autenticar usuarios (patrón MVC)
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son requeridos',
      });
    }

    const result = await authService.login(usuario, contrasena);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(401).json(result);
    }
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
});

/**
 * POST /api/auth/logout
 * Endpoint para cerrar sesión
 */
router.post('/logout', (req: Request, res: Response) => {
  // En un sistema real, aquí invalidarías el token JWT
  return res.status(200).json({
    success: true,
    message: 'Sesión cerrada correctamente',
  });
});

export default router;