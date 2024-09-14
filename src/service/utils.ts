import { assets } from "../assets/assets";

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


export const pickImage = (state: string) => {
  if(state === "New friends") {
    return {
      img : assets.wave,
      color: "#2570a6",
      backgroundColor: '#d0cdae7c'
    };
  }else if(state === "Long relationship") {
    return {
      img : assets.hearth,
      color: "#c42bd2",
      backgroundColor: 'rgb(59, 7, 84)'
    };
  }else if(state === "Something short") {
    return {
      img : assets.cheers,
      color: "#ffdd03",
      backgroundColor: '#461e08'
    };
  }else if(state === "Some fun") {
    return {
      img : assets.fire,
      color: "#ffdd03",
      backgroundColor: 'rgb(255,49,49)'
    };
  }else {
    return {
      img : assets.smiley,
      color: "#678ba986",
      backgroundColor: '#d0cdae7c'
    };
  }
}
