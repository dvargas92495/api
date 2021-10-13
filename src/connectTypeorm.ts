import {
  createConnection,
  getConnectionOptions,
  getConnectionManager,
  Connection,
  EntitySchema,
} from "typeorm";

export const connect = (entities: EntitySchema[]): Promise<void | Connection> =>
  getConnectionManager().has("default")
    ? Promise.resolve()
    : getConnectionOptions().then((opts) =>
        // Need to ignore bc generic opts dont fold nicely into mysql opts
        // Need to get defaults bc create connection can't find entities/migrations in ts files
        // ideally, this whole edge of the ternary is simply `createConnection()`
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        createConnection({
          ...opts,
          entities,
          type: "mysql",
          migrations: undefined,
        })
      );

export default connect;
