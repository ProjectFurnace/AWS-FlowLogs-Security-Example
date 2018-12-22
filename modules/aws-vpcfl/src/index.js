const zlib = require('zlib');
const path = require('path');
const csvtomap = require('@project-furnace/csvtomap');
const logic = require('./logic');

const vpcflMapping = csvtomap.createKeyValue(path.resolve(__dirname, 'mapping.spec'), ' => ');

function handler(event) {
  return logic.normalize(event, vpcflMapping);
}

function unpackAndProcess(events) {
  const outputEvents = [];
  events.forEach((elem) => {
    if (elem.kinesis && elem.kinesis.data) {
      const gzippedInput = Buffer.from(elem.kinesis.data, 'base64');

      const gunzippedData = zlib.gunzipSync(gzippedInput);

      const event = JSON.parse(gunzippedData.toString('utf8'));

      // we do not want to send control messages
      if (event.messageType !== 'CONTROL_MESSAGE') {
        if (event.logEvents) {
          event.logEvents.forEach((logline) => {
            const flattenedLogline = {
              id: logline.id,
              timestamp: logline.timestamp,
              message: logline.message,
              ...logline.extractedFields,
            };
            outputEvents.push(handler(flattenedLogline));
          });
        }
      }
    }
  });
  return outputEvents;
}

module.exports.handler = handler;
module.exports.unpackAndProcess = unpackAndProcess;
