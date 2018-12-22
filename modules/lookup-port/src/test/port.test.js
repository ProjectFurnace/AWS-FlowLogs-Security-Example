// tests for port
const mod = require('../index');

describe('Port lookup', () => {
  process.env.PORT_LOOKUP_FIELD = 'network.src_port';

  describe('When there is no previous meta on the event', () => {
    it('Verify output with TCP port 22', () => {
      // the env variable needs to be set here or it just all breaks!
      process.env.PORT_LOOKUP_FIELD = 'network.src_port';
      expect(mod.handler(
        { network: { ip: { proto: 6 }, src_port: 22 } },
      )).toEqual(
        { network: { ip: { proto: 6 }, src_port: 22, src_port_data: { acronym: 'ssh', description: 'The Secure Shell (SSH) Protocol' } } },
      );
    });

    it('Verify output with UDP port 20', () => {
      expect(mod.handler(
        { network: { ip: { proto: 17 }, src_port: 20 } },
      )).toEqual(
        { network: { ip: { proto: 17 }, src_port: 20, src_port_data: { acronym: 'ftp-data', description: 'File Transfer [Default Data]' } } },
      );
    });

    it('Verify output with non-existent port number', () => {
      expect(mod.handler(
        { network: { ip: { proto: 17 }, src_port: 123456 } },
      )).toEqual(
        { network: { ip: { proto: 17 }, src_port: 123456 }, meta: { lookup: { port: { error: 'Undefined port data', field: 'network.src_port' } } } },
      );
    });

    it('When we have no protocol number just return the same event with a meta error', () => {
      expect(mod.handler(
        { network: { src_port: 123456 } },
      )).toEqual(
        { network: { src_port: 123456 }, meta: { lookup: { port: { error: 'No network.ip.proto field' } } } },
      );
    });
  });

  describe('When there is previous meta on the event', () => {
    it('Verify output with non-existent port number', () => {
      expect(mod.handler(
        { network: { ip: { proto: 17 }, src_port: 123456 }, meta: { lookup: { protocol: { error: 'Undefined' } } } },
      )).toEqual(
        { network: { ip: { proto: 17 }, src_port: 123456 }, meta: { lookup: { port: { error: 'Undefined port data', field: 'network.src_port' }, protocol: { error: 'Undefined' } } } },
      );
    });
  });
});
