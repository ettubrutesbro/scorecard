
const media = {
    optimal: '(min-width: 1600px)',
    compact: '(min-width: 901px) and (max-width: 1599px)', //max 1599?
    mobile: '(max-width: 900px)'
}

export function getMedia(){
    if(window.matchMedia(media.optimal).matches) return 'optimal'
    else if(window.matchMedia(media.compact).matches) return 'compact'
    else if(window.matchMedia(media.mobile).matches) return 'mobile'
}

export default media