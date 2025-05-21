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