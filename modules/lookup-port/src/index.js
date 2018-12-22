'use strict';

const logic = require('./logic');
const csvtomap = require('@project-furnace/csvtomap');

// create a mapping of which cols we want extracted from the CSV and with which names
const mapping = { acronym: 1, description: 2 };

// get a map with protocol number as the index based on the specified csv file
// do it outside the handler so we can reuse it
const lookup = {};
lookup.tcp = csvtomap.createIndexed(__dirname.concat('/data/tcp-port-numbers.csv'), mapping, 0);
lookup.udp = csvtomap.createIndexed(__dirname.concat('/data/udp-port-numbers.csv'), mapping, 0);

function handler(event) {
  const portField = process.env.PORT_FIELD || 'network.src_port';
  const ouptutPortField = process.env.OUTPUT_PORT_FIELD || portField.split('.').pop().concat('_data');

  const withLookup = logic.mapPort(event, lookup, portField, ouptutPortField);

  return withLookup;
}

module.exports.handler = handler;
