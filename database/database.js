import { Pool } from "../deps.js";
import { config } from "../config/config.js";
import { Client } from "https://deno.land/x/postgres@v0.4.5/mod.ts";

const DATABASE_URL = Deno.env.toObject().DATABASE_URL;  // To run the app locally 
const client = new Client(DATABASE_URL);                // comment out these two lines

const CONCURRENT_CONNECTIONS = 2;
const connectionPool = () => new Pool(
    config.database
 , CONCURRENT_CONNECTIONS);

const pool = connectionPool();

// also comment this
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

// also uncomment this
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
