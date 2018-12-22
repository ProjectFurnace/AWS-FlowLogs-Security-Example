const simplejson = require('@project-furnace/simplejsonutils');

function mapProtocol(event, lookup, protocolField) {
  // get the data from the protocol number specified in protocolField
  try {
    let protocolNum = simplejson.getPath(event, protocolField);

    // make sure protocolNum is a number
    if (typeof protocolNum !== 'number') {
      protocolNum = parseInt(protocolNum, 10);
    }

    const protocolData = lookup.get(protocolNum);

    if (protocolData) {
      // eslint-disable-next-line no-param-reassign
      event.network.protocol = protocolData;
    } else {
      simplejson.merge(event, { meta: { lookup: { protocol: { error: 'Undefined protocol data', field: protocolField } } } });
    }
  } catch (e) {
    // do nothing
  }
  return event;
}

module.exports.mapProtocol = mapProtocol;
