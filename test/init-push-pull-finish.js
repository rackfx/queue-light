var assert=require('assert');
var ql = require('../queue-light');
var testQueueFile = './test/testqueue.db';
//var testQueueFinishFile = './test/testqueue.finished.json';

var fs = require('fs');
var colors = require('colors')

var queue = ql.init(
  {
    filename: testQueueFile,

  }
);



describe('quite push', function() {
    it('should should add data to the queue', function(done) {
        var insertData = {
            name: "drj",
            address: '123 main street',
            tags: ['red', 'green', 'blue']
        }

        queue.push(insertData, function(err,item) {

          queue.setReady(item,function(err,item){
            queue.pull(function(err, item) {
              console.log(item,err);
                if (err) {
                    throw err;
                } else {
                    assert.deepEqual(insertData, item.data);
                    done();
                }
            });
          })


        });
    });
});



cleanUpOnExit = function(){
  console.log('removing temp queue files'.blue);
  fs.unlink(testQueueFile);

}
process.on('exit', cleanUpOnExit);
process.on('SIGINT', cleanUpOnExit);
process.on('uncaughtException', cleanUpOnExit);
