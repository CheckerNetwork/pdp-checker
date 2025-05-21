import { ethers } from 'ethers'
import { rpcUrls, GLIF_TOKEN, WALLET_SEED } from './config.js';

const abi = [
  "function submitRetrievalResults(address service, string[] commps, bool[] retrievable)"
];

/*
* @param {string} address
*/
export const createVerifierContract = (address) => {
  const provider = new ethers.FallbackProvider(rpcUrls.map(rpcUrl => {
    const fetchRequest = new ethers.FetchRequest(rpcUrl)
    fetchRequest.setHeader('Authorization', `Bearer ${GLIF_TOKEN}`)
    return new ethers.JsonRpcProvider(fetchRequest)
  }))

  const signer = ethers.Wallet.fromPhrase(WALLET_SEED, provider)

  return new ethers.Contract(
    address,
    abi,
    signer
  )
}
