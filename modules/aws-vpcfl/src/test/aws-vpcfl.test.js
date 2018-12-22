// tests for aws-vpcfl
const mod = require('../index');

describe('AWS VPC Flow logs normalizer', () => {
  describe('Normalize when input event has valid data', () => {
    it('Check output is properly mapped', () => {
      expect(mod.handler(
        {
          id: '34348072859118726319131566311690938019163409019174191104',
          timestamp: 1540220856000,
          message: '2 123456789012 eni-1234acde 123.12.12.12 172.31.1.1 39338 8088 6 1 40 1540220856 1540220907 REJECT OK',
          srcaddr: '123.12.12.12',
          dstport: 8088,
          start: 1540220856,
          dstaddr: '172.31.1.1',
          version: '2',
          packets: 1,
          protocol: 6,
          account_id: '12345678',
          interface_id: 'eni-1234acde',
          log_status: 'OK',
          bytes: 40,
          srcport: 39338,
          action: 'REJECT',
          end: 1540220907,
        },
      )).toEqual({
        time: 1540220856000,
        original_event: '2 123456789012 eni-1234acde 123.12.12.12 172.31.1.1 39338 8088 6 1 40 1540220856 1540220907 REJECT OK',
        network: {
          src_ipv4: '123.12.12.12',
          dst_port: 8088,
          dst_ipv4: '172.31.1.1',
          src_port: 39338,
          ip: { proto: 6, bytes: 40, packets: 1 },
          dst_vif: 'eni-1234acde',
        },
        tag: {
          aws: {
            flowlogs: {
              id: '34348072859118726319131566311690938019163409019174191104',
              version: '2',
            },
            time: {
              start: 1540220856,
              end: 1540220907,
            },
          },
          status: 'OK',
        },
        environment: {
          aws: {
            account_id: '12345678',
          },
        },
        msg: 'REJECT',
      });
    });
  });
  describe('Unpack function', () => {
    it('Check output is unpacked and properly mapped', () => {
      expect(mod.unpackAndProcess(
        [{
          kinesis:
          {
            kinesisSchemaVersion: '1.0',
            partitionKey: 'c4cb8f2d2f2675864447d322fc1c3b28',
            sequenceNumber: '49589753893708971761505392521079431830210051185148166146',
            data: 'H4sICETS91sAA2NyYWZ0AF1Ry27CMBD8FctnEuVhIOEW0cChqloJbhVCxjHIaogjewNFiH/vOubZi+XZx+zs7JnupbV8J5enVtIJfSuWxfqjXCyKeUkHVB8baTAcJykbjsZZHsUJhmu9mxvdtZg5tCLY1voYYMwGIC34/AKM5HsskI0Kbu0Br2tM225jhVEtKN3MVA3SWDr5pq7ZQ7rqOcqDbMClzlRVLyqQBBQqB75HEfGQJVk+jqIsiqLBbSNsSMizcHKXQuIwCdOQkf4NhyTJU5aTJCUjEhMWkQfj/csyUkyn5deSfL7jePkLhguQ1UzJukKRZ2qN4FXV2+Xpsayy0GoDTkvqNgfegwe/r7n2XeVg7ICeoDsuhqjl4kc6J2jskNGgha4RjhByIXTXwPqfRf2hVINubrmQPns3wN9ojYOhc7T9SpsTXgABc/biMjfhzpt+DnhF3gbnQVM97cIyermsLn/hgsovUgIAAA==',
            approximateArrivalTimestamp: 1542897278.271,
          },
          eventSource: 'aws:kinesis',
          eventVersion: '1.0',
          eventID: 'shardId-000000000000:1234567890',
          eventName: 'aws:kinesis:record',
          invokeIdentityArn: 'arn:aws:iam::123456789012:role/lambdaRole-123456',
          awsRegion: 'eu-west-1',
          eventSourceARN: 'arn:aws:kinesis:eu-west-1:123456789012:stream/test',
        }],
      )).toEqual(
        [{
          environment:
          {
            aws:
            {
              account_id: '123456789012',
            },
          },
          msg: 'ACCEPT',
          network:
          {
            dst_ipv4: '2.3.4.5',
            dst_port: '23',
            dst_vif: 'eni-12345',
            ip:
            {
              bytes: '40',
              packets: '1',
              proto: '6',
            },
            src_ipv4: '1.2.3.4',
            src_port: '29349',
          },
          original_event: '2 123456789012 eni-12345 1.2.3.4 2.3.4.5 29349 23 6 1 40 1542897008 1542897048 ACCEPT OK',
          tag:
          {
            aws:
            {
              flowlogs:
              {
                id: '1234567890',
                version: '2',
              },
              time:
              {
                end: '1542897048',
                start: '1542897008',
              },
            },
            status: 'OK',
          },
          time: 1542897008000,
        }],
      );
    });
  });
});
