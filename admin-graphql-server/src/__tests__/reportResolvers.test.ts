/**
 * src/__tests__/reportResolvers.test.ts
 *
 * Unit tests for the GraphQL `reports` resolver.
 * We mock `AppDataSource` from '../db' and override
 * its `isInitialized` getter via `Object.defineProperty`.
 */

import { resolvers } from '../graphql/resolvers';
import { AppDataSource } from '../db';

jest.mock('../db', () => {
  // create a fake DS object
  const ds: any = {
    initialize: jest.fn(),
    query: jest.fn(),
  };

  Object.defineProperty(ds, 'isInitialized', {
    get: () => false,
    configurable: true,
  });

  return { AppDataSource: ds };
});

// now grab our mocked instance
const mockedDS = (AppDataSource as unknown) as {
  initialize: jest.Mock<Promise<any>, any[]>;
  query: jest.Mock<Promise<any>, any[]>;
};

describe('reports resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // default to "not initialized"
    Object.defineProperty(mockedDS, 'isInitialized', {
      get: () => false,
      configurable: true,
    });
  });

  it('1) initializes the data source when not already initialized', async () => {
    // have initialize() resolve with the DS itself (satisfies DataSource return type)
    mockedDS.initialize.mockResolvedValueOnce(mockedDS);

    // stub out 3 queries with empty results
    mockedDS.query.mockResolvedValueOnce([]).mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    await resolvers.Query.reports();

    // since isInitialized was false, initialize() must be called once
    expect(mockedDS.initialize).toHaveBeenCalledTimes(1);
  });

  it('2) does NOT re-initialize when already initialized', async () => {
    // override getter to return true
    Object.defineProperty(mockedDS, 'isInitialized', {
      get: () => true,
      configurable: true,
    });

    // stub queries so resolver completes
    mockedDS.query.mockResolvedValueOnce([]).mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    await resolvers.Query.reports();

    // initialize() should NOT be called
    expect(mockedDS.initialize).not.toHaveBeenCalled();
  });

  it('3) correctly maps perCourseRows to string tuples', async () => {
    const perCourse = [
      { course: 'Cloud Security', candidates: 7 },
      { course: 'Full Stack',    candidates: 2 },
    ];

    mockedDS.initialize.mockResolvedValueOnce(mockedDS);
    mockedDS.query
      .mockResolvedValueOnce(perCourse)
      .mockResolvedValueOnce([])         
      .mockResolvedValueOnce([]);        

    const result = await resolvers.Query.reports();

    expect(result.candidatesPerCourse).toEqual([
      ['Cloud Security', '7'],
      ['Full Stack',    '2'],
    ]);
  });

  it('4) returns overbooked and unchosen candidates arrays unchanged', async () => {
    const overbooked = [{ id: 10, fullName: 'Alice', email: 'alice@x.com' }];
    const unchosen   = [{ id: 99, fullName: 'Bob',   email: 'bob@x.com'   }];

    mockedDS.initialize.mockResolvedValueOnce(mockedDS);
    mockedDS.query
      .mockResolvedValueOnce([])           // perCourseRows
      .mockResolvedValueOnce(overbooked)   // overbookedCandidates
      .mockResolvedValueOnce(unchosen);    // unchosenCandidates

    const { overbookedCandidates, unchosenCandidates } = await resolvers.Query.reports();

    // they should be the *exact* arrays we returned from query()
    expect(overbookedCandidates).toBe(overbooked);
    expect(unchosenCandidates).toBe(unchosen);
  });

  it('5) throws an error when any query fails', async () => {
    // make the very first query reject
    mockedDS.initialize.mockResolvedValueOnce(mockedDS);
    mockedDS.query.mockRejectedValueOnce(new Error('DB down'));

    await expect(resolvers.Query.reports())
      .rejects
      .toThrow(/Internal server error: DB down/);
  });

  it('6) calls query exactly three times (once per section)', async () => {
    mockedDS.initialize.mockResolvedValueOnce(mockedDS);
    mockedDS.query
    .mockResolvedValueOnce([])  // for perCourseRows
    .mockResolvedValueOnce([])  // for overbookedCandidates
    .mockResolvedValueOnce([]); // for unchosenCandidates

    await resolvers.Query.reports();

    expect(mockedDS.query).toHaveBeenCalledTimes(3);
  });
});
