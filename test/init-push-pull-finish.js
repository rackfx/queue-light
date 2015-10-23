var assert=require('assert');
var ql = require('../queue-light');
var testQueueFile = './test/testqueue.json';
var testQueueFinishFile = './test/testqueue.finished.json';
var jsonfile = require('jsonfile');
var fs = require('fs');

var queue = ql.init(
  {
    filename: testQueueFile,
    finishedFilename: testQueueFinishFile,
  }
);


describe('queue init',function(){
  it('should create empty queue files.', function(done){
    jsonfile.readFile(testQueueFile, function(err, obj) {
        assert.deepEqual(obj, []);
        jsonfile.readFile(testQueueFinishFile, function(err,obj){
          assert.deepEqual(obj, []);
          done();
          describe('quite push', function(){
            it('should complete a data push and store data in queue file',function(done){
              var insertData = { name: "drj", address: '123 main street', tags: ['red','green','blue']}
              queue.push(insertData, function(){
                jsonfile.readFile(testQueueFile, function(err, obj) {
                  assert.deepEqual(insertData, obj[0].data);
                  done();
                  describe('queue pull',function(){
                    it('should pull the item out of the queue and mark the queue item as "in proress"', function(done){
                      queue.pull(function(err,item){
                        if(err){
                          throw err;
                        }
                        else {
                          // check the item
                          // check the queue to make sure it's 'in progress'
                          jsonfile.readFile(testQueueFile, function(err, obj) {
                            assert.equal(obj[0].status, 1);
                            assert.deepEqual(insertData, item.data);
                            done();
                            describe('finish queue',function(){
                              it('queue file should be empty array and queue.finish file should contain the object',function(done){
                                queue.finish(item,function(err,item){
                                  jsonfile.readFile(testQueueFile, function(err, obj) {
                                    assert.deepEqual([], obj);
                                    jsonfile.readFile(testQueueFinishFile, function(err, obj) {
                                      assert.deepEqual(insertData, obj[0].data)
                                      fs.unlink(testQueueFile);
                                      fs.unlink(testQueueFinishFile);
                                      done();
                                    });
                                  });
                                });
                              });
                            });
                          });
                        } // end if
                      });
                    });
                  });
                });
              });
            });
          });
        });
    });
  });
});
