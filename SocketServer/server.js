var io = require("socket.io").listen(3000);
var jwt = require("jsonwebtoken");
var conf = require("./conf.json");

var connectCounter = 0;

io.on("connection", function (socket) {
   jwt.verify(
      socket.handshake.query.temp_user_id,
      conf.secret, //server-secret
      (err, decoded) => {
         if (err) {
            console.log("Token konnte nich authentifiziert werden");
            socket.temp_user_id = makeid(10);
         } else {
            socket.temp_user_id = decoded.temp_user_id;
            console.log(decoded.temp_user_id);
         }
      }
   );
   var token = jwt.sign(
      { temp_user_id: socket.temp_user_id},
      conf.secret,
      {
         expiresIn: "7d",
      }
   );
   socket.emit("temp_user_id", token);

   socket.on("disconnect", function () {
      connectCounter--;
      console.log("--user - count: " + connectCounter);
   });
   connectCounter++;
   console.log("++user - count: " + connectCounter);
   // Hier werden die anderen Module importiert
   require("./DBDiagramm")(socket);
   require("./sql_run")(socket);
   require("./socket-upload.js")(socket);

   return io;
});

function makeid(length) {
   var result = "";
   var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   var charactersLength = characters.length;
   for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
