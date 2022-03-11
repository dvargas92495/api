import mysql from "mysql2";

const DATABASE_URL_REGEX =
  /^mysql:\/\/([a-z0-9_]+):(.{16})@([a-z0-9\.-]+):(\d{3,5})\/([a-z_]+)$/;
const matches = DATABASE_URL_REGEX.exec(process.env.DATABASE_URL || "");

if (!matches) throw new Error(`Error parsing Database URL`);

let connection: null | mysql.Connection = null;
const createConnection = () => {
  const conn = mysql.createConnection({
    host: matches[3],
    user: matches[1],
    port: Number(matches[4]),
    database: matches[5],
    password: matches[2],
  });
  conn.on("close", () => {
    connection = null;
  });
  return conn;
};

const getConnection = () => {
  if (!connection) {
    connection = createConnection();
  }
  return connection;
};

export const execute = <
  T extends
    | mysql.RowDataPacket[][]
    | mysql.RowDataPacket[]
    | mysql.OkPacket
    | mysql.OkPacket[]
    | mysql.ResultSetHeader
>(
  s: string,
  args: (string | number)[] = []
): Promise<T> =>
  new Promise((resolve, reject) => {
    return getConnection().execute<T>(s, args, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });

export default connection;
