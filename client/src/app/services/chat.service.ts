import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { NotifyService } from './notify.service';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    // Client Socket:
    connectedUser: any;
    // Connect to server: 
    constructor(private notify: NotifyService, private http: HttpClient,public authService: AuthService) { }
    private socket = io('http://localhost:3001');

    private user = this.authService.getUser();

    async getUsersList() {
        const usersList = await this.http.get<any>(environment.messageUrl + "by-user/").toPromise();
        return usersList;
    }

    async getLastMsg() {
        const lastMsg = await this.http.get<any>(environment.messageUrl + "lastMsg/").toPromise();
        return lastMsg;
    }

    // save message
    saveMessage(msg) {
        return this.http.post<any>(environment.messageUrl, msg);
    }


    // get all message of user
    allMessages(userId) {
        const msg = this.http.get<any>(environment.messageUrl + "by-user/" + userId);
        return msg;
    }

    sendMessage(data) {
        this.socket.emit('message', data);
    }


    newMessageReceived() {
        // const observable = new Observable<{ userName: string, message: string, date:string ,time: string }>(observer => {
        const observable = new Observable<{
            _id: string, userId: string, name?: string, userName: string, email: string, message: string, time: string, toUser: string
        }>(observer => {
            this.socket.on('new message', async (data) => {

                const clickedUser = sessionStorage.getItem('userId');



                // if (data.userId == '626980f33808d1c41ba27690' && data.toUser == clickedUser) observer.next(data);
                // if (data.userId == '626980f33808d1c41ba27690' && data.toUser == this.user._id) observer.next(data);
                // if ( data.userId == clickedUser && data.toUser == '626980f33808d1c41ba27690') observer.next(data);
                // if (data.userId == this.user._id && data.toUser == '626980f33808d1c41ba27690') observer.next(data);


                if (data.userId == '626980f33808d1c41ba27690' && data.toUser == clickedUser || data.userId == '626980f33808d1c41ba27690' && data.toUser == this.user._id || data.userId == clickedUser && data.toUser == '626980f33808d1c41ba27690' || data.userId == this.user._id && data.toUser == '626980f33808d1c41ba27690') {    
                    observer.next(data);
                }

                if(this.user.role == 'admin' && data.toUser == '626980f33808d1c41ba27690' ) {
                    this.notify.success(` ${data.userName} sent a msg `)
                }
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
                console.log({ data });
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }












}


