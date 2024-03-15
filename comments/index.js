const express = require('express')
const {randomBytes} = require('crypto')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())
app.use(cors())

let commentsByPostId = {}

app.get('/comments/posts', (req, res) => {
    res.send("hi")
})

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || [])
})

app.post('/posts/:id/comments', async (req, res) => {
    let comments = commentsByPostId[req.params.id] || []
    const { content } = req.body;
    const commentId = randomBytes(4).toString('hex')

    comments.push({
        id: commentId,
        content,
        status: 'pending'
    })

    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    })

    commentsByPostId[req.params.id] = comments

    res.status(201).send(comments)
})

app.post('/events', async (req, res) => {
    const {type, data} = req.body
    if(type==='CommentModerated') {
        const {id, postId, status, content} = data
        const comments = commentsByPostId[postId]
        const comment = comments.find(comment => {
            return comment.id = id
        })

        comment.status = status

        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: {
                id, 
                postId,
                status, 
                content
            }
        })
    }
    res.send({})
})

app.listen(4001, () => {
    console.log('Listening on port 4001')
})