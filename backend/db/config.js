const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    isServer: process.env.NODE_ENV === 'production',
};
module.exports = dbConfig
