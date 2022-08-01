import express from 'express'
import bodyParser from 'body-parser'
import handle from './handlers/_handle'

const app: express.Application = express()

app.use(bodyParser.json())

handle(app)

const port = 3000
app.listen(port, (): void => {
        console.log(`starting app on port: ${port}`)
})