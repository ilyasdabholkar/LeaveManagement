import { jwtDecode } from "jwt-decode";
import apiClient from "./api";
import { API_ENDPOINTS } from "../config/api";


const TOKEN_KEY = "token"; 
const USER_KEY = "user"

export const AuthService = {
  
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getLoggedInUser() {
    return JSON.parse(localStorage.getItem(USER_KEY));
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
 
  async assignCredentials ({ id, email, role, password }) {
  try {
    const response = await apiClient.post(API_ENDPOINTS.auth.register, {
      id,
      email,
      role,
      password,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  }
};
