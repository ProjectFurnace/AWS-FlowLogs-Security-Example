const securityGroups=require('./securityGroups');
const memoize=require('promise-memoize')
const aws=require('./util/aws');
const ec2=new aws.EC2({region: process.env.AWS_REGION});


var Eni2SG=function(){
    return ec2.describeNetworkInterfaces().promise()
    .get("NetworkInterfaces")
    .then(function(interfaces){
        var out={}
        interfaces.forEach(x=>out[x.NetworkInterfaceId]=x.Groups.map(y=>y.GroupId))
        return out
    })
}

var cachedEni2SG=memoize(Eni2SG,{ maxAge: 60000 });

module.exports.cachedEni2SG = cachedEni2SG;