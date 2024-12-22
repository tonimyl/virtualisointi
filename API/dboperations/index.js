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
        let pool = await sql.connect(config);

        let query = `
            INSERT INTO CompanyData (businessId, name, street, zip, town, phone, website, email, lineOfBusiness)
            VALUES ('${data.businessId}', '${data.name}', '${data.street}', '${data.zip}', '${data.town}', 
                    '${data.phone}', '${data.website}', '${data.email}', '${data.lineOfBusiness}');
        `;

        await pool.request().query(query);

        return { message: 'Company data inserted successfully' };
    } catch (err) {
        console.error(err);
        return { message: 'Error inserting company data', error: err.message };
    }
}

// Retrieve all company data (for GET requests)
async function getAllCompanies() {
    try {
        let pool = await sql.connect(config);

        let query = `SELECT * FROM CompanyData`;

        const result = await pool.request().query(query);

        // Return the result
        return result.recordset;  // This should be an array of companies

    } catch (err) {
        console.error(err);
        return { message: 'Error retrieving company data', error: err.message };
    }
}

// Azure Function entry point
module.exports = async function (context, req) {
    if (req.method === 'POST') {
        const result = await insertCompanyData(req.body);
        context.res = {
            status: 200,  // Success
            body: result
        };
    } else if (req.method === 'GET') {
        const result = await getAllCompanies();
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