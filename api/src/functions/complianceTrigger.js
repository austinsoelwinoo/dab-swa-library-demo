const { app } = require('@azure/functions');
const { TableClient, AzureNamedKeyCredential } = require('@azure/data-tables');
const accountName = process.env.STORAGE_ACCOUNT_NAME;
const accountKey = process.env.STORAGE_ACCOUNT_KEY;
const tableName = "Compliance"; // Replace with your table name


app.http('complianceTrigger', {
    methods: ['GET', 'POST', 'PUT'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url ${request.url} ${request.method}`);
        const credential = new AzureNamedKeyCredential(accountName, accountKey);
        const client = new TableClient(`https://${accountName}.table.core.windows.net`, tableName, credential);

        const requestData = request.params;
        const partitionKey = requestData.partitionKey;
        const rowKey = requestData.rowKey;

        try {
            if (request.method === "POST") {
                // Create a new entry
                if (!partitionKey || !rowKey || !requestData.name) {
                    return {
                        status: 400,
                        body: "Please provide partitionKey, rowKey, and data for creating an entry."
                    };
                }

                const entity = requestData;

                await client.createEntity(entity);
                return {
                    status: 201,
                    body: "Entity created successfully."
                };

            } else if (request.method === "GET") {
                // Retrieve all entries in the table
                const entities = [];
                for await (const entity of client.listEntities()) {
                    entities.push(entity);
                }
                return {
                    status: 200,
                    body: JSON.stringify(entities)
                };
            } else if (request.method === "PUT") {
                //Update an existing entry
                if (!partitionKey || !rowKey || !requestData.name) {
                    return {
                        status: 400,
                        body: "Please provide partitionKey, rowKey, and data for updating an entry."
                    };
                }

                const entity = requestData;

                await client.updateEntity(entity, "Merge"); // "Merge" updates only the fields provided in data
                return {
                    status: 200,
                    body: "Entity updated successfully."
                };

            } else {
                return {
                    status: 405,
                    body: "Method not allowed. Please use GET, POST, or PUT."
                };
            }

        } catch (error) {
            return {
                status: 500,
                body: `Error: ${error.message}`
            };
        }

        //return { status: 200, body: `Hello, ${JSON.stringify(requestData)} ${accountName} ${accountKey} ${partitionKey} ${rowKey}` };
    }
});
