import axios from 'axios';

// TRUCO PRO: window.location.hostname coge la IP exacta desde la que estás navegando.
// Así funciona tanto en "localhost" (PC) como en "192.168.X.X" (Móvil).
const api = axios.create({
    baseURL: `http://${window.location.hostname}:8080/api`,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Función para subir imágenes
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/files/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data; // Retorna la URL del archivo
};

export default api;