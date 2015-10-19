queuelight = require('./queue-light.js');
var queue = queuelight.init(
  {
    filename: './data/queue.json',
  //  finishedFilename: './data/queue.finished.json',
    queueTimeout: 0,
  }
);


var data = {name: 'first'}
queue.push(data, function(err,data){
    queue.pull(function(err,item){
      queue.finish(item, function(err, i){

      });
    });
});

// queue.return();
// queue.pull();
// queue.finish();
