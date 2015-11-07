var moment = require('moment');
var uuid = require('node-uuid');
var sqlite3 = require('sqlite3').verbose();
var _ = require('lodash');
var db = {}
var db_filename = 'queue.db';
var db_queue_tablename = "queue";

exports.init = function(o){
  db = new sqlite3.Database(db_filename);
  db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS queue (id INTEGER PRIMARY KEY AUTOINCREMENT, status INTEGER NOT NULL, data TEXT, firstInsertTime CHAR(255), insertTime CHAR(255), pullTime CHAR(255), finishTime CHAR(255), timesRun INTEGER NOT NULL, finished INTEGER, ready INTEGER );");
  });
  result = extend;
  result.defaultReadyState = 0;
  return result;
}

var extend = {
  push : function(item, cb){
    var that = this;
    var sql = db.prepare("INSERT INTO `"+db_queue_tablename+"` (`status`,`data`,`insertTime`,`firstInsertTime`, `timesRun`, `finished`, `ready`) VALUES (0,?,?,?,0,0,?);");
    db.serialize(function() {
      var time = moment().format();

      sql.run(JSON.stringify(item), time,time, that.defaultReadyState, function(err, data){
        if(err) return cb(err);
        var lastId = this.lastID;

        sql.finalize(function(){
          //TODO couldn't get params to go through params, +lastId+ fixes.  Fix sometime.
          var sqlSelect = "SELECT * FROM `"+db_queue_tablename+"` WHERE `id` = ? LIMIT 1";
          db.get(sqlSelect, [lastId], function(err, item){
            if(err) return cb(err);
            cb(null, item);
          })
        });
      });
    });
  },
  pull : function(cb){
    var sql = "SELECT * FROM `"+db_queue_tablename+"` WHERE `ready` = 1 ORDER BY insertTime LIMIT 1";
    db.serialize(function(){
      db.get(sql, [], function(err, item){
        if(err) return cb(err);
        cb(null, item)
      });
    })
  },
  setReady : function(item, cb){
    var sql = "UPDATE `"+db_queue_tablename+"` SET `ready` = ? WHERE id = ?;";
    db.run(sql,[1, item.id], function(err, rows){
      if(err) return cb(err);
      cb(null)
    })
  }

}
