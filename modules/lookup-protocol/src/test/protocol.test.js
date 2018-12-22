// tests for protocol
const mod = require('../index');

process.env.PROTOCOL_FIELD = 'network.ip.proto';

describe('Protocol lookup', () => {
  describe('When there is no previous meta on the event', () => {
    it('Verify output with IP proto nº 6', () => {
      expect(mod.handler(
        { network: { ip: { proto: 6 } } },
      )).toEqual(
        { network: { ip: { proto: 6 }, protocol: { acronym: 'TCP', description: 'Transmission Control' } } },
      );
    });

    it('Verify output with non-existent proto number', () => {
      expect(mod.handler(
        { network: { ip: { proto: 123456 } } },
      )).toEqual(
        { network: { ip: { proto: 123456 } }, meta: { lookup: { protocol: { error: 'Undefined protocol data', field: 'network.ip.proto' } } } },
      );
    });
  });

  describe('When there is previous meta on the event', () => {
    it('Verify output with non-existent proto number', () => {
      expect(mod.handler(
        { network: { ip: { proto: 123456 } }, meta: { lookup: { port: { error: 'Undefined' } } } },
      )).toEqual(
        { network: { ip: { proto: 123456 } }, meta: { lookup: { port: { error: 'Undefined' }, protocol: { error: 'Undefined protocol data', field: 'network.ip.proto' } } } },
      );
    });
  });
});
