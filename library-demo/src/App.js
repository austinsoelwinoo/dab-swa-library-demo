import 'bootstrap/dist/css/bootstrap.min.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { AzureOpenAI } from 'openai';
import './App.css';

import BookList from './Components/BookList/BookList';

const client = new ApolloClient({
  uri: '/data-api/graphql',
  cache: new InMemoryCache({
    addTypename: false
  })
});


// You will need to set these environment variables or edit the following values
const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
const apiKey = process.env["AZURE_OPENAI_API_KEY"];
const apiVersion = "2024-08-01-preview";
const deployment = "gpt-35-turbo"; //This must match your deployment name.

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

async function check_compliance(transcript) {
  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment, dangerouslyAllowBrowser: true });
  const result = await client.chat.completions.create({
    messages: [
      { role: "user", content: `Analyze this transcript for Monetary Authority of Singapore compliance: ${transcript}` },
    ],
    model: "",
  });
  for (const choice of result.choices) {
    console.log(choice.message);
  }
}

function App() {
  //read token from cookie StaticWebAppsAuthCookie
  let token;
  console.log("OpenAi", endpoint, apiKey)
  //check_compliance(TRANSCRIPT);

  try {
    token = document.cookie.split(';').find(c => c.trim().startsWith('StaticWebAppsAuthCookie=')).split('=')[1];
  } catch (e) {
    token = null;
  }

  return (
    <ApolloProvider client={client}>
      <div className="maxWidth1200Centered">
        <BookList />
      </div>
    </ApolloProvider>
  );
}

export default App;
