import express from 'express'
import bodyParser from 'body-parser'
import handle from './handlers/_handle'

const app: express.Application = express()
const port = 3000
const listener = (): void => {
        console.log(`starting app on port: ${port}`)
}

app.use(bodyParser.json())

handle(app)

app.listen(port, listener)