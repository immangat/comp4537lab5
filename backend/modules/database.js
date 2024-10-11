const mysql = require('mysql2/promise');

class DatabaseService {
    constructor(config) {
        this.config = config;
        this.pool = mysql.createPool(config); // Create a pool of connections
    }

    // Connect to the database (using connection pool)
    async connect() {
        try {
            this.connection = await this.pool.getConnection();
            console.log('Successfully connected to the database');
        } catch (error) {
            console.error('Error connecting to the database:', error);
            throw error;
        }
    }

    // Execute a general query
    async query(sql, params = []) {
        if (sql.toLowerCase().includes("drop") || sql.toLowerCase().includes("update")) {
            throw new Error("Drop or update not allowed")
        }
        try {
            const [rows] = await this.pool.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    // Insert data into a specific table
    async addData(tableName, data) {
        try {
            for (const patient of data) {
                const sql = `INSERT INTO patients (name, dateOfBirth) VALUES (?, ?)`;
                const values = [patient.name, patient.dateOfBirth];
                await this.pool.execute(sql, values);
                console.log(`Inserted: ${patient.name}`);
            }

        } catch (error) {
            console.error('Error adding data:', error);
            throw error;
        }
    }

    // Create table if it doesn't exist
    async createTableIfNotExists(tableName, tableSchema) {
        try {
            const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${tableSchema})`;
            await this.pool.execute(sql);
            console.log(`Table '${tableName}' checked/created successfully`);
        } catch (error) {
            console.error(`Error creating table '${tableName}':`, error);
            throw error;
        }
    }

    // Close the connection pool
    async close() {
        try {
            await this.pool.end();
            console.log('Database connection closed');
        } catch (error) {
            console.error('Error closing the database connection:', error);
        }
    }
}

module.exports = DatabaseService;
