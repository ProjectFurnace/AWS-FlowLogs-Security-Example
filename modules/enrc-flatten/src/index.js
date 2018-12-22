const flatten = require('flat')

function handler(event) {

  const fl_event = flatten(event, {delimiter:'_'});
  return fl_event; 
}



module.exports.handler = handler;

