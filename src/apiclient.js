import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // Replace with your API base URL
  timeout: 50000,                       // Optional: Set a timeout for requests
});

// Add a request interceptor to attach the token to every request
// apiClient.interceptors.request.use(
//   (config) => {
//     // Get the token from local storage or wherever you store it
//     const token = localStorage.getItem('Token');
//     const retail_code = localStorage.getItem('retail_code');

//     if (token) {
//       config.headers['Authorization'] = `Token ${token}`;
//       config.headers['X-RETAIL-ID'] = retail_code;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Add a response interceptor to handle errors (optional)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      console.log("Unauthorized. Redirecting to login...");
      // Optional: Add code to redirect to login or clear session storage
    }

    if (error.response && error.response.status === 403) {
      // Handle unauthorized error (e.g., redirect to login)
      console.log("Forbidden. Redirecting to forbidden...");
      window.location.href = "/forbidden";
      // Optional: Add code to redirect to login or clear session storage
    }
    return Promise.reject(error);
  }
);

export default apiClient;