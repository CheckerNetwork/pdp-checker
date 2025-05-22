import fetch from 'node-fetch'
import pRetry from 'p-retry'
import debug from 'debug'

/**
 * Fetches the file from the constructed URL with retries.
 * @param {string} baseUrl - The base URL.
 * @param {string} pieceCid - The CID to insert in the path.
 * @returns {Promise<Uint8Array>} - The downloaded content as Uint8Array.
 */
export async function retrieveFile (baseUrl, pieceCid) {
  try {
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
        retries: 3
      }
    )
  } catch (error) {
    debug('retrievalFile:error')('Error retrieving file:', error)
    return new Error(`Failed to retrieve pieceCid ${pieceCid} from ${baseUrl}`, { cause: error.cause })
  }
}
