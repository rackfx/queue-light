# queue-light
Lighweight file based JSON queuing service.

### Usage:

```bash npm install queue-light ```

```javascript
// Bring in the module
var queuelight = require('queue-light');

// Initialize the queue object.
var queue = queuelight.init(
  {
    filename: './data/queue.json',
    finishedFilename: './data/queue.finished.json',
    queueTimeout: 0,
  }
);

// Set your data
var data = {name: 'first'}

// Push your data to the json file.
queue.push(data, function(err,data){
  console.log(data);
});

// Pull oldest from the json file
queue.pull(function(err,item){
  console.log(item);
});

// mark the item as finished, this removes it from the json file
queue.finish(item, function(err, item){
  console.log(item);
});


```
### NOTICE

Currently, this module does not create the used data files.  Please create the data files you plan on using and simply put "[]" in for the contents.  TODO: Auto-create files.

### Data Flow

![](https://github.com/rackfx/queue-light/blob/master/queue-light-flow.png?raw=true)

### API

#### .init(options)

Initialize JSON queue file.

##### Options
- **filename** - (required) The JSON file path for data store
- **finishedFilename** - (optional) the JSON file path for finished items

#### queue.push(data,cb)

Push new data into the queue, and mark it "in queue" (0).  Returns the entire queue.

#### queue.pull(cb)

Pull the oldest item out of the queue and mark it as "in progress" (1)

#### queue.finish(item,cb)

Remove item from queue.  If finishedFilename is set, the item will be added to the finished items JSON file and marked "Completed" (2)

#### queue.return(item,cb)

Return an item back to the queue, marking it "in queue" (0)
