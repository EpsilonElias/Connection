// scripts/generate-blogs-json.ts
// Script to generate public/blogs.json from Payload CMS
import { getAllPosts } from '../src/lib/payload';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from multiple possible locations
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Debug environment variables
console.log('Environment check:');
console.log('PAYLOAD_API_URL:', process.env.PAYLOAD_API_URL);
console.log('NEXT_PUBLIC_PAYLOAD_API_URL:', process.env.NEXT_PUBLIC_PAYLOAD_API_URL);

// Set fallback if not found in env files
if (!process.env.PAYLOAD_API_URL && !process.env.NEXT_PUBLIC_PAYLOAD_API_URL) {
  process.env.PAYLOAD_API_URL = 'https://dr-serzhans-psycare.onrender.com';
  console.log('Using fallback PAYLOAD_API_URL:', process.env.PAYLOAD_API_URL);
}

// Helper to convert Lexical JSON to HTML (same as API)
function lexicalToHtml(content: any): string {
  if (!content || !content.root || !Array.isArray(content.root.children)) return '';
  return content.root.children.map((node: any) => {
    if (node.type === 'paragraph') {
      return `<p>${(node.children || []).map((child: any) => child.text || '').join('')}</p>`;
    }
    return '';
  }).join('');
}

async function main() {
  const posts = await getAllPosts();
  const blogs = posts.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    publishedDate: post.publishedDate,
    author: post.author,
    featuredImage: post.featuredImage?.url || '',
    contentHtml: lexicalToHtml(post.content),
  }));

  // Write to public directory (for dev) and out directory (for static export)
  const publicPath = path.join(__dirname, '../public/blogs.json');
  const outPath = path.join(__dirname, '../out/blogs.json');
  
  // Ensure directories exist
  fs.mkdirSync(path.dirname(publicPath), { recursive: true });
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  
  const jsonContent = JSON.stringify(blogs, null, 2);
  
  // Write to both locations
  fs.writeFileSync(publicPath, jsonContent, 'utf-8');
  fs.writeFileSync(outPath, jsonContent, 'utf-8');
  
  console.log(`blogs.json generated with ${blogs.length} posts in both public and out directories.`);
}

main().catch(err => {
  console.error('Error generating blogs.json:', err);
  process.exit(1);
});
