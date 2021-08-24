var mysql = require("mysql");
var conf = require("./conf.json");

module.exports = function (socket) {
   socket.on("get-schueler-table", function (sql) {
      if (socket.temp_user_id != null) {
         const Sequelize = require("sequelize");
         const sequelize = new Sequelize(
            "SqhelperUserDB_" + socket.temp_user_id,
            "SQhelperUser" + socket.temp_user_id,
            socket.temp_user_id + conf.secret2,
            {
               host: conf.host,
               port: conf.port,
               dialect: "mysql",
            }
         );
         const sequelizeadmin = new Sequelize(
            "Sqhelper",
            conf.user,
            conf.MYSQL_ROOT_PASSWORD,
            {
               host: conf.host,
               port: conf.port,
               dialect: "mysql",
            }
         );
         sequelize
            .authenticate()
            .then(() => {
               console.log("Connection has been established successfully.");
            })
            .catch((err) => {
               console.error("Unable to connect to the database:", err);
            });
         sequelize
            .query(sql)
            .then(function (result) {
               //SQL-Befehls des User über seinen eigenen Datenbank user auführen
               socket.emit("send-result", result);
               if (conf.saveAllQueries)
               {
                 sequelizeadmin.query("INSERT INTO queries (userid,query,error) VALUES('"+socket.temp_user_id+"', '"+sql+"' ,'query correct')")
               }
            })
            .catch(function (err) {
               // Errorcatching
               socket.emit("send-Error", {
                  Nachricht: err.original.sqlMessage,
                  Nummer: err.original.errno,
               });
               if (conf.saveAllQueries)
               {
                 sequelizeadmin.query("INSERT INTO queries (userid,query,error) VALUES('"+socket.temp_user_id+"', '"+sql+"' ,'"+err.original.sqlMessage+"')")
               }
            });
      }
   });

   socket.on("check-db-detected", function (data) {
      const dbconfUSER = {
         // Verbindung zu mysql als admin auf die dynamische Datenbank-> daher Deklaration in Funktion
         host: conf.host,
         port: conf.port,
         user: conf.user,
         password: conf.MYSQL_ROOT_PASSWORD,
         database: "SqhelperUserDB_" + socket.temp_user_id, //momentan durch den Client ausgewählte Datenbank
      };
      var db = mysql.createConnection(dbconfUSER);
      db.connect(function (err) {
         if (!err) {
            socket.emit("db-detected", true);
         } else {
            socket.emit("db-detected", false);
         }
      });
   });
};
