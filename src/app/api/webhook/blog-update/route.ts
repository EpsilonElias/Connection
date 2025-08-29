import { NextResponse, NextRequest } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Webhook received:', body)

    // Check if this is a blog post publish event
    if (body.collection === 'posts' && body.operation === 'update' && body.doc.status === 'published') {
      console.log('Blog post published, regenerating blogs.json...')
      
      // Regenerate blogs.json using the same script
      const { stdout, stderr } = await execAsync(
        'npm run generate-blogs',
        { 
          cwd: process.cwd(),
          env: { 
            ...process.env, 
            PAYLOAD_API_URL: process.env.PAYLOAD_API_URL || 'https://dr-serzhans-psycare.onrender.com'
          }
        }
      )
      
      console.log('Generate blogs output:', stdout)
      if (stderr) console.error('Generate blogs error:', stderr)

      return NextResponse.json({
        success: true,
        message: 'Blog cache updated',
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook received but no action needed',
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
