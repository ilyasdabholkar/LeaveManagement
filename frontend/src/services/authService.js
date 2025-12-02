import { jwtDecode } from "jwt-decode";


const TOKEN_KEY = "token"; 

export const AuthService = {
  
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUserFromToken() {
    try {
      const token = this.getToken();
      if (!token) return null;

      const payload = jwtDecode(token);

      return {
        userId: payload.sub,
        email: payload.uid,
        role: payload.role,
        dbId: payload.dbId,
        expiresAt: payload.exp,
        notBefore: payload.nbf,
        issuer: payload.iss,
        audience: payload.aud,
      };
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  },

  isAuthenticated() {
    const user = this.getUserFromToken();
    if (!user) return false;

    return user.expiresAt * 1000 > Date.now();
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  }
};
