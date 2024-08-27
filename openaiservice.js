// every code written by faizan khan in backend
const { AzureOpenAI } = require("openai");
const { getembeddingdata } = require("./textembeddingservice");

const endpoint =
  "https://hytechopenai.openai.azure.com/openai/deployments/hytechdeploy/chat/completions?api-version=2023-03-15-preview";
const apiKey = "5e5db1a8347a47dc94582a958ca269c2";
const azureSearchEndpoint = "https://hytechaisearch.search.windows.net";
const azureSearchIndexName = "vector-1723458567572";




async function getChatCompletion(query) {

  
//console.log(context);

// const client = new AzureOpenAI({
//   apiKey: apiKey,
//   endpoint: endpoint,
//   apiVersion: "2023-03-15-preview",
//   deployment: "hytechdeploy",
// });

// const response = await client.chat.completions.create({
//   messages: [
//       { role: "system", content: "You are a helpful assistant.provide my query results from this context" },
     
//       { role: "user", content: `Context: ${context}\nQuery: ${query}` }
//   ],
//   temperature: 0.4,
//   max_tokens: 280,
// });

// return response.choices[0].message.content;



  const client = new AzureOpenAI({
    apiKey: apiKey,
    endpoint: endpoint,
    apiVersion: "2024-05-01-preview",
    deployment: "hytechdeploy",
  });
  

  const commonResponses = {
    hi: "Hello! How can I assist you today?",
    hello: "Hi there! What can I do for you?",
    thanks: "You're welcome! If you have more questions, feel free to ask.",
    "thank you": "Glad I could help!",
    bye: "Goodbye! Have a great day!",
    ok: "Ok thanks ",
  };
  const userMessage = query.toLowerCase(); // Normalize the input

  if (commonResponses[userMessage]) {
    return commonResponses[userMessage];
  }


  try {
    //const contextembedding=await getembeddingdata(query);
    const response = await client.chat.completions.create({
      model: "gpt-35-turbo-16k",
      messages: [
         { role: "system", content: " Always format your responses in the following way: start with a subtitle, then provide the answer in pointwise bulleted points, and finally include references with links and contact information.maintain this format." },
         //{ role: "user", content: contextembedding.toString() },
        // { role: "assistant", content: "Arrrr! Of course, me hearty! What can I do for ye?" },
        { role: "user", content: query  },
      ],
      temperature:0.6,
      top_p:0.15,
      max_tokens: 280,
      data_sources: [
        {
          type: "azure_search",

          parameters: {
            endpoint: azureSearchEndpoint,
            index_name: azureSearchIndexName,
            semantic_configuration:
              "vector-1723458567572-semantic-configuration", // Replace with your semantic configuration name
            authentication: {
              type: "system_assigned_managed_identity",
            },
          },
        },
      ],
      stream: true,
    });
    let ans = "";
    for await (const event of response) {
      for (const choice of event.choices) {
        if (choice.delta?.content != undefined) {
          let content = choice.delta.content;

          // Remove document identifiers like [doc1], [doc2], etc.
          content = content.replace(/\[doc\d+\]/g, "");

          ans += content;
        }
      }
    }
    return ans;
  } catch (error) {
    console.error("Error getting chat completion:", error);
    throw error; // Handle the error as needed
  }
}

module.exports = { getChatCompletion };
