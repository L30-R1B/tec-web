(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/tec-web/src/services/api.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/services/api.ts
__turbopack_context__.s([
    "api",
    ()=>api
]);
const API_BASE_URL = 'http://100.124.95.109:3333';
class ApiService {
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...token && {
                'Authorization': "Bearer ".concat(token)
            }
        };
    }
    // Auth endpoints
    async register(data) {
        const response = await fetch("".concat(API_BASE_URL, "/auth/register"), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Erro ao registrar');
        return response.json();
    }
    async login(data) {
        const response = await fetch("".concat(API_BASE_URL, "/auth/login"), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Credenciais inválidas');
        const result = await response.json();
        if (result.token) {
            localStorage.setItem('token', result.token);
        }
        return result;
    }
    async getProfile() {
        const response = await fetch("".concat(API_BASE_URL, "/auth/profile"), {
            headers: this.getAuthHeaders()
        });
        if (!response.ok) throw new Error('Erro ao buscar perfil');
        return response.json();
    }
    // User endpoints
    async getMe() {
        const response = await fetch("".concat(API_BASE_URL, "/users/me"), {
            headers: this.getAuthHeaders()
        });
        if (!response.ok) throw new Error('Erro ao buscar dados do usuário');
        return response.json();
    }
    async updateMe(data) {
        const response = await fetch("".concat(API_BASE_URL, "/users/me"), {
            method: 'PATCH',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Erro ao atualizar perfil');
        return response.json();
    }
    async recharge(amount) {
        const response = await fetch("".concat(API_BASE_URL, "/users/me/recharge"), {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify({
                amount
            })
        });
        if (!response.ok) throw new Error('Erro ao recarregar créditos');
        return response.json();
    }
    // Admin - User management
    async createUser(data) {
        const response = await fetch("".concat(API_BASE_URL, "/users"), {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Erro ao criar usuário');
        return response.json();
    }
    async getAllUsers() {
        const response = await fetch("".concat(API_BASE_URL, "/users"), {
            headers: this.getAuthHeaders()
        });
        if (!response.ok) throw new Error('Erro ao buscar usuários');
        return response.json();
    }
    async getUserById(id) {
        const response = await fetch("".concat(API_BASE_URL, "/users/").concat(id), {
            headers: this.getAuthHeaders()
        });
        if (!response.ok) throw new Error('Erro ao buscar usuário');
        return response.json();
    }
    async deleteUser(id) {
        const response = await fetch("".concat(API_BASE_URL, "/users/").concat(id), {
            method: 'DELETE',
            headers: this.getAuthHeaders()
        });
        if (!response.ok) throw new Error('Erro ao deletar usuário');
        return response.json();
    }
    // Rooms endpoints
    async getAllRooms() {
        const response = await fetch("".concat(API_BASE_URL, "/rooms"), {
            headers: this.getAuthHeaders()
        });
        if (!response.ok) throw new Error('Erro ao buscar salas');
        return response.json();
    }
    async getRoomById(id) {
        const response = await fetch("".concat(API_BASE_URL, "/rooms/").concat(id), {
            headers: this.getAuthHeaders()
        });
        if (!response.ok) throw new Error('Erro ao buscar sala');
        return response.json();
    }
    async createRoom(data) {
        const response = await fetch("".concat(API_BASE_URL, "/rooms"), {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Erro ao criar sala');
        return response.json();
    }
    async updateRoom(id, data) {
        const response = await fetch("".concat(API_BASE_URL, "/rooms/").concat(id), {
            method: 'PATCH',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Erro ao atualizar sala');
        return response.json();
    }
    async deleteRoom(id) {
        const response = await fetch("".concat(API_BASE_URL, "/rooms/").concat(id), {
            method: 'DELETE',
            headers: this.getAuthHeaders()
        });
        if (!response.ok) throw new Error('Erro ao deletar sala');
        return response.json();
    }
    // Games endpoints
    async getAllGames() {
        const response = await fetch("".concat(API_BASE_URL, "/games"), {
            headers: this.getAuthHeaders()
        });
        if (!response.ok) throw new Error('Erro ao buscar jogos');
        return response.json();
    }
    logout() {
        localStorage.removeItem('token');
    }
}
const api = new ApiService();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/tec-web/src/contexts/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/contexts/AuthContext.tsx
__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$tec$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tec-web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tec$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tec-web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$tec$2d$web$2f$src$2f$services$2f$api$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/tec-web/src/services/api.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tec$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider(param) {
    let { children } = param;
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tec$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tec$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$tec$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            checkAuth();
        }
    }["AuthProvider.useEffect"], []);
    const checkAuth = async ()=>{
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const userData = await __TURBOPACK__imported__module__$5b$project$5d2f$tec$2d$web$2f$src$2f$services$2f$api$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].getMe();
                setUser(userData);
            }
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            localStorage.removeItem('token');
        } finally{
            setLoading(false);
        }
    };
    const login = async (email, senha)=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$tec$2d$web$2f$src$2f$services$2f$api$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].login({
            email,
            senha
        });
        const userData = await __TURBOPACK__imported__module__$5b$project$5d2f$tec$2d$web$2f$src$2f$services$2f$api$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].getMe();
        setUser(userData);
    };
    const register = async (nome, email, senha, is_admin)=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$tec$2d$web$2f$src$2f$services$2f$api$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].register({
            nome,
            email,
            senha,
            is_admin
        });
        await login(email, senha);
    };
    const logout = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$tec$2d$web$2f$src$2f$services$2f$api$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].logout();
        setUser(null);
    };
    const refreshUser = async ()=>{
        try {
            const userData = await __TURBOPACK__imported__module__$5b$project$5d2f$tec$2d$web$2f$src$2f$services$2f$api$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].getMe();
            setUser(userData);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$tec$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            loading,
            login,
            logout,
            register,
            refreshUser
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/tec-web/src/contexts/AuthContext.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "NiO5z6JIqzX62LS5UWDgIqbZYyY=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$tec$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=tec-web_src_10680d22._.js.map