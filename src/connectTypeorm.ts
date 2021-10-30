import {
  createConnection,
  getConnectionManager,
  Connection,
  EntitySchema,
} from "typeorm";

export const connect = (entities: EntitySchema[]): Promise<void | Connection> =>
  getConnectionManager().has("default")
    ? Promise.resolve()
    : createConnection({
        entities,
        type: "mysql",
        migrations: undefined,
        logging: process.env.TYPEORM_LOGGING === "true",
        synchronize: false,
        port: 5432,
        database: process.env.TYPEORM_DATABASE,
        password: process.env.TYPEORM_PASSWORD,
        username: process.env.TYPEORM_USERNAME,
        host: process.env.TYPEORM_HOST,
      });

export default connect;
