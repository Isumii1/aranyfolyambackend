const { config } = require('./config/dotenvConfig')
const app = require('./app')

const PORT = config.PORT
const HOST = 'localhost'

app.listen(PORT, HOST, () => {
    console.log(`Szerver IP: http://${HOST}:${PORT}`)
})