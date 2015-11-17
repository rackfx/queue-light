queuelight = require('./queue-light.js');
var queue = queuelight.init(
  {
    filename: './queue.db',
    //finishedFilename: './data/queue.finished.json',
    defaultReadyState: false
  }

);

queue.dbGet('SELECT * from queue',[], function(err,items){
  console.log(items);
})
// queue.count(function(err, count){
//   console.log(count);
// })

//
// var data = {name: 'first'}
// queue.return(function(err){
//
// })
// queue.push(data, function(err,item){
//   item.data.name = 'david';
//   item.data.collr = 'red';
//   console.log(item);
//   queue.update(item, function(err,data3){
//     console.log(err);
//     queue.setReady(data3, function(err){
//       queue.pull(function(err,data){
//         console.log('-');
//         console.log(item);
//         queue.finish(data, function(err,item){
//           console.log(item);
//         })
//       })
//     });
//   })
//




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


// });


// queue.return();
// queue.pull();
// queue.finish();
