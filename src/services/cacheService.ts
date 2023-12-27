interface UserData {
    email: string;
    phone: string;
    ip: string;
    device: string;
  }
  
  const userCache: Record<string, UserData> = {};
  
  function cacheUserData(userId: string, userData: UserData) {
    userCache[userId] = userData;
  }
  
  export { cacheUserData };
  