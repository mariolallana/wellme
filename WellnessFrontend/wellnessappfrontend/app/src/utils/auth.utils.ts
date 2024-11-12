import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAuthHeader = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
    return { Authorization: `Bearer ${token}` };
};