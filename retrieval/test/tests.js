import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { checkRetrieval } from '../lib/retrieval.js'
import fs from 'fs/promises'
import { createHash } from 'crypto'

const { Response } = await import('node-fetch')

describe('checkRetrieval integration and unit tests', () => {
  test('should download and save actual PDF from live URL', async () => {
    const sampleCid = 'baga6ea4seaqkzso6gijktpl22dxarxq25iynurceicxpst35yjrcp72uq3ziwpi'
    const baseUrl = 'yablu.net'
    const result = await checkRetrieval(baseUrl, sampleCid)
    assert.equal(result, true, 'checkRetrieval should return true on success')
  })

  test('should return file with expected hash', async () => {
    const sampleCid = 'baga6ea4seaqkzso6gijktpl22dxarxq25iynurceicxpst35yjrcp72uq3ziwpi'
    const baseUrl = 'yablu.net'
    const downloadedData = await retrieval(baseUrl, sampleCid)
    // Check the hash of the testData against the fetched data
    const testData = await fs.readFile('./testData.pdf')
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

  test('should return false on fetch failure', async (t) => {
    const result = await checkRetrieval('invalid.url', 'fakecid')
    assert.equal(result, false, 'checkRetrieval should fail and return false')
  })
})
