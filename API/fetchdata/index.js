const axios = require('axios');
const crypto = require('crypto');

module.exports = async function (context, req) {
    try {
        // Get parameters from the request query
        const userid = req.query.userid || "118381000001";
        const passwd = req.query.passwd || "QyM9V8Dn";
        const apikey = req.query.apikey || "co3wo4b1WLG3qetoIcCo06VSUfWCTYtC55p9brLFf1po2I8D15YWcCSGbn5210Tu";
        const enduser = req.query.enduser || "tonitest";

        // Get the current timestamp in the required format (e.g., 2024122208452709+0000000)
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(now.getUTCMilliseconds()).padStart(3, '0');
        const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}+0000000`;

        // Construct the string to hash for checksum (using "+" directly in the string)
        const stringToHash = `${userid}&${enduser}&${timestamp}&${apikey}&`;

        // Calculate the checksum using SHA-512
        const checksum = crypto.createHash('sha512').update(stringToHash).digest('hex');

        // Construct the API URL with query parameters, encoding "+" as "%2b"
        const apiUrl = `https://demo.asiakastieto.fi/services/company5/REST?businessid=01110279&version=5.01&packet=055&json&userid=${encodeURIComponent(userid)}&passwd=${encodeURIComponent(passwd)}&apikey=${encodeURIComponent(apikey)}&enduser=${encodeURIComponent(enduser)}&checksum=${encodeURIComponent(checksum)}&timestamp=${encodeURIComponent(timestamp.replace('+', '%2b'))}`;

        // Make the GET request to the external API
        const response = await axios.get(apiUrl);

        // Return the response data to the client
        context.res = {
            status: 200,
            body: response.data,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
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