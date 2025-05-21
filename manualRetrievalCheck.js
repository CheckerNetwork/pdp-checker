import { checkRetrieval } from './lib/retrieval.js'
const baseUrl = 'yablu.net'
const pieceCid = 'baga6ea4seaqkzso6gijktpl22dxarxq25iynurceicxpst35yjrcp72uq3ziwpi';

(async () => {
  const result = await checkRetrieval(baseUrl, pieceCid)
  console.log('CID match:', result)
})()
