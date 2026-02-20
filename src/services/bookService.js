import api from './api';

// Busca libros en Google a través de tu backend
export const searchBooksInGoogle = async (title) => {
    try {
        const response = await api.get(`/books/search?title=${title}`);
        return response.data;
    } catch (error) {
        console.error("Error buscando en Google Books:", error);
        throw error;
    }
};

// Guarda un libro en tu base de datos de PostgreSQL
export const saveBookToLibrary = async (bookData) => {
    try {
        const response = await api.post('/books', bookData);
        return response.data;
    } catch (error) {
        console.error("Error al guardar el libro:", error);
        throw error;
    }
};

// Obtiene todos los libros guardados en tu PostgreSQL
export const getAllBooks = async () => {
    try {
        const response = await api.get('/books');
        return response.data;
    } catch (error) {
        console.error("Error obteniendo la biblioteca:", error);
        throw error;
    }
};

export const startReadingBook = async (id) => {
    console.log("🚀 Intentando empezar lectura del ID:", id); // LOG 1
    try {
        const { data: currentBook } = await api.get(`/books/${id}`);
        console.log("📚 Libro recuperado:", currentBook); // LOG 2

        const updatedBook = {
            ...currentBook,
            status: 'READING',
            startDate: new Date().toISOString().split('T')[0]
        };

        console.log("sending to backend:", updatedBook); // LOG 3
        const response = await api.put(`/books/${id}`, updatedBook);
        return response.data;
    } catch (error) {
        console.error("❌ ERROR DETECTADO EN AXIOS:", error.response || error);
        throw error;
    }
};

export const finishReadingBook = async (id, rating) => {
    try {
        // 1. Recuperar el libro actual completo para no perder datos (saga, autor, etc.)
        const { data: currentBook } = await api.get(`/books/${id}`);

        // 2. Preparar el payload mezclando los datos existentes con los nuevos
        const updatedBook = {
            ...currentBook,
            status: 'FINISHED',
            endDate: new Date().toISOString().split('T')[0], // Fecha de hoy
            rating: rating
        };

        // 3. Enviar la actualización completa
        const response = await api.put(`/books/${id}`, updatedBook);
        return response.data;
    } catch (error) {
        console.error("Error finishing book:", error);
        throw error;
    }
};

export const updateBook = async (id, bookData) => {
    try {
        const response = await api.put(`/books/${id}`, bookData);
        return response.data;
    } catch (error) {
        console.error("Error updating book:", error);
        throw error;
    }
};

export const deleteBook = async (id) => {
    try {
        await api.delete(`/books/${id}`);
    } catch (error) {
        console.error("Error deleting book:", error);
        throw error;
    }
};