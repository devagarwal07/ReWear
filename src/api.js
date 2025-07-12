import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Change if backend runs elsewhere
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Example: get user dashboard
export const getUserDashboard = async (clerkId) => {
    const res = await api.get(`/dashboard/${clerkId}`);
    return res.data;
};

// Example: get all items
export const getAllItems = async () => {
    const res = await api.get('/items');
    return res.data;
};

// Example: create a new item
export const createItem = async (itemData) => {
    const res = await api.post('/items', itemData);
    return res.data;
};

// Example: upload image
export const uploadItemImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post('/items/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

// Update user profile
export const updateUserProfile = async (profileData) => {
    const res = await api.put('/users/update-profile', profileData);
    return res.data;
};

export default api;
