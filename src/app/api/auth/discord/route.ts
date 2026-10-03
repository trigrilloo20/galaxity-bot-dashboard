import { DISCORD_CONFIG } from '@/lib/discord';
import { NextResponse } from 'next/server';

/**
 * GET /api/auth/discord
 * 
 * Redirige al usuario a Discord para autorizar el bot.
 * Este endpoint inicia el flujo OAuth2 de Discord.
 */
export async function GET(request: Request) {
  // Generar un estado aleatorio para protección CSRF
  const state = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
  
  // En producción, deberías guardar este estado en una sesión o base de datos
  // y verificarlo en el callback
  
  // Construir la URL de autorización
  const authUrl = DISCORD_CONFIG.getAuthorizationUrl(state);
  
  // Redirigir a Discord
  return NextResponse.redirect(authUrl);
}
