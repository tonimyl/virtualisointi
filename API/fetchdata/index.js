const axios = require('axios');

module.exports = async function (context, req) {
    try {
        const apiUrl = "https://jsonplaceholder.typicode.com/todos/1"; // Example API URL
        const response = await axios.get(apiUrl);

        context.res = {
            status: 200,
            body: response.data,
            headers: {
                "Content-Type": "application/json"
            }
        };
    } catch (error) {
        context.log(error);
        context.res = {
            status: 500,
            body: "Error fetching data"
        };
    }
};