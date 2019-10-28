const getAuthToken = () => {
  const searchTerm = 'idToken';
  const key = Object.keys(localStorage).find(key => key.indexOf(searchTerm) >= 0);
  return localStorage.getItem(key);
};
export default getAuthToken;
