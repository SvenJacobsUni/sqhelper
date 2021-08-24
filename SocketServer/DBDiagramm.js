var mysql = require('mysql')
var conf = require("./conf.json");
// Hier die Datenbankverbindung rein

module.exports = function(socket) {
 

/// Alle wichtigen Metadaten der Datenbank holen, um Tabelle als Diagramm anzeigen zu können.
socket.on('get-erm-json', function(nix){ 
  const dbconfADMIN = {     // Verbindung zu mysql als admin auf die dynamische Datenbank-> daher Deklaration in Funktion
    host: conf.host, 
    port: conf.port, 
    user: conf.user,
    password: conf.MYSQL_ROOT_PASSWORD, 
    database: "SqhelperUserDB_"+socket.temp_user_id //momentan durch den Client ausgewählte Datenbank
  }
  if (socket.temp_user_id==null) {socket.emit('alertuser', "Bitte logge dich erneut ein (siehe terminal log)"); console.log("Socket Verbindung nach Serverneustart nicht richting initialisiert -> auf Seite ausloggen -> Server starten -> wieder einloggen ")}
  else {
    var db = mysql.createConnection(dbconfADMIN)
    db.connect(function(err){
      if (err) {console.log(err)
      if (err.errno == 1049) { socket.emit('no-db-error', err);}
      }
    })
    var items = [];
    var keys = [];
// Alle Tabellen, Attribute, Typen sowie Primary Key holen
  db.query('SELECT TABLE_NAME,COLUMN_KEY, COLUMN_NAME, DATA_TYPE, COLUMN_TYPE, ORDINAL_POSITION FROM information_schema.columns WHERE table_schema ="'+"SqhelperUserDB_"+socket.temp_user_id+'"')
  .on('result', function(data){
  var item = {
    table_name: data.TABLE_NAME,
    column_name: data.COLUMN_NAME,   
    column_type: data.COLUMN_TYPE,
    column_key: data.COLUMN_KEY
  };
  items.push(item)
  }
  )
  .on('end', function(){
  
// Fremschlüssel holen, sowie das, worauf es referenziert
    db.query('select table_name, column_name, referenced_table_name, referenced_column_name from information_schema.key_column_usage where referenced_table_name is not null and table_schema  ="'+"SqhelperUserDB_"+socket.temp_user_id+'"')
    .on('result', function(data){
    var item2 = {
      table_name: data.TABLE_NAME,
      column_name: data.COLUMN_NAME,   
      referenced_column_name: data.REFERENCED_COLUMN_NAME,
      referenced_table_name: data.REFERENCED_TABLE_NAME
    };
    keys.push(item2)
    }
    )
    .on('end', function(){
    socket.emit('send-erm-json', {items,keys}); // alles an Client schicken
    })
    db.end()  // db wieder schliessen
})
}
})

}