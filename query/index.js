const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require ('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())

let posts = {}

const eventHandler = (type, data) => {
    if (type === 'PostCreated') {
        const {id, title} = data
        posts[id] = {
            id: id,
            title: title,
            comments: []
        }
    } 
    if(type === 'CommentCreated') {
        const {id, content, postId, status} = data
        let post = posts[postId]
        post.comments.push({
            id: id,
            content: content,
            status: status
        })
    }

    if (type === 'CommentUpdated') {
        const {id, content, postId, status} = data
        const post = posts[postId]
        const comment = post.comments.find(comment => {
            return comment.id === id
        })

        comment.content = content
        comment.status = status
    }
}

app.get('/posts', (req, res) => {
    res.send(posts)
})

app.post('/events', (req, res) => {
    const {type, data} = req.body;
    
    eventHandler(type, data)

    console.log(posts)

    res.send({})
})

app.listen(4002, async () => {
    console.log('Listening on port 4002')

    const res = await axios.get('http://event-bus-srv:4005/events')
    const events = res.data

    for (let event of events) {
        eventHandler(event.type, event.data)
        
    }
})