![Furnace AWS Example](https://ignite-the-furnace.surge.sh/assets/diagrams/furnace_illustration_aws.svg)

# AWS VPC FlowLogs Security Example Stack

A sample stack to consume messages from AWS VPC Flow Logs, enrich them with security focused information and store them in both ElasticSearch, and S3 to be consumed by AWS RedShift.

## Sources
- **AWS VPC Flow Logs**

## Sinks
- **ElasticSearch**
- **Amazon RedShift**

## Modules
- **aws-vpcfl**
- **aws-lookup-sg**
- **lookup-geo**
- **lookup-protocol**
- **lookup-port**
- **enrc-flatten**

