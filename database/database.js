import { Pool } from "../deps.js";
import { config } from "../config/config.js";

const CONCURRENT_CONNECTIONS = 2;
const connectionPool = () => new Pool(
    config.database
 , CONCURRENT_CONNECTIONS);

 const pool = connectionPool();

const executeQuery = async(query, ...args) => {
  const client = await pool.connect();
  try {
    return await client.query(query, ...args);
  } catch (e) {
    console.log(e);
  } finally {
    client.release();
  }
}

export { executeQuery };
