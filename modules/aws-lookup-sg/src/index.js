const securityGroups = require('./securityGroups')
const sju = require('@project-furnace/simplejsonutils');


async function handler(event) {
    const sg = await securityGroups.cachedEni2SG();
    if(process.env.DEBUG){
        console.log(sg);
    }
    const enrichment_info = {};
    
    const src_vif = sju.getPath(event, 'network.src_vif');
    const dst_vif = sju.getPath(event, 'network.dst_vif');
    if (src_vif){ 
        enrichment_info.src_sgs = sg[src_vif];
    } 
    if(dst_vif){
        enrichment_info.dst_vif = sg[dst_vif];
    }
    const enrichments = {};
    enrichments.security_group_info = enrichment_info;
    
    sju.merge(event, enrichments);
    
    if(process.env.DEBUG){
        console.log(event);
    }
    return event;
}

module.exports.handler = handler;
