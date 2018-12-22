timestamp => time
srcport => network.src_port
srcaddr => network.src_ipv4
dstport => network.dst_port
dstaddr => network.dst_ipv4
protocol => network.ip.proto
interface_id => network.dst_vif
bytes => network.ip.bytes
log_status => tag.status
action => msg
packets => network.ip.packets
# worth reviewing those
id => tag.aws.flowlogs.id
start => tag.aws.time.start
end => tag.aws.time.end
version => tag.aws.flowlogs.version
account_id => environment.aws.account_id