queuelight = require('./queue-light.js');
var queue = queuelight.init(
  {
    filename: './data/queue.json',
    finishedFilename: './data/queue.finished.json',
    defaultReadyState: false
  }
);



var data = {name: 'first'}
queue.push(data, function(err,data2){
  queue.setReady(data2,function(err,data3){
    queue.pull(function(err,item){
      console.log(item);
      if(item){
        queue.finish(item, function(err, i){

        });
      }
    });
  })

});


// queue.return();
// queue.pull();
// queue.finish();
