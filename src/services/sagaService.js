import api from './api';

export const getAllSagas = async () => {
    const response = await api.get('/sagas');
    return response.data;
};

export const getSagaById = async (id) => {
    const response = await api.get(`/sagas/${id}`);
    return response.data;
};

export const createSaga = async (sagaData) => {
    const response = await api.post('/sagas', sagaData);
    return response.data;
};

export const updateSaga = async (id, sagaData) => {
    const response = await api.put(`/sagas/${id}`, sagaData);
    return response.data;
};

export const deleteSaga = async (id) => {
    const response = await api.delete(`/sagas/${id}`);
    return response.data;
};
