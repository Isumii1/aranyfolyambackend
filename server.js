const { config } = require('./config/dotenvConfig')
const app = require('./app')

const PORT = config.PORT
const HOST = '192.168.9.113'

app.listen(PORT, HOST, () => {
    console.log(`Szerver IP: http://${HOST}:${PORT}`)
})