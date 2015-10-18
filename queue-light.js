


/* exports.init options : {

}
*/

exports.init = function(options){
  return queueMethods;
}


var queueMethods = {
  push: function(data){ // push a new data message into the queue.

  },
  pull: function(){ // pull's next data message and marks it in progress


  },
  finish: function(){ // Removes the data message from the queue

  },
  putBack: function(){

  }
}
