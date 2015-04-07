/**
 * Created by skaczorowski on 10.03.15.
 */
var NAME_EL = '.member-name';
var LOCAL_EL = '.location-industry .location';
var IMG_EL = 'img.member-image';


function extractProfileId(link) {
  return link.match(/(\d+)/g)[0];
}