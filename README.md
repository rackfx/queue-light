![](https://api.travis-ci.org/rackfx/queue-light.svg?branch=master)
# queue-light
Note: Version 1.2 is a complete factor and rewrite, and introduces breaking changes to version < 1.2.  This is mostly due to file changes, we're now using sqlite instead of FS for storage.  An effort was made to keep the syntax the same, however.
### Light weight file based JSON queuing service using Sqlite database.

### Usage:

```shell
npm install queue-light
```

```javascript
// Bring in the module
var ql = require('queue-light');

// Initialize the queue object.
var queue = ql.init(
  {
    filename: './queue.json',
    finishedFilename: './queue.finished.json',
  }
);

// Set your data
var data = {name: 'first'}

// Push your data to the json file.
queue.push(data, function(err,data){
  console.log(data);
  // Mark the item as "ready"
  queue.setReady(item,function(err,item){
    // Pull oldest from the json file
    queue.pull(function(err,item){
      console.log(item);
      // mark the item as finished, this removes it from the json file
      queue.finish(item, function(err, item){
        console.log(item);
      });
    });
  });
});
```

### Data Flow

![](https://github.com/rackfx/queue-light/blob/master/queue-light-flow.png?raw=true)

### API

#### .init(options)

Initialize JSON queue file.

##### Options
- **filename** - (required) The JSON file path for data store. If the file does not exist, it will be created.
- **finishedFilename** - (optional) the JSON file path for finished items. If the file does not exist, it will be created.

#### queue.push(data,cb)

Push new data into the queue, and mark it "in queue" (0).  Returns the entire queue.  CB returns err or item.

#### queue.setReady(item,cb)

Set the item as ready.  CB returns err or item.

#### queue.pull(cb)

Pull the oldest item out of the queue and mark it as "in progress" (1). CB returns err or item.

#### queue.finish(item,cb)

Remove item from queue.  If finishedFilename is set, the item will be added to the finished items JSON file and marked "Completed" (2)
CB returns err or item.

#### queue.return(item,cb)

Return an item back to the queue, marking it "in queue" (0)



### more methods:



setReady(item, cb) - Sets an item as ready, need to make sure that options include defaultReadyState = false
```javascript
  queue.setReady(item, function(err){
    //...
    })
```

update (item, cb) - Update data on an item.  item data will be replaced with `item` contents
```javascript
  queue.update(item, function(err,item){
    //...
  })
```

#### return (cb) - Return all items to the queue
```javascript
  queue.return(function(err){
    //...
  })
```

#### backline (cb) - Return all items to the queue and set insertDate as now.  
```javascript
  queue.backline(function(function(err){
    //...
  }))
```
#### count (cb) - Return the number of items in the queue in an objet
```javascript
  queue.count(function(err,count){
    //..
  })
```
returns an object:
```javascript
[{"queued":1,"inProgress":1,"finished":9,"queuedAndReady":1}]
```

### TODO:
- move json data to data object
- drop()
- findOne()
- findAll()
