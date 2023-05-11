// Require the MongoClient from the MongoDB driver package
const MongoClient = require("mongodb").MongoClient;
// Require the dotenv package to read environment variables from .env files
const dotenv = require('dotenv');
dotenv.config();
const { MONGO_DB_URI, MONGO_DB } = process.env;
// Throw an error if the MONGO_DB_URI environment variable is not defined
if (!MONGO_DB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}
/**
 * Define a cached connection object that will be used to maintain a single connection
 * to the MongoDB database across multiple requests. This will prevent the connection
 * from being opened and closed multiple times, which can cause performance issues.
 */
let cached = global.mongo;

if (!cached) {
    cached = global.mongo = { conn: null, promise: null };
}
/**
 * Define an asynchronous function that will connect to the MongoDB database using the
 * MONGO_DB_URI and MONGO_DB environment variables. This function will return a promise
 * that resolves to an object containing the MongoDB client and database objects.
 */
exports.connectToDatabase = async () => {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        cached.promise = MongoClient.connect(MONGO_DB_URI, opts).then((client) => {
            return {
                client,
                db: client.db(MONGO_DB),
            };
        });
    }
    // Wait for resolve and store the connection in the cached object
    cached.conn = await cached.promise;
    // Return the connection object
    return cached.conn;
};

