// Discord API Configuration
// Este archivo contiene la configuración para conectar con la API de Discord

export const DISCORD_CONFIG = {
  // URLs de la API de Discord
  apiBaseUrl: 'https://discord.com/api/v10',
  authorizationUrl: 'https://discord.com/api/oauth2/authorize',
  tokenUrl: 'https://discord.com/api/oauth2/token',
  
  // Scopes (permisos) que solicitamos
  scopes: ['identify', 'guilds', 'bot', 'applications.commands'],
  
  // Permisos del bot (en formato bitfield)
  // Admin = 8, Manage Server = 32, Manage Roles = 268435456, etc.
  permissions: '8', // Administrator
  
  // Obtener las variables de entorno o usar valores por defecto
  get clientId(): string {
    return process.env.DISCORD_CLIENT_ID || '';
  },
  
  get clientSecret(): string {
    return process.env.DISCORD_CLIENT_SECRET || '';
  },
  
  get botToken(): string {
    return process.env.DISCORD_BOT_TOKEN || '';
  },
  
  get redirectUri(): string {
    return process.env.DISCORD_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/discord';
  },
  
  // Generar URL de autorización OAuth2
  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: this.scopes.join(' '),
      state: state,
      permissions: this.permissions,
    });
    
    return `${this.authorizationUrl}?${params.toString()}`;
  },
  
  // Intercambiar código por token de acceso
  async exchangeCode(code: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  }> {
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirectUri,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error intercambiando código: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Obtener información del usuario actual
  async getCurrentUser(accessToken: string): Promise<DiscordUser> {
    const response = await fetch(`${this.apiBaseUrl}/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error obteniendo usuario: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  // Obtener servidores (guilds) del usuario
  async getUserGuilds(accessToken: string): Promise<DiscordGuild[]> {
    const response = await fetch(`${this.apiBaseUrl}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error obteniendo guilds: ${response.statusText}`);
    }
    
    return response.json();
  }
};

// Tipos para la API de Discord
export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string;
  verified?: boolean;
  locale?: string;
  mfa_enabled?: boolean;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}

// Función helper para obtener el avatar URL
export function getDiscordAvatarUrl(user: DiscordUser, size = 256): string {
  if (user.avatar) {
    const extension = user.avatar.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=${size}`;
  }
  // Avatar por defecto
  const discriminator = parseInt(user.discriminator) % 5;
  return `https://cdn.discnd.com/embed/avatars/${discriminator}.png?size=${size}`;
}

// Función para obtener el icono del servidor
export function getGuildIconUrl(guild: DiscordGuild, size = 128): string {
  if (guild.icon) {
    const extension = guild.icon.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${extension}?size=${size}`;
  }
  return null;
}

export default DISCORD_CONFIG;
