const fs = require("fs");
const mysql_import = require("mysql-import");
const Importer = require("mysql-import");
var conf = require("./conf.json");

var mysql = require("mysql");
const dbconf = {
   // Verbindung zu mysql als admin
   host: conf.host, 
   port: conf.port, 
   user: conf.user,
   password: conf.MYSQL_ROOT_PASSWORD, 
   database: "Sqhelper",
};

var files = {};

let uploadProcess = function uploadProcess(socket) {
   socket.on("Start", (data) => {
      if (
         // serverseitig überprüfen, ob richitge Dateigroesse und Format
         data.size > 10485760 ||
         data["fileName"].substring(
            data["fileName"].length,
            data["fileName"].length - 4
         ) != ".sql"
      ) {
        var errormsg =
            "Fehler: " +
            data["fileName"] +
            " größer als 10mb oder keine SQL-Datei";
         console.log(errormsg);
         socket.emit(
            // Fehler senden
            "wrongdata",
            "Bitte wählen Sie eine SQL-Datei aus, die kleiner als 10mb groß ist."
         );
      } else {
         console.log(data.size);
         console.log(data["fileName"]);

         let fileName = data["fileName"];

         files[fileName] = {
            fileSize: data["size"],
            data: "",
            downloaded: 0,
         };

         let startingRange = 0;
         try {
            let stats = fs.statSync(
               "Temp/" + fileName + "_" + socket.temp_user_id + ".sql"
            );
            if (stats.isFile()) {
               files[fileName]["downloaded"] = stats.size;
               startingRange = stats.size / 5000000;
            }
         } catch (er) {} //It's a New File
         fs.open(
            "Temp/" + fileName + "_" + socket.temp_user_id + ".sql",
            "a",
            0755,
            (err, fd) => {
               if (err) {
                  console.log(err);
               } else {
                  files[fileName]["handler"] = fd; //We store the file handler so we can write to it later
                  socket.emit("MoreData", {
                     startingRange: startingRange,
                     percent: 0,
                  });
               }
            }
         );
      }
   });

   socket.on("Upload", (data) => {
      if (
         // serverseitig überprüfen, ob richitge Dateigroesse und Format
         data.size > 10485760 ||
         data["fileName"].substring(
            data["fileName"].length,
            data["fileName"].length - 4
         ) != ".sql"
      ) {
         console.log("error upload")
      } else {
         let fileName = data["fileName"];
         files[fileName]["downloaded"] += data["data"].length;
         files[fileName]["data"] += data["data"];
         if (files[fileName]["downloaded"] == files[fileName]["fileSize"]) {
            //If File is Fully Uploaded
            fs.write(
               files[fileName]["handler"],
               files[fileName]["data"],
               null,
               "Binary",
               (err, Writen) => {
                  let inp = fs.createReadStream(
                     "Temp/" + fileName + "_" + socket.temp_user_id + ".sql"
                  );
                  let out = fs.createWriteStream(
                     "uploaded-Files/" +
                        fileName +
                        "_" +
                        socket.temp_user_id +
                        ".sql"
                  );
                  inp.pipe(out);
                  inp.on("end", () => {
                     fs.unlink(
                        "Temp/" + fileName + "_" + socket.temp_user_id + ".sql",
                        () => {
                           //temporäre Datei löschen
                           files = {};
                           var db = mysql.createConnection(dbconf);
                           db.connect(function (err) {
                              if (err) console.log(err);
                           });
                           console.log("Connection erstellt");

                           db.query(
                              "DROP DATABASE IF EXISTS " +
                                 "SqhelperUserDB_" +
                                 socket.temp_user_id +
                                 "",
                              function (err, result) {
                                 if (err) throw err;
                              }
                           );
                           db.query(
                              // Neue Datenbank erstellen
                              "CREATE DATABASE IF NOT EXISTS " +
                                 "SqhelperUserDB_" +
                                 socket.temp_user_id +
                                 "",
                              function (err, result) {
                                 if (err) throw err;
                                 console.log(
                                    "Datenbank erstellt: " +
                                       "SqhelperUserDB_" +
                                       socket.temp_user_id +
                                       ""
                                 );
                              }
                           );

                           db.query(
                              // User mit Berechtigung auf dieser DB erstellen
                              "CREATE USER IF NOT EXISTS SQhelperUser" +
                                 socket.temp_user_id +
                                 ' IDENTIFIED BY "' +
                                 socket.temp_user_id+conf.secret2 + // userID + serverkey als Datenbankpasswort -
                                 '"'// alle vom Nutzer erstellen SQL Befehle sowie der Import der SQL-Datei werden mit seinem eigenen mysql user ausgeführt um Sicherheit zu gewährleisten
                           ).on("end", function () {
                              db.query("FLUSH PRIVILEGES;").on(
                                 "end",
                                 function () {
                                    console.log(
                                       "mysql user und PRIVILEGES für USERID : " +
                                          socket.temp_user_id +
                                          " erstellt"
                                    );
                                    db.query(
                                       "GRANT SELECT,CREATE,INSERT,ALTER,DROP,REFERENCES ON " + // Nutzer bekommt nur Zugriffsrechte auf seine eigene Datenbank
                                          "SqhelperUserDB_" +
                                          socket.temp_user_id +
                                          ".* TO SQhelperUser" +
                                          socket.temp_user_id +
                                          ""
                                    ).on("end", function () {
                                       const host = conf.host;
                                       const port = conf.port;
                                       const user = "SQhelperUser"+socket.temp_user_id; // importieren der sql Datei mit dem mysql user der Nutzers -> Eingriff auf andere Datenbanken verhindern
                                       const password =  socket.temp_user_id+conf.secret2; // "Serverkey"-String an userid anhängen, um Angriffe zu verhindern
                                       const database =
                                          "SqhelperUserDB_" + socket.temp_user_id;

                                       const importer = new Importer({
                                          host,
                                          port,
                                          user,
                                          password,
                                          database,
                                       });

                                       importer // sql dumb importieren
                                          .import(
                                             "uploaded-Files/" +
                                                fileName +
                                                "_" +
                                                socket.temp_user_id +
                                                ".sql"
                                          )
                                          .then(() => {
                                             var files_imported = importer.getImported();
                                             console.log(
                                                files_imported +
                                                   ": -> SQL file imported."
                                             );
                                             fs.unlinkSync(
                                                "uploaded-Files/" +
                                                   fileName +
                                                   "_" +
                                                   socket.temp_user_id +
                                                   ".sql"
                                             ); // Datei wieder löschen
                                             
                                             socket.emit("Done", {});
                                          })
                                          .catch((err) => {
                                             // Wenn Fehler beim Upload -> diesen an Clienten weitergeben
                                             console.error(err);
                                             socket.emit(
                                                "upload-error",
                                                err.sqlMessage
                                             );
                                             fs.unlinkSync(
                                                "uploaded-Files/" +
                                                   fileName +
                                                   "_" +
                                                   socket.temp_user_id +
                                                   ".sql"
                                             ); // Datei wieder löschen
                                          });
                                    });
                                 }
                              );
                           });
                        }
                     );
                  });
               }
            );
         } else if (files[fileName]["data"].length > 10485760) {
            //If the data Buffer reaches 10MB
            fs.write(
               files[fileName]["handler"],
               files[fileName]["data"],
               null,
               "Binary",
               (err, Writen) => {
                  files[fileName]["data"] = ""; //Reset The Buffer
                  let startingRange = files[fileName]["downloaded"] / 5000000;
                  let percent =
                     (files[fileName]["downloaded"] /
                        files[fileName]["fileSize"]) *
                     100;
                  socket.emit("MoreData", {
                     startingRange: startingRange,
                     percent: percent,
                  });
               }
            );
         } else {
            let startingRange = files[fileName]["downloaded"] / 5000000;
            let percent =
               (files[fileName]["downloaded"] / files[fileName]["fileSize"]) *
               100;
            socket.emit("MoreData", {
               startingRange: startingRange,
               percent: percent,
            });
         }
      }
   });
};

module.exports = uploadProcess;
