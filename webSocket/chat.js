const chat = (io) => {
    let activeUsers = [];

    io.on("connection", (socket) => {
        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });

        socket.on("setup", ({ userId, room }) => {
            socket.join(`${userId}${room}`);
            socket.emit("connected");
        });

        socket.on("new-user-add", (userId, socketId, role) => {
            if (!activeUsers.some((user) => user.userId === userId)) {
                activeUsers.push({ userId, socketId, busy: false, chatCount: 0, role });
            }

            io.emit("get-users", activeUsers);
        });


        socket.on("update-user", (userId, socketId) => {
            const isExist = activeUsers.some(user => user.userId === userId);

            if (isExist) {
                activeUsers = activeUsers
                    .map((user) => user?.userId === userId ? { ...user, socketId: socketId } : user);
            }

            console.log("updated User: ", activeUsers)
        });


        socket.on("send-chat", (data, userId, room) => {
            let currUser;
            const freeUsers = activeUsers.filter((user) => !user.busy && user.role === room);
            const busyUsers = activeUsers.filter((user) => user.busy && user.role === room);

            const mostFreeUser = freeUsers.sort((a, b) => a.chatCount - b.chatCount)[0];
            const mostBusyUser = busyUsers.sort((a, b) => a.chatCount - b.chatCount)[0];

            if (mostFreeUser) {
                activeUsers = activeUsers.map((user) =>
                    user?.userId === mostFreeUser?.userId
                        ? currUser = user && { ...user, busy: Boolean(true), chatCount: ++mostFreeUser.chatCount } : user)

            } else {
                activeUsers = activeUsers.map((user) =>
                    user?.userId === mostBusyUser?.userId
                        ? currUser = user && { ...user, busy: true, chatCount: ++mostBusyUser.chatCount } : user)
            }

            if (currUser && data.subject && data.messages.length === 0) {
                // console.log("Admin: ", currUser?.socketId);
                // console.log("in Current Usr: ", currUser.socketId, socket.id)
                io.to(currUser?.socketId).emit("chat-lists", data);
                // socket.to(currUser.userId).emit("receive-chat", data, wsId);
                // socket.in(room).emit("chat-lists", data);
                // io.to(currUser.socketId).emit("receive-message", data, wsId);
                // socket.to(currUser.socketId).emit("receive-message", data, wsId);
            }
        });

        socket.on("send-message", (data, { userId, room }) => {
            // console.log("send-message", data.text, `${userId}${room}`);
            socket.in(`${userId}${room}`).emit("receive-message", data);
        })

        socket.on("emit-typing", ({ userId, room }) => socket.to(`${userId}${room}`).emit("typing"));
        socket.on("stop-typing", ({ userId, room }) => socket.to(`${userId}${room}`).emit("stop-type"));

        socket.on("close-chat", ({ userId, room }) => {
            io.in(`${userId}${room}`).emit("close-chat-box")
        });

        socket.on("disconnect", () => {
            console.log("left", socket.id);
            activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
            io.emit("get-users", activeUsers);
        });
    });
}

export default chat;