// Debug script to see the actual API response structure

const PAYLOAD_API_URL = 'https://dr-serzhans-psycare.onrender.com';

async function debugApiResponse() {
  console.log('Fetching posts with full depth...');
  const response = await fetch(`${PAYLOAD_API_URL}/api/posts?where[status][equals]=published&sort=-publishedDate&depth=3`);
  const data = await response.json();
  
  console.log('\n=== FIRST POST DEBUG ===');
  if (data.docs && data.docs[0]) {
    const firstPost = data.docs[0];
    console.log('Title:', firstPost.title);
    console.log('FeaturedImage structure:', JSON.stringify(firstPost.featuredImage, null, 2));
    
    if (firstPost.content && firstPost.content.root && firstPost.content.root.children) {
      console.log('\n=== CONTENT ANALYSIS ===');
      firstPost.content.root.children.forEach((child: any, index: number) => {
        if (child.type === 'upload') {
          console.log(`Upload node ${index}:`, JSON.stringify(child, null, 2));
        }
      });
    }
  }
}

debugApiResponse().catch(console.error);
