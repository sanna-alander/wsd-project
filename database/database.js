import { Pool } from "../deps.js";
import { config } from "../config/config.js";

const CONCURRENT_CONNECTIONS = 5;
const connectionPool = new Pool({ 
    hostname: "hattie.db.elephantsql.com",
    database: "krmepyxl",
    user: "krmepyxl",
    password: "A-QQp3TYcRhuQpbVIzruXCkVYWdVYEUP",
    port: 5432
 }, CONCURRENT_CONNECTIONS);

const executeQuery = async(query, ...args) => {
  const client = await connectionPool.connect();
  try {
    return await client.query(query, ...args);
  } catch (e) {
    console.log(e);
  } finally {
    client.release();
  }
}

export { executeQuery };
