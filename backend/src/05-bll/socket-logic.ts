import { MessageModel } from './../03-models/message-model';
import { Server as HttpServer } from "http";
import { Server as SocketIoServer, Socket } from "socket.io";

let socketIoServer : SocketIoServer;

function socketIo(httpServer: HttpServer): void {
    
    const options = {
        cors: { origin: "*" }
    };
    
    socketIoServer = new SocketIoServer(httpServer, options);

    // Listen to client connections: 
    socketIoServer.sockets.on("connection", (socket: Socket) => {

        console.log("Client has been connected.");

        // socket.on('chat', (data) => {
        //     socketIoServer.sockets.emit('chat', data);
        // })


        // socket.on('typing', (data) => {
        //     socket.broadcast.emit('typing', data);
        // });



        socket.on('message', function(data) {
            // var d = new Date();
            // socketIoServer.in(data.userName).emit('new message', {userName: data.userName, message: data.message, date: data.date ,  time: data.Time}); 
            socketIoServer.emit('new message', {userName: data.userName, message: data.message, date: data.date ,  time: data.Time}); 

          });
          
          socket.on('typing', function(data) {                                         
            // socket.broadcast.to(data.userName).emit('user typing', {user: data.userName, message:' is typing ...!!'});
            // socket.broadcast.emit('user typing', {userName: data.userName, message:'is typing ...!!'});
            socket.emit('user typing', {userName: data.userName, message:'is typing ...!!'});
            // socket.broadcast.emit('typing', data);
          
          });

        
        // // Listen to message from a client: 
        // socket.on("msg-from-client", (msg: string) => {

        //     console.log(msg);

        //     // All connected sockets - send that message to them all: 
        //     socketIoServer.sockets.emit("msg-from-server", msg);

        // });

        // Listen to client disconnections: 
        socket.on("disconnect", () => {
            console.log("Client has been disconnect.");
        });

    });

   
}

// function newMessage( message ): void {
//     socketIoServer.sockets.emit("msg-added", message);
// }


// export default socketLogic;
export default { 
    socketIo,
    // newMessage
}