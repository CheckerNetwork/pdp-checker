import test, { describe, mock } from 'node:test';
import assert from 'node:assert/strict';
import { getRetrievalTasks, startRetrievalPolling } from './pollRetrievalTasks.js';
import { checkRetrieval } from './retrieval.js';

describe('getRetrievalTasks', () => {
  test('returns hostnames and commps from mock contract', async () => {
    const fakeContract = {
      getRetrievalTasks: async () => ([
        ['host1.example.com', 'host2.example.com'],
        ['cid1', 'cid2']
      ])
    };

    const result = await getRetrievalTasks(fakeContract);

    assert.deepEqual(result, {
      hostnames: ['host1.example.com', 'host2.example.com'],
      commps: ['cid1', 'cid2']
    });
  });

  test('returns empty arrays on length mismatch', async () => {
    const badContract = {
      getRetrievalTasks: async () => ([
        ['host1.example.com'],
        ['cid1', 'cid2']
      ])
    };

    const result = await getRetrievalTasks(badContract);
    assert.deepEqual(result, { hostnames: [], commps: [] });
  });
});

describe('startRetrievalPolling', () => {
  test('calls checkRetrievalFn after getting retrieval tasks', async (t) => {
    const fakeContract = {
      getRetrievalTasks: async () => ([
        ['host1.example.com'],
        ['cid1']
      ])
    };

    const mockCheckRetrieval = t.mock.fn(async () => true);

    await startRetrievalPolling(fakeContract, {
      intervalMs: 10000,
      checkRetrievalFn: mockCheckRetrieval
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    assert.equal(mockCheckRetrieval.mock.calls.length, 1);
    assert.deepEqual(mockCheckRetrieval.mock.calls[0].arguments, ['host1.example.com', 'cid1']);
  });

  test('integration: uses real checkRetrieval for yablu.net', async () => {
    const baseUrl = 'yablu.net';
    const pieceCid = 'baga6ea4seaqkzso6gijktpl22dxarxq25iynurceicxpst35yjrcp72uq3ziwpi';

    const contractStub = {
      getRetrievalTasks: async () => ([[baseUrl], [pieceCid]])
    };

    await startRetrievalPolling(contractStub, {
      intervalMs: 10000,
      checkRetrievalFn: checkRetrieval
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    assert.ok(true, 'Integration test ran without errors');
  });
});
