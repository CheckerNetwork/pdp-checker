import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { checkRetrieval, retrieveFile } from '../lib/retrieval.js'
import fs from 'fs/promises'
import { createHash } from 'crypto'
import { fileURLToPath } from 'url'
import path from 'path'

describe('checkRetrieval integration and unit tests', () => {
  const sampleCid =
    'baga6ea4seaqkzso6gijktpl22dxarxq25iynurceicxpst35yjrcp72uq3ziwpi'
  const baseUrl = 'yablu.net'

  test('should download PDF file from live URL', async () => {
    const result = await checkRetrieval(baseUrl, sampleCid)
    assert.equal(result, true, 'checkRetrieval should return true on success')
  })

  test('should return file with expected hash', async () => {
    const downloadedData = await retrieveFile(baseUrl, sampleCid)
    assert.ok(
      downloadedData,
      'Downloaded data should not be null or undefined'
    )
    // Check the hash of the testData against the fetched data
    // Get the current file's directory (portable for ES modules)
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const testFilePath = path.join(__dirname, 'testData.pdf')
    const testData = await fs.readFile(testFilePath)

    const expectedHash = createHash('sha256').update(testData).digest('hex')
    const actualHash = createHash('sha256')
      .update(downloadedData)
      .digest('hex')
    assert.equal(
      actualHash,
      expectedHash,
      'Downloaded data hash should match the expected hash'
    )
  })

  test('should return false on fetch failure', async () => {
    const result = await checkRetrieval('invalid.url', 'fakecid')
    assert.equal(result, false, 'checkRetrieval should fail and return false')
  })
})
