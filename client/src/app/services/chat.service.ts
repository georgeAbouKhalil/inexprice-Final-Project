import { UserModel } from './../models/user.model';
import { environment } from 'src/environments/environment';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    // // Client Socket:
    // private socket: Socket;
    connectedUser: any;
    // Connect to server: 
    constructor(private http: HttpClient, public authService: AuthService) { }
    private socket = io('http://localhost:3001');
    
    private user = this.authService.getUser();


    
    // // Connecting to server: 
    // public connect(): void {
        
        //     // Connect to server: 
        //     this.socket = io("http://localhost:3001");
        
        //     // Listen to new message: 
    //     this.socket.on("msg-added", (msg ) =>{


    //     });


    //     // // Listen to server messages: 
    //     // this.socket.on("msg-from-server", (msg: string) => {

    //     //     // Dispatch msg to Redux (instead the following updateUI) ...

    //     //     // Updating UI: 
    //     //     updateUI(msg);
    //     // });
    // }

    // // Send message to backend: 
    // public send(msg: string): void {
    //     this.socket.emit("msg-from-client", msg);
    // }

    // // Disconnect from server: 
    // public disconnect(): void {
    //     this.socket.disconnect();
    // }


    async getUsersList() {
        const usersList = await this.http.get<any>(environment.messageUrl + "by-user/" ).toPromise();
        return usersList;
    }
    
    // save messagep
    saveMessage(user) {
        return this.http.post<any>(environment.messageUrl, user);
    }
    // get Email Marketing Messages
    allMessages(userId) {
        console.log({ userId });
        // if (this.user._id !==  userId){
        //     return;
        // }
        const msg = this.http.get<any>(environment.messageUrl + "by-user/" + userId);
        // console.log({ msg });

        return msg;
    }

    sendMessage(data) {       
        console.log({data});
        
        // if (this.user.userName !== data.userName ){
        //     return;
        // }
        this.socket.emit('message', data);
    }
    newMessageReceived() {
                

        const observable = new Observable<{ userName: string, message: string, date:string ,time: string }>(observer => {
            this.socket.on('new message', (data) => {
                // if (this.user.role !== 'admin' && this.user.userName !== data.userName ){
                //     return;
                // }
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }
    typing(data) {
        this.socket.emit('typing', data);
    }

    userTyping() {
        const observable = new Observable<{ userName: string, message: string }>(observer => {
            this.socket.on('user typing', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    allChat() {
        const observable = new Observable<any>(observer => {
            this.socket.on('chat history', (data) => {
                console.log(this.user);
                console.log({data});
                
                // if (this.user.role !== 'admin' && this.user.userName !== data.userName ){
                //     return;
                // }
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }


}


