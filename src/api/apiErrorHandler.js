const handleApiError = (error) => {
    if (error.response) {
      // Server responded with a status code outside 2xx
      console.error('❌ API Error:', error.response.status, error.response.data);
  
      switch (error.response.status) {
        case 400:
          alert('Bad Request: Please check your input.');
          break;
        case 401:
          alert('Unauthorized: Please log in again.');
          break;
        case 403:
          alert('Forbidden: You do not have access.');
          break;
        case 404:
          alert('Not Found: Requested resource is missing.');
          break;
        case 500:
          alert('Server Error: Try again later.');
          break;
        default:
          alert('Something went wrong. Please try again.');
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('❌ No Response from Server:', error.request);
      alert('Network error. Check your connection and try again.');
    } else {
      // Something else happened (coding error, timeout, etc.)
      console.error('❌ Unexpected Error:', error.message);
      alert('An unexpected error occurred. Please try again.');
    }
  };
  
  export default handleApiError;
  