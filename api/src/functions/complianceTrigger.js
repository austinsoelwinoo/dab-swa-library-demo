const { app } = require('@azure/functions');
const { TableClient, AzureNamedKeyCredential } = require('@azure/data-tables');
const axios = require('axios');

const accountName = process.env.STORAGE_ACCOUNT_NAME;
const accountKey = process.env.STORAGE_ACCOUNT_KEY;
const tableName = "Compliance"; // Replace with your table name

app.http('complianceTrigger', {
    methods: ['GET', 'POST', 'PUT'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url ${request.url} ${request.method} ${JSON.stringify(request.params)}`);
        const credential = new AzureNamedKeyCredential(accountName, accountKey);
        const client = new TableClient(`https://${accountName}.table.core.windows.net`, tableName, credential);

        const requestData = request.params;
        const partitionKey = "CompliancePartition";
        //;
        try {
            if (request.method === "POST") {
                // Create a new entry
                if (!requestData.name) {
                    return {
                        status: 400,
                        body: "Please provide data for creating an entry."
                    };
                }
                let compliance = await checkCompliance(context, requestData.transcript)
                const entity = {
                    partitionKey: partitionKey,
                    complianceFlag: compliance.status,
                    complianceReason: compliance.reason,
                    rowKey: Date.now().toString(),
                    ...requestData,
                };
                context.log("Entity", entity)
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
                context.log("GETALL", JSON.stringify(entities))
                return {
                    status: 200,
                    body: JSON.stringify(entities)
                };
            } else if (request.method === "PUT") {
                //Update an existing entry
                if (!requestData.rowKey || !requestData.name) {
                    return {
                        status: 400,
                        body: "Please provide rowKey, and data for updating an entry."
                    };
                }

                const entity = {
                    partitionKey: partitionKey,
                    ...requestData,
                };;

                await client.updateEntity(entity, "Merge"); // "Merge" updates only the fields provided in data

                // Return whole list 
                const entities = [];
                for await (const entity of client.listEntities()) {
                    entities.push(entity);
                }
                return {
                    status: 200,
                    body: JSON.stringify(entities)
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

const checkCompliance = async (context, transcript) => {
    const prompt = `
    Analyze the following conversation for compliance with MAS regulations. Based on the entire conversation, return a single status as "Compliant," "Non-Compliant," or "Need-Review" with a brief reason in JSON format with.

    Transcript:
    ${transcript}
    `

    context.log(`OpenAI input ${process.env.AZURE_OPENAI_ENDPOINT} ${process.env.AZURE_OPENAI_API_KEY} ${prompt}`)
    try {
        const response = await axios.post(process.env.AZURE_OPENAI_ENDPOINT,
            {
                messages: [{
                    role: "user",
                    content: prompt
                }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.AZURE_OPENAI_API_KEY,
                },
            }
        );
        const message = JSON.parse(response.data.choices[0].message.content)
        context.log(`OpenAI output ${JSON.stringify(message)}`)
        return message
    } catch (error) {
        context.error(error);
    }

};

const TRANSCRIPT = `
Client Advisor:
Hello, Mr. Tan. We have a fantastic investment opportunity for you that’s practically risk-free and promises steady returns.

Client:
That sounds interesting. What’s the expected return?

Client Advisor:
This fund has historically provided 6-7% annually, and you should expect similar returns going forward. There’s no need to worry about risks—it’s a stable option.

Client:
What about the fees or other charges?

Client Advisor:
There are a few small fees, but nothing significant. This is a great option if you’re looking for consistent growth.

Client:
How is my information protected?

Client Advisor:
Oh, don’t worry, only a few people here can see your profile. Your details are safe.

Client:
Alright, I’ll think about it.
`