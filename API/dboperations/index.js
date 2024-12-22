const sql = require('mssql');

// Your Azure SQL database config
const config = {
    user: "sqladmin",        // Database username
    password: "HK12asd442",     // Database password
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
async function deleteCompanyData(businessId) {
    try {
        // Create a connection pool
        let pool = await sql.connect(config);

        // SQL query to delete data from the CompanyData table
        let query = `
            DELETE FROM CompanyData WHERE businessId = '${businessId}'
        `;

        // Execute the query
        await pool.request().query(query);

        // Return a success message
        return { message: 'Company data deleted successfully' };

    } catch (err) {
        console.error(err);
        return { message: 'Error deleting company data', error: err.message };
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
    } else if (req.method === 'DELETE') {
        // Delete company data by businessId
        const businessId = req.query.businessId;
        if (!businessId) {
            context.res = {
                status: 400,  // Bad Request
                body: "Business ID is required to delete a company."
            };
            return;
        }

        const result = await deleteCompanyData(businessId);  // Delete company data
        context.res = {
            status: 200,  // Success
            body: result
        };
    } else {
        context.res = {
            status: 405,  // Method Not Allowed
            body: "Method not allowed. Use GET, POST, or DELETE."
        };
    }
};