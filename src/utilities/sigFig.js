import commaNumber from 'comma-number'

export default function sigFig(number){
    if(number>=1000000){
        return (number / 1000000).toPrecision(2) + ' million'
    }
    else if(number>=1000){
        return commaNumber((number / 1000).toPrecision(3) * 1000)
    }
    else return number
    // else console.log('sigFig didnt know what to do with' , number)
}

export function rawSigFig(number){
        if(number>=1000000){
            return (number / 1000000).toPrecision(2) * 1000000
        }
        else if(number>=1000){
            return (number / 1000).toPrecision(3) * 1000
        }
        else return number
}

export function truncateNum(number){
        if(number>=1000000){
            return (number / 1000000).toPrecision(2) + 'm'
        }
        else if(number>=100000){
            return (number / 1000).toPrecision(3) + 'k'
        }
        else if(number>=10000){
            return (number / 1000).toPrecision(2) + 'k'
        }
        else if(number>=1000){
            return (number/1000).toPrecision(1) + 'k'
        }
        else if(number>=100){
            return (number / 100).toPrecision(2) * 100
        }
        else return number
}