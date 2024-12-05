import { Injectable } from '@nestjs/common';

@Injectable()
export class BlacklistService {
  private blacklistedTokens: Set<string> = new Set();

  // Añadir un token a la lista negra
  addToBlacklist(token: string): void {
    this.blacklistedTokens.add(token);
  }

  // Verificar si un token está en la lista negra
  isBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  // Eliminar un token de la lista negra
  removeFromBlacklist(token: string): void {
    this.blacklistedTokens.delete(token);
  }
}
