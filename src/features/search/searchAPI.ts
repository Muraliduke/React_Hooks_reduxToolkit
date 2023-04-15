export interface IFilter {
  numericFilters: any[];
 tagFilters: any[]
}

const request = (page: Number, perPage: Number, search: string, fil:IFilter) => {
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "query": search,
  "analyticsTags": [
    "web"
  ],
  "page": page,
  "hitsPerPage": perPage,
  "minWordSizefor1Typo": 4,
  "minWordSizefor2Typos": 8,
  "advancedSyntax": true,
  "ignorePlurals": false,
  "clickAnalytics": true,
  "minProximity": 7,
  "numericFilters": fil.numericFilters,
  "tagFilters": fil.tagFilters,
  "typoTolerance": true,
  "queryType": "prefixNone",
  "restrictSearchableAttributes": [
    "title",
    "comment_text",
    "url",
    "story_text",
    "author"
  ],
  "getRankingInfo": true
});

var requestOptions: any = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

return requestOptions;
}

export function fetchNews(page: Number, perPage:Number, search:string, fil:IFilter) {
  return fetch("https://uj5wyc0l7x-3.algolianet.com/1/indexes/Item_production/query?x-algolia-agent=Algolia%20for%20JavaScript%20(4.0.2)%3B%20Browser%20(lite)&x-algolia-api-key=8ece23f8eb07cd25d40262a1764599b1&x-algolia-application-id=UJ5WYC0L7X", request(page,perPage,search,fil))
  .then(response => response.text())
}
