/**
 * Decodifica um JWT token sem verificar a assinatura
 * @param token - O token JWT
 * @returns O payload decodificado ou null se inválido
 */
export const decodeJWT = (token: string) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Erro ao decodificar JWT:", error);
    return null;
  }
};

/**
 * Verifica se o JWT token está expirado
 * @param token - O token JWT
 * @returns true se expirado, false caso contrário
 */
export const isJWTExpired = (token: string): boolean => {
  const payload = decodeJWT(token);

  if (!payload || !payload.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

/**
 * Obtém o tempo de expiração do token em milissegundos
 * @param token - O token JWT
 * @returns O timestamp de expiração em milissegundos ou null se inválido
 */
export const getJWTExpiration = (token: string): number | null => {
  const payload = decodeJWT(token);

  if (!payload || !payload.exp) {
    return null;
  }

  return payload.exp * 1000;
};
