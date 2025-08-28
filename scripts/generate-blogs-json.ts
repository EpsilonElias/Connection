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
  if (!content) return '';
  
  // If it's already a string, return it
  if (typeof content === 'string') return content;
  
  // Handle Lexical format
  if (content.root && Array.isArray(content.root.children)) {
    return content.root.children.map((node: any) => {
      if (node.type === 'paragraph') {
        const content = (node.children || []).map((child: any) => {
          if (child.text) {
            let text = child.text;
            // Apply formatting
            if (child.format && child.format & 1) text = `<strong>${text}</strong>`;
            if (child.format && child.format & 2) text = `<em>${text}</em>`;
            if (child.format && child.format & 8) text = `<u>${text}</u>`;
            return text;
          } else if (child.type === 'upload') {
            // Handle image uploads within paragraphs
            let src = child.value?.url || (typeof child.src === 'string' ? child.src : '');
            const alt = child.value?.alt || child.alt || 'Image';
            const width = child.width || '';
            const height = child.height || '';
            
            if (src) {
              // Ensure absolute URL
              if (!src.startsWith('http')) {
                const baseUrl = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'https://dr-serzhans-psycare.onrender.com';
                src = src.startsWith('/') ? `${baseUrl}${src}` : `${baseUrl}/${src}`;
              }
              
              let imgTag = `<img src="${src}" alt="${alt}"`;
              if (width) imgTag += ` width="${width}"`;
              if (height) imgTag += ` height="${height}"`;
              imgTag += ' style="max-width: 100%; height: auto; display: block; margin: 20px 0;" />';
              return imgTag;
            }
            return '';
          } else if (child.type === 'image') {
            // Handle direct image nodes within paragraphs
            let src = child.src || child.url || '';
            const alt = child.alt || child.altText || 'Image';
            const width = child.width || '';
            const height = child.height || '';
            
            if (src) {
              // Ensure absolute URL
              if (!src.startsWith('http')) {
                const baseUrl = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'https://dr-serzhans-psycare.onrender.com';
                src = src.startsWith('/') ? `${baseUrl}${src}` : `${baseUrl}/${src}`;
              }
              
              let imgTag = `<img src="${src}" alt="${alt}"`;
              if (width) imgTag += ` width="${width}"`;
              if (height) imgTag += ` height="${height}"`;
              imgTag += ' style="max-width: 100%; height: auto; display: block; margin: 20px 0;" />';
              return imgTag;
            }
            return '';
          }
          return '';
        }).join('');
        return content ? `<p>${content}</p>` : '';
      } else if (node.type === 'heading') {
        const text = (node.children || []).map((child: any) => child.text || '').join('');
        const level = Math.min(Math.max(node.tag ? parseInt(node.tag.replace('h', '')) : 2, 1), 6);
        return text ? `<h${level}>${text}</h${level}>` : '';
      } else if (node.type === 'upload') {
        // Handle image uploads within content
        let src = node.value?.url || (typeof node.src === 'string' ? node.src : '');
        const alt = node.value?.alt || node.alt || 'Image';
        const width = node.width || '';
        const height = node.height || '';
        
        if (src) {
          // Ensure absolute URL
          if (!src.startsWith('http')) {
            const baseUrl = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'https://dr-serzhans-psycare.onrender.com';
            src = src.startsWith('/') ? `${baseUrl}${src}` : `${baseUrl}/${src}`;
          }
          
          let imgTag = `<img src="${src}" alt="${alt}"`;
          if (width) imgTag += ` width="${width}"`;
          if (height) imgTag += ` height="${height}"`;
          imgTag += ' style="max-width: 100%; height: auto; display: block; margin: 20px 0;" />';
          return imgTag;
        }
        return '';
      } else if (node.type === 'image') {
        // Handle direct image nodes
        let src = node.src || node.url || '';
        const alt = node.alt || node.altText || 'Image';
        const width = node.width || '';
        const height = node.height || '';
        
        if (src) {
          // Ensure absolute URL
          if (!src.startsWith('http')) {
            const baseUrl = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'https://dr-serzhans-psycare.onrender.com';
            src = src.startsWith('/') ? `${baseUrl}${src}` : `${baseUrl}/${src}`;
          }
          
          let imgTag = `<img src="${src}" alt="${alt}"`;
          if (width) imgTag += ` width="${width}"`;
          if (height) imgTag += ` height="${height}"`;
          imgTag += ' style="max-width: 100%; height: auto; display: block; margin: 20px 0;" />';
          return imgTag;
        }
        return '';
      } else if (node.type === 'list') {
        const listItems = (node.children || []).map((item: any) => {
          if (item.type === 'listitem') {
            const text = (item.children || []).map((child: any) => {
              if (child.children) {
                return (child.children || []).map((grandchild: any) => grandchild.text || '').join('');
              }
              return child.text || '';
            }).join('');
            
            if (node.listType === 'check') {
              const checked = item.checked ? '✓' : '○';
              return text ? `<li>${checked} ${text}</li>` : `<li>${checked}</li>`;
            }
            return text ? `<li>${text}</li>` : '';
          }
          return '';
        }).filter((item: string) => item).join('');
        
        if (!listItems) return '';
        return node.listType === 'number' ? `<ol>${listItems}</ol>` : `<ul>${listItems}</ul>`;
      }
      // Fallback for other node types
      return '';
    }).filter((item: string) => item).join('');
  }
  
  // Fallback: return empty string for empty content
  return '';
}

async function main() {
  const posts = await getAllPosts();
  const blogs = posts.map(post => {
    // Generate slug if it doesn't exist (for backwards compatibility)
    let slug = post.slug;
    if (!slug && post.title) {
      slug = post.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    // Process featured image URL - ensure we have the full URL
    let featuredImageUrl = '';
    if (post.featuredImage) {
      if (typeof post.featuredImage === 'string') {
        featuredImageUrl = post.featuredImage;
      } else if (post.featuredImage.url) {
        // Ensure full URL
        featuredImageUrl = post.featuredImage.url.startsWith('http') 
          ? post.featuredImage.url 
          : `${process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'https://dr-serzhans-psycare.onrender.com'}${post.featuredImage.url}`;
      }
    }
    
    return {
      id: post.id,
      title: post.title,
      slug: slug,
      excerpt: post.excerpt,
      publishedDate: post.publishedDate,
      author: post.author,
      featuredImage: featuredImageUrl,
      contentHtml: lexicalToHtml(post.content),
    };
  });

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
