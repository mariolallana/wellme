import { API_CONFIG } from './api.config';

export const uploadFoodImage = async (base64Image: string, token: string) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/nutrient-inference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        image: `data:image/jpeg;base64,${base64Image}`
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};