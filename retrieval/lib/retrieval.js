import pRetry from 'p-retry'

/**
 * Entry point: checks if the file retrieved from the URL matches the expected CID.
 * @param {string} baseUrl - The base URL (without protocol).
 * @param {string} pieceCid - The expected CID string.
 * @returns {Promise<boolean>} - True if CID matches, false otherwise.
 */
export async function checkRetrieval (baseUrl, pieceCid) {
  try {
    const data = await retrieval(baseUrl, pieceCid)
    // TODO: Verify the CID of the retrieved data
    // return await verifyCid(data, pieceCid);
    return true
  } catch (error) {
    console.error('Failed to verify retrieval:', error)
    return false
  }
}

/**
 * Fetches the file from the constructed URL with retries.
 * @param {string} baseUrl - The base URL.
 * @param {string} pieceCid - The CID to insert in the path.
 * @returns {Promise<Uint8Array>} - The downloaded content as Uint8Array.
 */
export async function retrieval (baseUrl, pieceCid) {
  const url = `https://${baseUrl}/piece/${pieceCid}`

  return await pRetry(
    async () => {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`)
      }

      const buffer = await response.arrayBuffer()
      return new Uint8Array(buffer)
    },
    {
      retries: 3,
      onFailedAttempt: (error) => {
        console.warn(
          `Attempt ${error.attemptNumber} failed. ${error.retriesLeft} retries left.`
        )
      }
    }
  )
}
