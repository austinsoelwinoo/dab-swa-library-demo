// You will need to set these environment variables or edit the following values
export const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
export const apiKey = process.env["AZURE_OPENAI_API_KEY"];
export const apiVersion = "2024-08-01-preview";
export const deployment = "gpt-35-turbo"; //This must match your deployment name.
export const BASE_URL = "https://compliancecheck.azurewebsites.net/api/complianceTrigger"
export const COMPLIANT = "Compliant"
export const NON_COMPLIANT = "Non-Compliant"
export const NEED_REVIEW = "Need-Review"

// async function check_compliance(transcript) {
//     const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment, dangerouslyAllowBrowser: true });
//     const result = await client.chat.completions.create({
//         messages: [
//             { role: "user", content: `Analyze this transcript for Monetary Authority of Singapore compliance: ${transcript}` },
//         ],
//         model: "",
//     });
//     for (const choice of result.choices) {
//         console.log(choice.message);
//     }
// }

// check_compliance(TRANSCRIPT)

// const [data, setData] = useState('');

// useEffect(() => {
//     (async function () {
//         const responseGet = await fetch("/api/httpTrigger13", {
//             method: "GET"
//         });
//         const listData = await responseGet.text()
//         setData(listData);
//         console.log("response", listData);

//         const responsePost = await fetch("/api/httpTrigger13", {
//             method: "POST",
//             body: JSON.stringify(
//                 {
//                     "rowKey": Date.now(),
//                     "name": "Name",
//                     "transcript": "Transcript",
//                     "complianceFlag": "Flag",
//                     "complianceReason": "Reason"
//                 }
//             ),
//         });
//         console.log("response", await responsePost.text());

//         const responsePut = await fetch("/api/httpTrigger13", {
//             method: "PUT",
//             body: JSON.stringify(
//                 {
//                     "partitionKey": "CompliancePartition",
//                     "rowKey": "1",
//                     "name": "Name",
//                     "transcript": "Transcript",
//                     "complianceFlag": "Flag",
//                     "complianceReason": "Reason"
//                 }
//             ),
//         });
//         console.log("response", await responsePut.text());
//     })();
// });
