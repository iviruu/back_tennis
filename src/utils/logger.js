export const logAuthAction = (action, req, res, data = {}) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('----------------------------------------');
    console.log(`${action} - Request Origin:`, req.headers.origin);
    console.log(`${action} - Cookie options:`, data.cookieOptions || {});
    console.log(`${action} - Response headers:`, res.getHeaders());
    console.log('----------------------------------------');
  }
}; 