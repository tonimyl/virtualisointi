const sql = require('mssql');

// Database connection configuration
const config = {
    user: "sqladmin",        // Database username 
    password: "HK12asd442",    // Database password
    server: "virtualisointisql.database.windows.net",     // Your SQL Server name or Azure SQL server URL
    database: "virtualisointidb",     // Your database name
    options: {
        encrypt: true, // For Azure SQL, set this to true
        trustServerCertificate: true // Set to true for Azure SQL if SSL is required
    }
};

// Insert company data into the database
async function insertCompanyData(data) {
    try {
        // Create a connection pool
        let pool = await sql.connect(config);

        // SQL query to insert data into the CompanyData table
        let query = `
            INSERT INTO CompanyData (businessId, name, street, zip, town, phone, website, email, lineOfBusiness)
            VALUES ('${data.businessId}', '${data.name}', '${data.street}', '${data.zip}', '${data.town}', 
                    '${data.phone}', '${data.website}', '${data.email}', '${data.lineOfBusiness}');
        `;

        // Execute the query
        await pool.request().query(query);

        // Return a success message
        return { message: 'Company data inserted successfully' };

    } catch (err) {
        // Log error and return failure message
        console.error(err);
        return { message: 'Error inserting company data', error: err.message };
    }
}

// Azure Function to handle HTTP requests
module.exports = async function (context, req) {
    if (req.method === 'POST') {
        // Call the function to insert data into the database
        const result = await insertCompanyData(req.body);
        context.res = {
            status: 200, /* Defaults to 200 */
            body: result
        };
    } else {
        context.res = {
            status: 405, // Method Not Allowed
            body: "Method not allowed. Use POST."
        };
    }
};