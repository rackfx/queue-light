//
// var assert=require('assert');
// var ql = require('../queue-light');
// var testQueueFile = './test/testqueue.json';
// var jsonfile = require('jsonfile');
// var fs = require('fs');
//
// var queue = ql.init(
//   {
//     filename: './data/  queue.json',
//     defaultReadyState: false,
//   }
// );
//
// var testData = {name: 'bob', age: 50, tags: ['red','green','blue']}
// var testDataUpdate = {name: 'david', age: 50, tags: ['red','green','blue']}
// queue.push(testData, function(err,data2){
//
//   queue.pull(function(err, item){
//     describe('readyStateFalse pull', function(){
//       it('item should be empty',function(done){
//         assert.equal(item, null);
//         done();
//
//         // data2.data.name = "david";
//         // queue.update(data2,function(err, data22){
//         //   // q file should = testDataUpdate
//         //   queue.setReady(data22,function(err,data3){
//         //     queue.pull(function(err,item){
//         //       // item should be testDataUpdate
//         //       console.log(item);
//         //       if(item){
//         //         queue.finish(item, function(err, i){
//         //           // q should be empty.
//         //         });
//         //       }
//         //     });
//         //   })
//         // })
//       })
//
//     })
//     // item should be empty
//   })
// });
