import { checkRetrieval } from '../../retrieval/retrieval.js';
import { getRetrievalTasks } from '../lib/tasking.js';


/**
 * Starts polling the contract and checking retrievability.
 * @param {object} contract - ethers.js contract instance.
 * @param {object} [options] - Config options.
 * @param {number} [options.intervalMs=60000] - Poll interval.
 * @param {function} [options.checkRetrievalFn] - Optional override for checkRetrieval().
 */
export async function startRetrievalPolling(contract, options = {}) {
    const {
      intervalMs = 60000,
      checkRetrievalFn = checkRetrieval
    } = options;
  
    const poll = async () => {
      const { hostnames, commps } = await getRetrievalTasks(contract);
  
      for (let i = 0; i < hostnames.length; i++) {
        const hostname = hostnames[i];
        const cid = commps[i];
        try {
          const result = await checkRetrievalFn(hostname, cid);
          console.log(`Checked ${hostname}/${cid}: ${result}`);
        } catch (err) {
          console.error(`Error checking ${hostname}/${cid}:`, err);
        }
      }
    };
  
    await poll();
    setInterval(poll, intervalMs);
  }
  