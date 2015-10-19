queuelight = require('./queue-light.js');
var queue = queuelight.init(
  {
    filename: './data/queue.json',
    queueTimeout: 0,
  }
);


var data = {
  fruits: ['apple','orange','pear'],
  users: [
    {
      name: 'admin',
    },
    {
      name: 'bill'
    }
  ]
}
queue.push(data);
queue.pull();
queue.return();
queue.pull();
queue.finish();
