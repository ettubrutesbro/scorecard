/*
    this object has both browsers that we support, as well as the version threshold for proper functioning;
    the numbers can be updated as we polyfill and do workarounds to expand support, as well as
    new keys for browsers (edge being a distinct possibility!) 
    
*/
const browserCompatibility = {
    chrome: '62',
    firefox: '53',
    safari: '11',
}

export default browserCompatibility