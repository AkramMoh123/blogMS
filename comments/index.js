const express = require('express')
const {randomBytes} = require('crypto')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())
app.use(cors())

let commentsByPostId = {}

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || [])
})

app.post('/posts/:id/comments', async (req, res) => {
    let comments = commentsByPostId[req.params.id] || []
    const { content } = req.body;
    const commentId = randomBytes(4).toString('hex')

    comments.push({
        id: commentId,
        content
    })

    await axios.post('http://localhost:4005/events', {
        type: 'commentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id
        }
    })

    commentsByPostId[req.params.id] = comments

    res.status(201).send(comments)
})

app.post('/events', (req, res) => {
    console.log('Event received of type', req.body.type)
    res.send({})
})

app.listen(4001, () => {
    console.log('Listening on port 4001')
})