import { SERVICE_ADDRESS, VERIFIER_ADDRESS } from './retrieval/lib/config.js'
import { checkRetrieval } from './retrieval/lib/retrieval.js'
import { createVerifierContract } from './retrieval/lib/verifier.js'

const baseUrl = 'yablu.net'
const pieceCid = 'baga6ea4seaqkzso6gijktpl22dxarxq25iynurceicxpst35yjrcp72uq3ziwpi'

(async () => {
  const verifier = createVerifierContract(VERIFIER_ADDRESS)
  const result = await checkRetrieval(baseUrl, pieceCid)
  console.log('CID match:', result)
  await verifier.submitRetrievalResults(SERVICE_ADDRESS, [pieceCid], [result])
})()
