// src/services/api.ts
const API_BASE_URL = 'http://100.124.95.109:3333';

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  is_admin?: boolean;
}

interface LoginData {
  email: string;
  senha: string;
}

interface User {
  id: number;
  nome: string;
  email: string;
  saldo: number;
  is_admin: boolean;
}

interface Room {
  id: number;
  nome: string;
  descricao: string;
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  // Auth endpoints
  async register(data: RegisterData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao registrar');
    return response.json();
  }

  async login(data: LoginData) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Credenciais inválidas');
    const result = await response.json();
    if (result.token) {
      localStorage.setItem('token', result.token);
    }
    return result;
  }

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar perfil');
    return response.json();
  }

  // User endpoints
  async getMe() {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar dados do usuário');
    return response.json();
  }

  async updateMe(data: Partial<User>) {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao atualizar perfil');
    return response.json();
  }

  async recharge(amount: number) {
    const response = await fetch(`${API_BASE_URL}/users/me/recharge`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ amount }),
    });
    if (!response.ok) throw new Error('Erro ao recarregar créditos');
    return response.json();
  }

  // Admin - User management
  async createUser(data: RegisterData) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao criar usuário');
    return response.json();
  }

  async getAllUsers() {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar usuários');
    return response.json();
  }

  async getUserById(id: number) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar usuário');
    return response.json();
  }

  async deleteUser(id: number) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao deletar usuário');
    return response.json();
  }

  // Rooms endpoints
  async getAllRooms() {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar salas');
    return response.json();
  }

  async getRoomById(id: number) {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar sala');
    return response.json();
  }

  async createRoom(data: { nome: string; descricao: string }) {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao criar sala');
    return response.json();
  }

  async updateRoom(id: number, data: Partial<Room>) {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao atualizar sala');
    return response.json();
  }

  async deleteRoom(id: number) {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao deletar sala');
    return response.json();
  }

  // Games endpoints
  async getAllGames() {
    const response = await fetch(`${API_BASE_URL}/games`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Erro ao buscar jogos');
    return response.json();
  }

  logout() {
    localStorage.removeItem('token');
  }
}

export const api = new ApiService();
export type { User, Room };