const { Sort, ToAttributedProperty } = require("./util.js");

var headers = `?game ?platform ?developer ?creator ?publisher ?genre ?game_mode ?distribution ?official_website ?publication_date ?part_of_the_series ?distributor ?software_engine ?esrb_rating ?pegi_rating ?review_score ?title ?country_of_origin ?narrative_location ?characters`;

var separatorSymbol = "_";
var bindingPrefix = "?";
var labelAppendix = "Label";
var idAppendix = "Id";
var disallowedNames = /[^a-zA-Z_]/;

var result = headers
    .trim()
    .split(bindingPrefix)
    .slice(1)
    .map(s=>s.trim())
    .sort(Sort)
    .validate(function InvalidParameterCountRule(arr){return arr.length<1})
    .validateEach(function DisallowedParameterNameRule(s){return disallowedNames.test(s)}) //validation check
    .map(s=>({bindName:s,name:s.split(separatorSymbol).map(s=>s[0].toUpperCase()+s.slice(1)).join("")}))//replace "_" char with nothing and make next character upper cased. saved initial names aside with new values
    .mut(arr=>[
        arr.map(s=>[s.bindName+labelAppendix, s.name]).map(ToAttributedProperty).flat(),
        arr.map(s=>[s.bindName, s.name+idAppendix]).map(ToAttributedProperty).flat()
    ])
    .validate(function InvalidPropertyCountRule(arr){return ((arr[0].length !== arr[1].length)||arr[0].length%2!==0)}) //validation check
    .flat()
    .join("\n")
    ;

console.log(result.length);
console.log(result);
