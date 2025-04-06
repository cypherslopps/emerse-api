import pkg from "pg";
// import * as dotenv from "dotenv";

// dotenv.config();

const { Client } = pkg;

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const client = new Client({
    connectionString
});

export default client;