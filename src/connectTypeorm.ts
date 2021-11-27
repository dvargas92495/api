import {
  createConnection,
  getConnectionManager,
  Connection,
  EntitySchema,
} from "typeorm";
import randomstring from "randomstring";

export const connect = (entities: EntitySchema[]): Promise<Connection> =>
  Promise.all(
    getConnectionManager()
      .connections.filter((c) => c.isConnected)
      .map((c) => c.close())
  ).then(() =>
    createConnection({
      name: randomstring.generate({ charset: "alphabetic", length: 16 }),
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
    })
  );

export default connect;
