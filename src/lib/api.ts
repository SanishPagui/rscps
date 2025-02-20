export const fetchRides = async () => {
    try {
      const response = await fetch('/api/rides');
      if (!response.ok) {
        throw new Error('Failed to fetch rides');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  