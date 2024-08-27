const axios = require('axios');

//const searchServiceName = 'cognitiveaisearchforchatbot';
const adminKey = 'S8TECfE694RMtSCvylIcyOiPUP3lA6CcNWc7keypSuAzSeCUOQqD';
//const indexName = 'vector-1723017827674';
const apiVersion = '2024-05-01-preview';
//const baseUrl = `https://${searchServiceName}.search.windows.net`;
const baseUrl = 'https://hytechaisearch.search.windows.net';
const indexName = 'vector-1723458567572';

const searchDocuments = async (embedding) => {

   
  const payload = {
    vector: embedding,
    k: 5, // Number of results to retrieve
    fields: ["content", "metadata"] // Fields to retrieve from the documents
};

  try {
    

    const response = await axios.post(
      `${baseUrl}/indexes/${indexName}/docs/search?api-version=${apiVersion}`,
      embedding,
      
      {
        headers: {
          'api-key': adminKey,
          'Content-Type': 'application/json'
        },
      //   queryType: "semantic",
      // semanticConfiguration: "vector-1723458567572-semantic-configuration",
      // queryLanguage: "en-us",
      // top:1
      }
    );
    console.log('Search response:', response.data);
    return response.data.value;
  } catch (error) {
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    } else {
      console.error('Error message:', error.message);
    }
    throw new Error('Error searching documents');
  }
};

module.exports = {
  searchDocuments
};
