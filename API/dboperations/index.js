const sql = require('mssql');

// Your Azure SQL database config
const config = {
    user: "XXXXX",        // Database username 
    password: "XXXX",     // Database password 
    server: "virtualisointisql.database.windows.net",  // Your Azure SQL Server URL
    database: "virtualisointidb",  // Your database name
    options: {
        encrypt: true,  // Required for Azure SQL
        trustServerCertificate: true  // Required for Azure SQL with SSL
    }
};

// Insert company data into the database (for POST requests)
async function insertCompanyData(data) {
    try {
        // Create a connection pool
        let pool = await sql.connect(config);

        // SQL query to insert data into the CompanyData table using parameterized query to prevent SQL injection
        let query = `
            INSERT INTO CompanyData (businessId, name, street, zip, town, phone, website, email, lineOfBusiness)
            VALUES (@businessId, @name, @street, @zip, @town, @phone, @website, @email, @lineOfBusiness);
        `;

        // Execute the query using parameters
        await pool.request()
            .input('businessId', sql.NVarChar, data.businessId)
            .input('name', sql.NVarChar, data.name)
            .input('street', sql.NVarChar, data.street)
            .input('zip', sql.NVarChar, data.zip)
            .input('town', sql.NVarChar, data.town)
            .input('phone', sql.NVarChar, data.phone)
            .input('website', sql.NVarChar, data.website)
            .input('email', sql.NVarChar, data.email)
            .input('lineOfBusiness', sql.NVarChar, data.lineOfBusiness)
            .query(query);

        // Return a success message
        return { message: 'Company data inserted successfully' };

    } catch (err) {
        // Log error and return failure message
        console.error(err);
        return { message: 'Error inserting company data', error: err.message };
    }
}

// Retrieve all company data (for GET requests)
async function getAllCompanies() {
    try {
        // Create a connection pool
        let pool = await sql.connect(config);

        // SQL query to get all companies
        let query = `SELECT * FROM CompanyData`;

        // Execute the query
        const result = await pool.request().query(query);

        // Return the result
        return result.recordset;  // This will return an array of company records

    } catch (err) {
        console.error(err);
        return { message: 'Error retrieving company data', error: err.message };
    }
}

// Azure Function entry point
module.exports = async function (context, req) {
    if (req.method === 'POST') {
        // Insert new data into the database
        const result = await insertCompanyData(req.body);
        context.res = {
            status: 200,  // Success
            body: result
        };
    } else if (req.method === 'GET') {
        // Retrieve all companies
        const result = await getAllCompanies();  // Fetch all company data
        context.res = {
            status: 200,  // Success
            body: result
        };
    } else {
        context.res = {
            status: 405,  // Method Not Allowed
            body: "Method not allowed. Use GET or POST."
        };
    }
};