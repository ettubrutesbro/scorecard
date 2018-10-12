
const media = {
    optimal: '(min-width: 1700px)',
    compact: '(min-width: 1380px) and (max-width: 1699px)', //max 1599?
    mobile: '(max-width: 1379px)'
}

export function getMedia(){
    if(window.matchMedia(media.optimal).matches) return 'optimal'
    else if(window.matchMedia(media.compact).matches) return 'compact'
    else if(window.matchMedia(media.mobile).matches) return 'mobile'
}

export default media