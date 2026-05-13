/**
 * Cloudflare Worker for handling direct image uploads to Cloudflare R2
 * 
 * Instructions:
 * 1. Go to Cloudflare Dashboard -> Workers & Pages -> Create Worker
 * 2. Name it "embroidery-uploader" and click Deploy
 * 3. Click "Edit Code" and paste this entire file in
 * 4. Save and Deploy
 * 5. Go to Worker Settings -> Variables -> R2 Bucket Bindings
 * 6. Add a binding with Variable Name: MY_BUCKET and select your R2 bucket
 * 7. Add an Environment Variable: R2_PUBLIC_DOMAIN = "https://images.yourdomain.com" (or your R2 public dev URL)
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    // Handle Uploads
    if (request.method === 'POST') {
      try {
        const formData = await request.formData();
        const file = formData.get('file');
        const filePath = formData.get('filePath'); // e.g., "products/12345.webp"

        if (!file || !filePath) {
          return new Response(JSON.stringify({ error: 'Missing file or filePath' }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        // Put the file into the R2 bucket
        await env.MY_BUCKET.put(filePath, file.stream(), {
          httpMetadata: { contentType: file.type }
        });

        // Ensure R2_PUBLIC_DOMAIN does not have a trailing slash
        const domain = env.R2_PUBLIC_DOMAIN.endsWith('/') 
          ? env.R2_PUBLIC_DOMAIN.slice(0, -1) 
          : env.R2_PUBLIC_DOMAIN;
          
        const publicUrl = `${domain}/${filePath}`;

        return new Response(JSON.stringify({ publicUrl }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }
    
    // Handle Deletions (Optional)
    if (request.method === 'DELETE') {
       try {
           const { filePath } = await request.json();
           if(filePath) {
               await env.MY_BUCKET.delete(filePath);
           }
           return new Response(JSON.stringify({ success: true }), {
               status: 200,
               headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
           });
       } catch (err) {
           return new Response(JSON.stringify({ error: err.message }), {
               status: 500,
               headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
           });
       }
    }

    return new Response('Method not allowed', { 
        status: 405,
        headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
};
