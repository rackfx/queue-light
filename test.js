queuelight = require('./queue-light-new.js');
var queue = queuelight.init(
  {
    filename: './data/queue.json',
    finishedFilename: './data/queue.finished.json',
    defaultReadyState: false
  }

);



var data = {name: 'first'}
queue.push(data, function(err,data2){
  console.log(data2);
  queue.setReady(data2, function(err){
    queue.pull(function(err,data){
      console.log('-');
      console.log(data);
    })
  });




  // queue.update(data2,function(err, data22){
  //   queue.setReady(data22,function(err,data3){
  //     queue.pull(function(err,item){
  //       console.log(item);
  //       if(item){
  //         queue.finish(item, function(err, i){
  //
  //         });
  //       }
  //     });
  //   })
  // })


});


// queue.return();
// queue.pull();
// queue.finish();
