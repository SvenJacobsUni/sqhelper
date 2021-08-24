export const environment = {
  production: true,
  apiUrl: window["env"]["apiUrl"] || "default",
  debug: window["env"]["debug"] || false
};
//https://pumpingco.de/blog/environment-variables-angular-docker/
