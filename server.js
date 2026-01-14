const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = '0.0.0.0'
const port = parseInt(process.env.PORT || '3000', 10)

console.log(`Starting Next.js server...`)
console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
console.log(`PORT: ${port}`)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  console.log('Next.js app prepared successfully')
  
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      if (!res.headersSent) {
        res.statusCode = 500
        res.end('internal server error')
      }
    }
  })
  
  server.listen(port, hostname, (err) => {
    if (err) {
      console.error('Failed to start server:', err)
      process.exit(1)
    }
    console.log(`> Server ready on http://${hostname}:${port}`)
    console.log(`> Server listening on port ${port}`)
  })
  
  server.on('error', (err) => {
    console.error('Server error:', err)
  })
}).catch((err) => {
  console.error('Failed to prepare Next.js app:', err)
  console.error('Error stack:', err.stack)
  process.exit(1)
})
