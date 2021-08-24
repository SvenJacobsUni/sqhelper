(function(window) {
  window["env"] = window["env"] || {};

  // Environment variables
  window["env"]["apiUrl"] = "http://localhost:3000"; // wird ersetzt durch env in docker compose
  window["env"]["debug"] = true;
})(this);
//https://pumpingco.de/blog/environment-variables-angular-docker/
