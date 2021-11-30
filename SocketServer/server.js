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
            socket.save_user_id = socket.temp_user_id
         } else {
            socket.temp_user_id = decoded.temp_user_id;
            socket.save_user_id = decoded.temp_user_id;
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
   socket.on("setToFJM", function (data) {
      if(data=='Arztpraxis')
      {
      socket.temp_user_id = "x7q887EP6C";
      socket.emit("setToFJM_success", "");
      }
      if(data=='Mitarbeiter')
      {
      socket.temp_user_id = "2OaYbr5LQJ";
      socket.emit("setToFJM_success", "");
      }
      if(data=='Buecher')
      {
      socket.temp_user_id = "0XSwU00Yx9";
      socket.emit("setToFJM_success", "");
      }
      if(data=='Fussball')
      {
      socket.temp_user_id = "3LvE1Q0Z1b";
      socket.emit("setToFJM_success", "");
      }
   });
   socket.on("setToOLD", function () {
      socket.temp_user_id = socket.save_user_id;
      socket.emit("setToFJM_success", "");
   }
   );

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
