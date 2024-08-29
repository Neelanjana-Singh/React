// // src/utils/errorHandler.js 
 
// /** 
//  * Handles API errors and formats them for user-friendly messages. 
//  * @param {Error} error - The error object thrown by Axios or another API client. 
//  * @returns {string} - A user-friendly error message. 
//  */ 
// export const handleApiError = (error) => { 
//     if (error.response) { 
//       // Server responded with a status code other than 2xx 
//       return error.response.data?.message || 'An unexpected error occurred.'; 
//     } else if (error.request) { 
//       // Request was made but no response received 
//       return 'No response received from the server.'; 
//     } else { 
//       // Something happened in setting up the request 
//       return error.message || 'An error occurred.'; 
//     } 
//   }; 
   
//   /** 
//    * Handles validation errors and formats them for user-friendly messages. 
//    * @param {Object} errors - The validation errors object. 
//    * @returns {string} - A user-friendly error message. 
//    */ 
//   export const handleValidationError = (errors) => { 
//     if (typeof errors === 'object') { 
//       return Object.values(errors).join(' '); 
//     } 
//     return 'Validation error occurred.'; 
//   };