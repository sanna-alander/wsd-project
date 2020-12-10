import { Pool } from "../deps.js";
import { config } from "../config/config.js";
import { Client } from "https://deno.land/x/postgres@v0.4.5/mod.ts";

const DATABASE_URL = Deno.env.toObject().DATABASE_URL; 
const client = new Client(DATABASE_URL);                

const CONCURRENT_CONNECTIONS = 2;
const connectionPool = () => new Pool(
    config.database
 , CONCURRENT_CONNECTIONS);

const pool = connectionPool();

const executeQuery = async(query, ...args) => {
  try {
      await client.connect();
      return await client.query(query, ...args);
  } catch (e) {
      console.log(e);
  } finally {
      await client.end();
  }
}


/*const executeQuery = async(query, ...args) => { 
  const client = await pool.connect();
  try {
    return await client.query(query, ...args);
  } catch (e) {
    console.log(e);
  } finally {
    client.release();
  }
}*/

export { executeQuery };
