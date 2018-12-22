'use strict';

const logic = require('./logic');
const csvtomap = require('@project-furnace/csvtomap');

// create a mapping of which cols we want extracted from the CSV and with which names
const mapping = { acronym: 1, description: 2 };

// get a map with protocol number as the index based on the specified csv file
// do it outside the handler so we can reuse it
const lookup = csvtomap.createIndexed(__dirname.concat('/data/protocol-numbers.csv'), mapping, 0);

function handler(event) {
  const protocolField = process.env.PROTOCOL_FIELD || 'network.ip.proto';

  const withLookup = logic.mapProtocol(event, lookup, protocolField);

  return withLookup;
}

module.exports.handler = handler;
