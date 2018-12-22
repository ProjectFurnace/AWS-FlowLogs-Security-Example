const eventutils = require('@project-furnace/eventutils');

function normalize(event, vpcflMapping) {
  // get the data from the protocol number specified in protocolField
  const mappedEvent = {};

  // copy the original event directly and remove it to avoid looping through it
  if (event.message) {
    mappedEvent.original_event = event.message;
    // eslint-disable-next-line no-param-reassign
    delete event.message;
  }

  // we need to know if amazon is sending us IPv6 and if so change the mapping
  if (event.srcaddr && event.srcaddr.indexOf(':') > -1) {
    vpcflMapping.set('srcaddr', 'network.src_ipv6');
    vpcflMapping.set('dstaddr', 'network.dst_ipv6');
  }

  eventutils.walkEvent(event, mappedEvent, vpcflMapping);

  return mappedEvent;
}

module.exports.normalize = normalize;