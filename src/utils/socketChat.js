import messageModel from "../dao/mongo/models/messsage.model.js"

const socketChat = async(io) => {
    let logs = []

    io.on('connection', socket => {
        socket.on("message", data => {
            const newMessage = {email: data.email, content: data.message, createdAt: data.createdAt}
            logs.push(newMessage)
            messageModel.create(newMessage)
            io.emit('log', {logs})
        })
    })
}

export default socketChat