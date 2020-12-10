let config = {};

// if you want you can also add your database credentials here
/*config.database = { 
    hostname: ,
    database: ,
    user: ,
    password: ,
    port: 
};*/

if (Deno.env.get('DATABASE_URL')) {
    config.database = Deno.env.get('DATABASE_URL');
  } else {
    config.database = {};
  }


export { config };
