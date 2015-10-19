var jsonfile = require('jsonfile');
var util = require('util');
var _ = require('lodash');

/* exports.init options : {
  queueTimeout : how long items can be in the queue before they're considered "stuck",
  filename : string
}
*/

exports.init = function(options){
  var result = extend;
  result.filename = options.filename;
  result.queueTimeout = options.queueTimeout;
  return result;
}


var extend = {
  push: function(data){ // push a new data message into the queue.
    var json_data = JSON.stringify(data);


  },
  pull: function(){ // pull's next data message and marks it in progress

    jsonfile.readFile(this.filename, function(err, obj) {

    })
  },
  finish: function(){ // Removes the data message from the queue

  },
  return: function(){ // Put's a data message back into the queue and mark it "in queue"

  }
}
