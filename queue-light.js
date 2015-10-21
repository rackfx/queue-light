var jsonfile = require('jsonfile');
var util = require('util');
var _ = require('lodash');
var moment = require('moment');
var uuid = require('node-uuid');
var fs = require('fs');
var fileExists = require('file-exists');


/* exports.init options : {
  queueTimeout : how long items can be in the queue before they're considered "stuck",
  filename : string
}
*/

exports.init = function(options){
  var result = extend;
  result.filename = options.filename;
  if(options.finishedFilename) {
    result.finishedFilename = options.finishedFilename;
    createNotExist(options.finishedFilename, '[]');
  }
  createNotExist(options.filename, '[]')

  result.queueTimeout = options.queueTimeout;

  return result;
}


var extend = {
  push: function(data, cb){ // push a new data message into the queue.
    var o = {}
    var filename = this.filename;
    // set defaults before insert
    o.insertTime = moment().format();
    o.id = uuid.v1();
    o.status = 0; // 0 = queued, 1 = in progress, 2 = completed
    o.data = data;
    jsonfile.readFile(filename, function(err, obj) {
      obj.push(o);
      jsonfile.writeFile(filename,obj,function(err){
        if(err){
          cb(err);
        }
        else {
          cb(null, obj);
        }
      })
    })

  },
  pull: function(cb){ // pull's next data message and marks it in progress
    var filename = this.filename;
    jsonfile.readFile(filename, function(err, obj) {
      if(obj.length===0){
        cb(null, null);
      }
      else{
        var items = _.filter(obj, {'status':0});
        var sorted = _.sortBy(items, 'insertTime');

        sorted[0].status = 1;
        sorted[0].pullTime = moment().format();

        jsonfile.writeFile(filename, sorted,function(err){
            if(err){
              cb(err);
            }
            else {
              cb(null, sorted[0]);
            }
        });
      }

    })
  },
  finish: function(item,cb){ // Removes the data message from the queue
    var id=item.id;
    var filename = this.filename;
    var finishedFilename = "";
    if (this.finishedFilename){
      finishedFilename = this.finishedFilename;
    }
    jsonfile.readFile(filename, function(err, obj) {
      if(err){
        cb(err)
      }
      else {
        var item = _.remove(obj, { 'id':id });
        item[0].finishedTime = moment().format();
        item[0].status = 2;
        jsonfile.writeFile(filename, obj, function(err){
          if(err){
            cb(err);
          }
          else {
            if(finishedFilename){
              jsonfile.readFile(finishedFilename, function(err,finishedItems){
                if(err){
                  cb(err)
                }
                else {


                  finishedItems.push(item[0]);

                  jsonfile.writeFile(finishedFilename, finishedItems, function(err,m){
                    if(err){
                      cb(err);
                    }
                    else {
                      cb(null, item);
                    }
                  }) // end json writefile
                }
              }) // end json readfile
            } // end if finishedFilename
            else{
                cb(null, item);
            }

          }
        })
      }

    });
  },
  return: function(item,cb){ // Put's a data message back into the queue and mark it "in queue"
    var filename = this.filename;
    jsonfile.readFile(filename, function(err, obj) {
      if(err){
        cb(err);
      }
      else {
        var index = _.findIndex(obj, {'id':item.id});
        obj[index].status = 0;
        jsonfile.writeFile(filename, obj,function(err){
            if(err){
              cb(err);
            }
            else {
              cb(null, obj);
            }
        });
      }

    })
  },


}

function createNotExist(filename, data){
  if(!fileExists(filename)){
    fs.writeFileSync(filename, data);
  }
}
