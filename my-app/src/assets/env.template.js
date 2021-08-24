(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["apiUrl"] = "${API_URL}";// wird ersetzt durch env in docker compose
  window["env"]["debug"] = "${DEBUG}";
})(this);
//https://pumpingco.de/blog/environment-variables-angular-docker/
