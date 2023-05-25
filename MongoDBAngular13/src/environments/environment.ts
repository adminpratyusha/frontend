const originWithoutPort = location.origin.replace(/:\d+$/, '');

export const environment = {
  production: false,
  baseUrl:  originWithoutPort + "/api/employee"
};
// http://backend-service.default.svc.cluster.local:5000/