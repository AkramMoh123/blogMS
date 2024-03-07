const express = require('express')
const bodyParser = require('body-parser')
const cors = require ('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())

let posts = {}

app.get('/posts', (req, res) => {
    res.send(posts)
})

app.post('/events', (req, res) => {
    const {type, data} = req.body;
    if (type === 'PostCreated') {
        const {id, title} = data
        posts[id] = {
            id: id,
            title: title,
            comments: []
        }
    } else {
        const {id, content, postId} = data
        let post = posts[postId]
        post.comments.push({
            id: id,
            content: content
        })
    }

    console.log(posts)

    res.send({})
})

app.listen(4002, () => {
    console.log('Listening on port 4002')
})