import axios from 'axios';

// Hashnode GraphQL API Integration
export async function publishToHashnode(articleData) {
  const apiKey = process.env.HASHNODE_API_KEY;
  const publicationId = process.env.HASHNODE_PUB_ID;
  if (!apiKey || !publicationId) return false;

  try {
    console.log(`Publishing "${articleData.title}" to Hashnode...`);
    
    const query = `
      mutation PublishPost($input: PublishPostInput!) {
        publishPost(input: $input) {
          post { url }
        }
      }
    `;

    const variables = {
      input: {
        title: articleData.title,
        contentMarkdown: articleData.finalContent,
        publicationId: publicationId,
        tags: [{ slug: "web-development", name: "Web Development" }]
      }
    };

    const postRes = await axios.post('https://gql.hashnode.com/', { query, variables }, {
      headers: { Authorization: apiKey }
    });

    if (postRes.data.errors) throw new Error(postRes.data.errors[0].message);

    console.log(`✅ Successfully published to Hashnode!`);
    return true;
  } catch (error) {
    console.error("❌ Failed to publish to Hashnode:", error.message);
    return false;
  }
}
