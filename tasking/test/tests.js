import test, { describe, mock } from 'node:test';
import assert from 'node:assert/strict';
import { checkRetrieval } from '../../retrieval/lib/retrieval.js';
import { getRetrievalTasks } from '../lib/tasking.js';

describe('getRetrievalTasks', () => {
  test('skips retrieval check if array lengths mismatch', async (t) => {
    const badContract = {
      getRetrievalTasks: async () => ([
        ['host1.example.com'],
        ['cid1', 'cid2']
      ])
    };

    const mockCheckRetrieval = t.mock.fn(async () => true);

    await getRetrievalTasks(badContract, {
      checkRetrievalFn: mockCheckRetrieval
    });

    assert.equal(mockCheckRetrieval.mock.calls.length, 0, 'Should not call checkRetrieval on mismatch');
  });

  test('integration test with real checkRetrieval against yablu.net', async () => {
    const baseUrl = 'yablu.net';
    const pieceCid = 'baga6ea4seaqkzso6gijktpl22dxarxq25iynurceicxpst35yjrcp72uq3ziwpi';

    const contractStub = {
      getRetrievalTasks: async () => ([
        [baseUrl],
        [pieceCid]
      ])
    };

    assert.ok(await getRetrievalTasks(contractStub, {
      checkRetrievalFn: checkRetrieval
    }));
  });
});
