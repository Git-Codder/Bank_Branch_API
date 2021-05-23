const Pool  = require('pg').Pool;
require('dotenv/config');

// create a client to handle the request of user related to database
const pool = new Pool({
    user: process.env.POSTGRESQL_ADDON_USER,
    password: process.env.POSTGRESQL_ADDON_PASSWORD,
    database: process.env.POSTGRESQL_ADDON_DB,
    host: process.env.POSTGRESQL_ADDON_HOST,
    port: process.env.POSTGRESQL_ADDON_PORT,
    uri: process.env.POSTGRESQL_ADDON_URI
});

module.exports  = pool;