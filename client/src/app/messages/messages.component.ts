import { UserModel } from 'src/app/models/user.model';
import { AuthService } from './../services/auth.service';
import { ChatService } from './../services/chat.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ItemModel } from '../models/item.model';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  msgToSend: string = "";
  messages: string[]= [];



  AllUsersOnline = [];
  historyMessages = [];
  chatHistory = [];
  showHistory = false;
  user = '';
  room: string;
  messageText: string;
  messageArray: Array<{userName: string, message: string, time: string}> = [];
  historyArray: ItemModel[] = [];
  typingShow = {};
  name = '';
  username = '';
  showJoin = false;
  showTypingPara = false;
  @ViewChild('chatWindow') chatWindow: ElementRef;
  connectedUser : any;
  usersList: any;

  showMessageForUser:boolean =false;

  constructor(private chatService: ChatService, private router: Router, public authService: AuthService) {
 
  this.chatService.newMessageReceived()
  .subscribe(data => {
    this.messageArray.push(data);
    this.typingShow = {};
    this.messageText = '';
  });

  this.chatService.userTyping()
  .subscribe(data => this.typingShow = data);

  this.chatService.allChat()
  .subscribe( data => this.chatHistory = data);

   }

  async ngOnInit() {
    this.connectedUser = this.authService.getUser();     
    this.username = this.connectedUser.firstName;
    this.name = this.connectedUser.userName;
    if(this.connectedUser.role === 'user'){
    this.getMessages(this.connectedUser._id);
    }
console.log(this.connectedUser.role);


    if (this.connectedUser.role === "admin") {
      this.usersList = await this.chatService.getUsersList();
      console.log(this.usersList);
      
    }

    console.log(this.name);
    console.log(this.connectedUser.userName);
    
console.log((this.name === this.connectedUser.userName));

   if (this.name === this.connectedUser.userName) {
    this.showMessageForUser = true;
   }
   
    
  }
  
   
  sendMessage(event) {
    console.log(event)
    const date = new Date().toDateString();
    const time = new Date().toTimeString().split(' ')[0];
    this.chatService.sendMessage({userName: this.name, message: this.messageText, date: date, time: time});
    this.addMessage();
  }

  showTyping(event) {   
    this.showTypingPara = true;
    if(event.code === "Enter"){
    const date = new Date().toDateString();
    const time = new Date().toTimeString().split(' ')[0];
    console.log('name ', this.name);
    // const userId =  this.connectedUser._id
    // if (this.connectedUser.userName !== this.name || this.connectedUser.role !=='admin') {
    //   return;
    // }
    this.chatService.sendMessage({userName: this.name, message: this.messageText, date: date, time: time});

    this.addMessage();
    this.showTypingPara = false;
    }
    this.chatService.typing({userName: this.name});
   
  }

  addMessage() {
    const date1 = new Date().toDateString();
    const time1 = new Date().toTimeString().split(' ')[0];
    
    let newMsg = {
      userId :this.connectedUser._id,
      name: this.connectedUser.firstname,
      userName: this.name ,
      email: this.connectedUser.email ,
      message: this.messageText,
      date: date1,
      time: time1,
      toUser: "626980f33808d1c41ba27690"
    };
      
    // if (this.connectedUser.userName !== newMsg.userName || this.connectedUser.role !=='admin') {
    //   return;
    // }
    this.chatService.saveMessage(newMsg)
    .subscribe(
      res => {
        // console.log('Message saved!!');
            },
      err => {
        console.log('this is error', err);
       }
    );
    this.messageText = "";
  }

  getMessages(userId) {
    console.log({userId});
    
    console.log('z11111111  this.connectedUser._id ', this.connectedUser._id);
    console.log('z11111111  userId ', userId);
    console.log('z11111111  this.connectedUser.role  ', this.connectedUser.role);
    
    // if (this.showMessageForUser || this.connectedUser.role !=='admin') {
    //   return;
    // }
    this.chatService.allMessages(userId)
    .subscribe(
      res => { 
      
        this.historyMessages = res;
        
             },
      err => { console.log(err); }
    );
  }


}
















  // constructor(private chatService : ChatService) { }

  // ngOnInit(): void {
  // }

  
//    connect() {
//     this.chatService.connect((msg: string) => {

//         // Add new message to array: 
//         // const messages = [...this.state.messages];
//         this.messages.push(msg);
//     });
// }

//  disconnect() {
//     this.chatService.disconnect();
// }


//  setMessage(args)  {
//   const msgToSend = (args.target as HTMLInputElement).value;
//   // this.setState({ msgToSend });
// }
  

// send() {
//   this.chatService.send(this.msgToSend);
// }
// }
