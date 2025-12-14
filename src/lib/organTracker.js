import api from './api';

/**
 * Track when a user explores/views an organ
 * @param {string} organName - The name of the organ being explored
 */
export const trackOrganExploration = async (organName) => {
  try {
    // Normalize organ name (remove special characters, convert to lowercase)
    const normalizedOrganName = organName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/^-+|-+$/g, '');

    console.log(`Tracking organ exploration: ${normalizedOrganName}`);
    
    const response = await api.markOrganExplored(normalizedOrganName);
    console.log('Organ tracking response:', response);
    
    return response;
  } catch (error) {
    console.error('Failed to track organ exploration:', error);
    return null;
  }
};

/**
 * Get all organ progress for the current user
 */
export const getOrganProgress = async () => {
  try {
    const response = await api.getOrganProgress();
    return response;
  } catch (error) {
    console.error('Failed to get organ progress:', error);
    return null;
  }
};

export default {
  trackOrganExploration,
  getOrganProgress
};
