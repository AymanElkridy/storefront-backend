import express from 'express'
import bodyParser from 'body-parser'
import handle from './handlers/_Handle'

const app: express.Application = express()

app.use(bodyParser.json())

// Adding handlers
handle(app)

// Starting the server
const port = 3000
app.listen(port, (): void => {
        console.log(`starting app on port: ${port}`)
})

export default app