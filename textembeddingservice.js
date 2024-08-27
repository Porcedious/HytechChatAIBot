const { AzureOpenAI } = require("openai");

const textembeddingendpoint="https://hytechopenai.openai.azure.com/openai/deployments/HytechTextEmbedding/embeddings?api-version=2023-05-15";
const apikeyfortextembedding="5e5db1a8347a47dc94582a958ca269c2";

async function getembeddingdata(formattedContext) {
const client = new AzureOpenAI({
    apiKey: apikeyfortextembedding,
    endpoint: textembeddingendpoint,
    apiVersion: "2023-05-15",
    deployment: "HytechTextEmbedding",
});

try {
    const response = await client.embeddings.create({
        input: formattedContext,
        top:1
    });
    console.log("response",response.data[0]);
    return response.data[0].embedding;
} catch (error) {
    console.error("Error getting text embedding:", error);
    throw error; // Handle the error as needed
}
}

module.exports={
    getembeddingdata
}