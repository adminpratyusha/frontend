const originWithoutPort = location.origin.replace(/:\d+$/, '');
export const environment = {
  production: true,
  baseUrl: originWithoutPort +":32529" +"/api/employee"
};
