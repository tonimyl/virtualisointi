const { insertCompanyData } = require('./function');  // Import your database function

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