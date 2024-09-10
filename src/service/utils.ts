export const calculateAge = (birthDateString: string): number => {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
  
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
  
    return age;
  };

export const calculateTimeDifference = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const difference = now.getTime() - date.getTime();
  
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) {
      return `${days} days ago`;
    }
  
    if (hours > 0) {
      return `${hours} h ago`;
    }
  
    if (minutes > 0) {
      return `${minutes} min ago`;
    }
  
    return `${seconds} sec ago`;
};

/**
 * Extracts the photo name from a URL.
 * 
 * @param {string} url - The URL containing the photo name.
 * @param {string} uid - The user ID.
 * @returns {string} - The extracted photo name.
 */
export const extractPhotoName = (url: string, uid: string): string => {
  const parts = url.split(`users%2F${uid}%2F`);
  if (parts.length > 1) {
    const photoNameWithToken = parts[1].split('?')[0]; 
    return decodeURIComponent(photoNameWithToken); 
  }
  return '';
};
