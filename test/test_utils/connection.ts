import { createConnection, getConnection, Index } from 'typeorm';

const connection = {
  async create(): Promise<void> {
    await createConnection();
  },

  async close(): Promise<void> {
    await getConnection().close();
  },

  async clear(): Promise<void> {
    const connection = await getConnection();
    const entities = connection.entityMetadatas;
    const clearPromises = [];
    // for (const index in entities) {
    //   const entity = entities[index];
    //   const repository = connection.getRepository(entity.name);
    //   clearPromises.push(repository.query(`TRUNCATE ${entity.tableName} CASCADE`));
    // }
    // await Promise.all(clearPromises);
  },
};

export default connection;
