const axios = require('axios');
const crypto = require('crypto');

module.exports = async function (context, req) {
    try {
        // Get parameters from the request query
        const name = req.query.name || "asiakastieto";

        const apiUrl = `https://avoindata.prh.fi/opendata-ytj-api/v3/companies?businessid=${encodeURIComponent(name)}`;

        // Make the GET request to the external API
        const response = await axios.get(apiUrl);

        // Return the response data to the client
        context.res = {
            status: 200,
            body: response.data,
            headers: {
                "Content-Type": "application/json"
            }
        };
    } catch (error) {
        context.log(error);

        // Handle any errors by returning an error response
        context.res = {
            status: 500,
            body: "Error fetching data"
        };
    }
};