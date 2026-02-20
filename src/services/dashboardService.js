import api from './api';

export const getDashboardStats = async () => {
    try {
        // Llama al endpoint GET /api/dashboard que creamos en Java
        const response = await api.get('/dashboard');
        return response.data;
    } catch (error) {
        console.error("Error al cargar el dashboard:", error);
        throw error;
    }
};