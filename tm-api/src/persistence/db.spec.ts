import { DB, TableName } from './db';

describe('DB', () => {
  it('ping resolves', async () => {
    const db = new DB();
    await expect(db.ping()).resolves.toBeUndefined();
  });

  it('ping throws when DB is unhealthy', async () => {
    const db = new DB();
    db.setHealthy(false);
    await expect(db.ping()).rejects.toThrow('DB unavailable');
  });

  it('insert + getAll returns inserted values', async () => {
    const db = new DB();

    await db.insert(TableName.TASKS, '1', { id: '1' });
    await db.insert(TableName.TASKS, '2', { id: '2' });

    const all = await db.getAll<{ id: string }>(TableName.TASKS);
    expect(all).toEqual([{ id: '1' }, { id: '2' }]);
  });

  it('getById returns value or null', async () => {
    const db = new DB();

    expect(await db.getById(TableName.TASKS, 'missing')).toBeNull();

    await db.insert(TableName.TASKS, 'x', { id: 'x', title: 't' });
    expect(await db.getById<{ id: string; title: string }>(TableName.TASKS, 'x')).toEqual({
      id: 'x',
      title: 't',
    });
  });
});
