const maxmind = require('maxmind');
const path = require('path');
const isPrivate = require('private-ip');
const sju = require('@project-furnace/simplejsonutils');

const cityLookup = maxmind.openSync(path.join(__dirname, 'data/GeoLite2-City.mmdb'));
const countryLookup = maxmind.openSync(path.join(__dirname, 'data/GeoLite2-Country.mmdb'));
const asnLookup = maxmind.openSync(path.join(__dirname, 'data/GeoLite2-ASN.mmdb'));

var geoRaw = function (ip) {

  const city_data = cityLookup.get(ip);
  const country_data = countryLookup.get(ip);
  const ASN_data = asnLookup.get(ip);
  var out = {}

  if (!city_data) return null
  if (city_data.continent) {
    out.continent_code = city_data.continent.code
  }
  if (city_data.country) {
    out.country_code2 = city_data.country.iso_code
    out.country_name = city_data.country.names.en
  }
  if (city_data.location) {
    out.location = {
      lon: city_data.location.longitude,
      lat: city_data.location.latitude
    }
    out.dma_code = city_data.location.metro_code
    out.timezone = city_data.location.time_zone
  }
  if (city_data.subdivisions && city_data.subdivisions.length > 0) {
    out.region_name = city_data.subdivisions[0].iso_code
    out.real_region_name = city_data.subdivisions[0].names.en
  }
  if (city_data.city) {
    out.city_name = city_data.city.names.en
  }
  if (city_data.postal) {
    out.postal_code = city_data.postal.code
  }
  Object.keys(out).forEach((key) => (!out[key]) && delete out[key]);

  return out

}

function handler(event) {

    const src_ip = sju.getPath(event, 'network.src_ipv4');
    const dst_ip = sju.getPath(event, 'event.network.dst_ipv4');

    const enrichment_info = {};

    if (maxmind.validate(src_ip) & !isPrivate(src_ip)) {
      enrichment_info.src_info = geoRaw(src_ip);
      if(enrichment_info.src_info && enrichment_info.src_info.location){
        enrichment_info.src_info.src_geo = `${enrichment_info.src_info.location.lat},${enrichment_info.src_info.location.lon}`;
      }
    }

    if (maxmind.validate(dst_ip) & !isPrivate(dst_ip)) {
      enrichment_info.dst_info = geoRaw(dst_ip);
      if(enrichment_info.dst_info && enrichment_info.dst_info.location){
        enrichment_info.dst_info.dst_geo = `${enrichment_info.dst_info.location.lat},${enrichment_info.dst_info.location.lon}`;
      }
    }

    event.enrichments = {};
    event.enrichments.geo_info = enrichment_info;
    return event;

}

function setup() {

}

module.exports.handler = handler;
module.exports.setup = setup;