
function formatJSONForScorecard(file, hasRace, indicatorname, years, categories){
  console.log(indicatorname)
  let indicatorLocations = {}
  file.map((blob)=>{ // should be forEach
    // console.log(blob)
    // const newKeys = ['ranks', 'black', 'white', 'asian', 'latinx', 'other', 'totals']

    let sortedBlobKeys = {}

    if(hasRace) {
      sortedBlobKeys = {
        ranks: Object.keys(blob).filter((key)=>{ return key.toLowerCase().includes('rank')}),
        black: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes('aa')}),
        white: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes('white')}),
        asian: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes('asian')}),
        latinx: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes('latino')}),
        other: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes('other')}),
        totals: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes(indicatorname.toLowerCase())})
      }
    }
    else{
      sortedBlobKeys = {
        ranks: Object.keys(blob).filter((key)=>{ return key.toLowerCase().includes('rank')}),
        totals: Object.keys(blob).filter((key)=> {return key.toLowerCase().includes(indicatorname.toLowerCase())})
      }
    }

    // console.log(sortedBlobKeys)

    let newBlob = {}

    Object.keys(sortedBlobKeys).forEach((key)=>{
      newBlob[key] = []
      sortedBlobKeys[key].forEach((specifickey)=>{
        newBlob[key].push(blob[specifickey])
        // console.log(blob.Location ,specifickey, blob[specifickey])
      })
    })
    indicatorLocations[camelLower(blob.Location)] = newBlob
  })

  return {
    indicator: camelLower(indicatorname),
    years: years,
    categories: categories,
    counties: indicatorLocations
  }

}

function IsJsonString(json)
{
    var str = json.toString();
     
    try
    {
        JSON.parse(str);
    }
    catch (e)
    {
        return false;
    }
     
    return true;
}

