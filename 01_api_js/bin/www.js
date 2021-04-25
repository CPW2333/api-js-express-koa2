const http = require('http')
const {
    serverHandle
} = require('../app')

const PORT = 4568

const server = http.createServer(serverHandle)

server.listen(PORT, () => {
    console.log('http://127.0.0.1:4568');
})