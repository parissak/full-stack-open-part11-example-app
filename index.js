const app = require('./app')
const logger = require('./logger')

const http = require('http')
const server = http.createServer(app)
const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
	logger.log(`Server running on port ${PORT}`)
})