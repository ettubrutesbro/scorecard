function firstLower (str){return str.charAt(0).toLowerCase() + str.substr(1)}

function camelLower(str){
	return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

function capitalize(str){
	return str.slice(0,1).toUpperCase() + str.substr(1)
}

export {camelLower, capitalize}
export default firstLower