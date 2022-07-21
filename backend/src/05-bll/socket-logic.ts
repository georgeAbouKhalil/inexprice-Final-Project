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

        socket.on('message', async function(data) {
            socketIoServer.emit('new message', {userId: data.userId, name:data.name,email: data.email, userName: data.userName, message: data.message, date: data.date ,  time: data.Time , toUser: data.toUser}); 
            
          });
          
        //   socket.on('typing', function(data) {      
        //     socket.emit('user typing', {userName: data.userName, message:'is typing ...!!'});
          
        //   });


        // Listen to client disconnections: 
        socket.on("disconnect", () => {
            console.log("Client has been disconnect.");
        });

    });

   
}


// export default socketLogic;
export default { 
    socketIo,

}