import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    // Client Socket:
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
    saveMessage(msg) {      
        return this.http.post<any>(environment.messageUrl, msg);
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
        
        this.socket.emit('message', data);
    }


    newMessageReceived() {
        // const observable = new Observable<{ userName: string, message: string, date:string ,time: string }>(observer => {
        const observable = new Observable<{ userId:string, name?:string, userName: string,email:string, message: string, time: string, toUser:string }>(observer => {
            this.socket.on('new message', (data) => {
                console.log('111 ' ,data);
                
                // console.log((this.user._id !== data.userId && data.toUser !== '626980f33808d1c41ba27690') || (data.userId !== '626980f33808d1c41ba27690' && data.toUser !== this.user._id));
  
                
                console.log(this.user._id , data.userId , data.toUser);

                // if(this.user.role == 'user') {
                //     if ((this.user._id != data.userId && data.toUser != '626980f33808d1c41ba27690')) {
                //         console.log(this.user._id != data.userId && data.toUser != '626980f33808d1c41ba27690');
                        
                //     if ((data.userId == '626980f33808d1c41ba27690' && data.toUser == this.user._id)) {
                //         console.log(data.userId == '626980f33808d1c41ba27690' && data.toUser == this.user._id);
                        
                //         observer.next(data);
    
                //     }
                //     }
                // }
                


                // if(this.user.role == 'user') {
                //     if ((this.user._id == data.userId || data.toUser ==this.user._id)) {
                //         console.log(this.user._id == data.userId || data.toUser ==this.user._id);
                //         observer.next(data);
                //     }
                // }
                


                // if (this.user.role == 'admin') {

                //     if ((data.userId == '626980f33808d1c41ba27690' || data.toUser == '626980f33808d1c41ba27690')) {
                //         console.log(data.userId == '626980f33808d1c41ba27690' || data.toUser == '626980f33808d1c41ba27690');
                     
                //             observer.next(data);
        
                        
                //         }
                // }



                // if (this.user.role == 'admin') {

                //     if ((data.userId != '626980f33808d1c41ba27690' && data.toUser != this.user._id)) {
                //         console.log(data.userId != '626980f33808d1c41ba27690' && data.toUser != this.user._id);
                //     if ((this.user._id == data.userId && data.toUser == '626980f33808d1c41ba27690')) {
                //         console.log(this.user._id == data.userId && data.toUser == '626980f33808d1c41ba27690');
                                                
                //             observer.next(data);
        
                //         }
                //         }
                // }

// console.log('1   ', this.user.userName == data.userName && data.toUser == '626980f33808d1c41ba27690') 
// console.log(this.user.userName , data.userName , data.toUser );

const clickedUser =  sessionStorage.getItem('userId');
console.log('1   ',data.userId == '626980f33808d1c41ba27690' && data.toUser == clickedUser);
console.log(data.userId , data.toUser ,clickedUser );
                

console.log('2   ',data.userId == '626980f33808d1c41ba27690' && data.toUser == this.user._id);
console.log(data.userId , data.toUser , this.user._id );

console.log('3   ', data.userId == clickedUser && data.toUser == '626980f33808d1c41ba27690')
console.log('4   ', data.userId == this.user._id && data.toUser == '626980f33808d1c41ba27690')

console.log({clickedUser});




                // if ((this.user.userName == data.userName && data.toUser == '626980f33808d1c41ba27690') || (data.userId == '626980f33808d1c41ba27690' && data.toUser == this.user._id)){
// if (this.user.userName == data.userName && data.toUser == '626980f33808d1c41ba27690') observer.next(data);

if (data.userId == '626980f33808d1c41ba27690' && data.toUser == clickedUser) observer.next(data);
if (data.userId == '626980f33808d1c41ba27690' && data.toUser == this.user._id) observer.next(data);
if ( data.userId == clickedUser && data.toUser == '626980f33808d1c41ba27690') observer.next(data);
if (data.userId == this.user._id && data.toUser == '626980f33808d1c41ba27690') observer.next(data);

                // observer.next(data);}
                // if (this.user.userName !== data.userName && data.toUser !== '626980f33808d1c41ba27690' || data.userId !== '626980f33808d1c41ba27690' && data.toUser !== this.user._id){
                // if (this.user.userName !== data.userName ||  data.toUser !== this.user._id){
            
                // if (this.user.role !== 'admin' && this.user.userName !== data.userName ){
                //     return;
                // }


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


