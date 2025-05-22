import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { retrieveFile } from '../lib/retrieval.js'
import { createHash } from 'crypto'

describe('checkRetrieval', () => {
  const sampleCid =
    'baga6ea4seaqkzso6gijktpl22dxarxq25iynurceicxpst35yjrcp72uq3ziwpi'
  const baseUrl = 'yablu.net'
  const expectedHash = '61214c558a8470634437a941420a258c43ef1e89364d7347f02789f5a898dcb1'

  test('should return file with expected hash', async () => {
    const downloadedData = await retrieveFile(baseUrl, sampleCid)
    assert.ok(
      downloadedData,
      'Downloaded data should not be null or undefined'
    )

    const actualHash = createHash('sha256')
      .update(downloadedData)
      .digest('hex')
    assert.equal(
      actualHash,
      expectedHash,
      'Downloaded data hash should match the expected hash'
    )
  })
})
