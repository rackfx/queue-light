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
            item.data=JSON.parse(item.data);
            cb(null, item);
          })
        });
      });
    });
  },
  pull : function(cb){
    var sql = "SELECT * FROM `"+db_queue_tablename+"` WHERE `ready` = 1 AND `status` = 0 ORDER BY insertTime LIMIT 1";
    db.serialize(function(){
      db.get(sql, [], function(err, item){
        if(err) return cb(err);
        item.timesRun++;
        item.pullTime = moment().format();
        var sqlUpdate = "UPDATE `"+db_queue_tablename+"` SET `status` = 1, `timesRun` = ?, `pullTime` = ? WHERE `id` = ?";
        db.run(sqlUpdate, [item.timesRun, item.pullTime, item.id], function(err){
          console.log(err);
          if(err) return cb(err);
          item.data=JSON.parse(item.data);
          cb(null, item)
        })
      });
    })
  },
  setReady : function(item, cb){
    var sql = "UPDATE `"+db_queue_tablename+"` SET `ready` = 1 WHERE id = ?;";
    db.run(sql,[item.id], function(err, rows){
      if(err) return cb(err);
      cb(null)
    })
  },
  update: function(item, cb){
    var sql = "UPDATE `"+db_queue_tablename+"` SET `data` = ? WHERE id = ?";
    db.run(sql, [JSON.stringify(item.data), item.id], function(err){
      console.log(err, item);
      if(err) return cb(err);
      cb(null, item);
    })
  },
  finish: function(item, cb){
    item.finishTime = moment().format();
    item.status = 2;
    var sql = "UPDATE `"+db_queue_tablename+"` SET `status` = 2, finishTime = ? WHERE `id` = ?";
    db.run(sql,[item.finishTime, item.id], function(err){
      if(err) return cb(err);
      cb(null, item);
    })
  },
  return: function(cb){
    var sql = "UPDATE `"+db_queue_tablename+"` SET `status` = 0 WHERE `status` = 1;";
    db.run(sql, [], function(err){
      if (err) return cb(err);
      cb(null)
    })
  },
  backline: function(cb){
    var sql = "UPDATE `"+db_queue_tablename+"` SET `status` = 0, `insertTime` = ? WHERE `status` = 1;";
    db.run(sql, [moment().format()], function(err){
      if (err) return cb(err);
      cb(null)
    })
  },
  count: function(cb){
    var counter = {}
    var sql = "SELECT COUNT(*) FROM `"+db_queue_tablename+"` WHERE `status` = ?;";
    db.get(sql, [0], function(err, count){
      if(err)cb(err)
      counter.queued = count['COUNT(*)'];
      db.get(sql, [1], function(err, count){
        if(err)cb(err)
        counter.inProgress = count['COUNT(*)'];
        db.get(sql, [2], function(err, count){
          if(err)cb(err)
          counter.finished= count['COUNT(*)'];
          cb(counter);
          console.log(counter);
        })
      });
    })
  }

}
