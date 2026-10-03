import { DISCORD_CONFIG, type DiscordUser } from '@/lib/discord';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/auth/callback/discord
 * 
 * Callback de Discord OAuth2. Discord redirige aquí después de que el usuario
 * autoriza el bot. Intercambia el código por un token de acceso y obtiene
 * la información del usuario.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Obtener el código de autorización de Discord
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  // Manejar errores de Discord
  if (error) {
    const errorDescription = searchParams.get('error_description') || 'Error desconocido';
    return NextResponse.redirect(
      `/?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription)}`
    );
  }
  
  // Verificar que tenemos el código
  if (!code) {
    return NextResponse.redirect('/?error=access_denied&description=No+se+recibió+el+código+de+autorización');
  }
  
  try {
    // Intercambiar el código por tokens de acceso
    const tokens = await DISCORD_CONFIG.exchangeCode(code);
    
    // Obtener información del usuario
    const user: DiscordUser = await DISCORD_CONFIG.getCurrentUser(tokens.access_token);
    
    // Obtener los servidores (guilds) del usuario
    const guilds = await DISCORD_CONFIG.getUserGuilds(tokens.access_token);
    
    // Aquí normalmente:
    // 1. Crear o actualizar el usuario en tu base de datos
    // 2. Guardar los tokens de forma segura
    // 3. Crear una sesión para el usuario
    
    // Por ahora, redirigimos al dashboard con la información básica
    // En producción, usa cookies seguras o JWT tokens
    const userData = btoa(JSON.stringify({
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar,
      guildCount: guilds.length,
    }));
    
    // Redirigir al dashboard (o a la página principal con éxito)
    return NextResponse.redirect(`/dashboard?user=${userData}`);
    
  } catch (err) {
    console.error('Error en callback de Discord:', err);
    return NextResponse.redirect(
      `/?error=auth_failed&description=${encodeURIComponent(err instanceof Error ? err.message : 'Error al autenticar con Discord')}`
    );
  }
}
