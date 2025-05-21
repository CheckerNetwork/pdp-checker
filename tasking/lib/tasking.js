/**
 * Fetches retrieval task data once from the smart contract.
 * @param {object} contract - ethers.js contract instance.
 * @returns {Promise<{hostnames: string[], commps: string[]}>}
 */
export async function getRetrievalTasks(contract) {
  try {
    const [hostnames, commps] = await contract.getRetrievalTasks();

    if (hostnames.length !== commps.length) {
      console.warn('Mismatched hostnames and commps arrays');
      return { hostnames: [], commps: [] };
    }

    return { hostnames, commps };
  } catch (err) {
    console.error('Error fetching tasks:', err);
    return { hostnames: [], commps: [] };
  }
}