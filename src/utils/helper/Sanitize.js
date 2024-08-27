// export const  sanitizeCustomerData = ({ data, keysTobeSelected }) => {
//     if (Array.isArray(data)) {
//       return data.map((item) => sanitizeCustomerData({ data: item, keysTobeSelected }));
//     }
  
//     const resultList = {};
  
//     keysTobeSelected.forEach((element) => {
//       if (element.includes(".")) {
//         const [firstKey, ...rest] = element.split(".");
//         const nestedKey = rest.join(".");
  
//         if (data[firstKey]) {
//           resultList[firstKey] = {
//             ...resultList[firstKey],
//             ...sanitizeCustomerData({
//               data: data[firstKey],
//               keysTobeSelected: [nestedKey],
//             }),
//           };
//         }
//       } else if (data.hasOwnProperty(element)) {
//         resultList[element] = data[element];
//       }
//     });
  
//     return resultList;
//   };

// export const sanitizeCustomerData = ({ data, keysTobeSelected, includePagination = false }) => {
//     const resultList = {};

//     // Handle data content sanitization
//     if (Array.isArray(data.content)) {
//         resultList.content = data.content.map((item) =>
//             sanitizeCustomerData({ data: item, keysTobeSelected })
//         );
//     } else {
//         resultList.content = sanitizeCustomerData({ data: data.content, keysTobeSelected });
//     }

//     // Handle pagination information if required
//     if (includePagination) {
//         const paginationKeys = ['page', 'size', 'totalElements', 'totalPages'];
//         paginationKeys.forEach((key) => {
//             if (data.hasOwnProperty(key)) {
//                 resultList[key] = data[key];
//             }
//         });
//     }

//     // Handle nested data sanitization
//     keysTobeSelected.forEach((element) => {
//         if (element.includes(".")) {
//             const [firstKey, ...rest] = element.split(".");
//             const nestedKey = rest.join(".");

//             if (data[firstKey]) {
//                 resultList[firstKey] = {
//                     ...resultList[firstKey],
//                     ...sanitizeCustomerData({
//                         data: data[firstKey],
//                         keysTobeSelected: [nestedKey],
//                     }),
//                 };
//             }
//         } else if (data.hasOwnProperty(element)) {
//             resultList[element] = data[element];
//         }
//     });

//     return resultList;
// };

// src/components/SanitizeData.js
export const sanitizeCustomerData = (data) => {
  return data.content.map(customer => ({
      customerId: customer.customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      totalBalance: customer.totalBalance.toFixed(2), // Format balance to 2 decimal places
      active: customer.active ? 'Active' : 'Inactive',
      accounts: customer.accounts // Add other fields if needed for display or processing
  }));
};
