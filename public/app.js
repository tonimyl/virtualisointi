
let fetchedData = null; 

async function fetchData() {
    const businessId = document.getElementById('businessId').value;

    if (!businessId) {
        document.getElementById('json-data').textContent = "Please enter a valid Business ID.";
        return;
    }

    try {
        const url = `https://yrityshaku.azurewebsites.net/api/fetchdata?businessId=${encodeURIComponent(businessId)}`;
        console.log(`Fetching data from: ${url}`);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response data:", data);
        const cleanOutput = (text) => {
            return text.trim().replace(/^ +/gm, ''); 
        };
        const {
            identificationData: {
                name,
                businessId: fetchedBusinessId, 
                address: { street, zip, town } = {},
                contactInformation: { phone, www, email } = {},
                lineOfBusiness: { lineOfBusinessText } = {}
            } = {}
        } = data.companyResponse || {};

        const output = `
Name: ${name || "N/A"}
Business ID: ${fetchedBusinessId || "N/A"}
Address: ${street || "N/A"}, ${zip || "N/A"} ${town || "N/A"}
Phone: ${phone || "N/A"}
Website: ${www || "N/A"}
Email: ${email || "N/A"}
Line of Business: ${lineOfBusinessText || "N/A"}
`;

        document.getElementById('json-data').textContent = cleanOutput(output);

        fetchedData = {
            name,
            businessId: fetchedBusinessId,
            street,
            zip,
            town,
            phone,
            website: www,
            email,
            lineOfBusiness: lineOfBusinessText
        };

        document.getElementById('saveDataButton').disabled = false;

    } catch (error) {
        document.getElementById('json-data').textContent = 'Error fetching data.';
        console.error("Error details:", error);
    }
}


async function saveData() {
if (!fetchedData) {
alert("No data to save!");
return;
}

try {
const url = 'https://yrityshaku.azurewebsites.net/api/dboperations?'; 
const response = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(fetchedData)
});

if (response.ok) {
    alert("Data saved successfully!");

    location.reload();
} else {
    throw new Error("Error saving data.");
}
} catch (error) {
alert("Failed to save data.");
console.error("Error details:", error);
}
}

async function deleteCompany() {
const businessId = document.getElementById('deleteBusinessId').value;

if (!businessId) {
alert("Please enter a valid Business ID.");
return;
}

try {
const url = `https://yrityshaku.azurewebsites.net/api/dboperations?businessId=${encodeURIComponent(businessId)}`;
const response = await fetch(url, {
    method: 'DELETE'
});

if (response.ok) {
    alert("Company deleted successfully!");

    fetchCompanies();
} else {
    throw new Error(`Error deleting company: ${response.statusText}`);
}
} catch (error) {
alert("Failed to delete company.");
console.error("Error details:", error);
}
}

async function fetchCompanyName() {
const companyName = document.getElementById('companyname').value;

if (!companyName) {
document.getElementById('companyNames').textContent = "Please enter a valid company name";
return;
}

try {
const url = `https://yrityshaku.azurewebsites.net/api/companyname?name=${encodeURIComponent(companyName)}`;
const response = await fetch(url);
const data = await response.json();

// Filter to include only active companies with "status": "2"
const activeCompanies = data.companies.filter(company => company.status === "2");

const companies = activeCompanies.map(company => {
    const businessId = company.businessId.value;
    const name = company.names[0]?.name || "Unknown Name";
    return `${name}, ${businessId}`;
});

document.getElementById('companyNames').textContent = companies.length
    ? companies.join('\n')
    : "No active companies found.";
} catch (error) {
document.getElementById('companyNames').textContent = 'Error fetching data.';
}
}


async function fetchCompanies() {
try {
const url = `https://yrityshaku.azurewebsites.net/api/dboperations?`; 
const response = await fetch(url);


if (!response.ok) {
    throw new Error(`Error fetching companies: ${response.statusText}`);
}


const data = await response.json();
console.log("Raw response data:", data);  


if (Array.isArray(data)) {

    const tableBody = document.getElementById('companyTableBody');

    tableBody.innerHTML = '';


    data.forEach(company => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${company.name || 'N/A'}</td>
            <td>${company.businessId || 'N/A'}</td>
            <td>${company.street || 'N/A'}, ${company.zip || 'N/A'}, ${company.town || 'N/A'}</td>
            <td>${company.phone || 'N/A'}</td>
            <td>${company.website || 'N/A'}</td>
            <td>${company.email || 'N/A'}</td>
            <td>${company.lineOfBusiness || 'N/A'}</td>
        `;

        tableBody.appendChild(row);
    });
} else {
    throw new Error('The response is not an array. Please check the backend API.');
}
} catch (error) {
console.error("Error fetching companies:", error);
document.getElementById('companyList').textContent = `Error fetching companies: ${error.message}`;
}
}

window.onload = fetchCompanies;