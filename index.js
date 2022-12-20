import app from './server.js'

const port = 80;


app.listen(port, () => {
    console.log(`listening to localhost:${port}`)
}) 