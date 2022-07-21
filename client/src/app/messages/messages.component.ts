import { AuthService } from './../services/auth.service';
import { ChatService } from './../services/chat.service';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  clickedUser: string;


  AllUsersOnline = [];
  historyMessages = [];
  chatHistory = [];
  showHistory = false;
  user = '';
  room: string;
  messageText: string;
  messageArray: Array<{_id?:string ,userId?:string, name?:string, userName?: string,email?:string, message?: string, time?: string, toUser?:string}> = [];
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
  newMsg:any;
  userDetails: any;
  showMessage: boolean = false;
  lastInsertedMsg:any;

  constructor(private cdref: ChangeDetectorRef ,private chatService: ChatService, private router: Router, public authService: AuthService) {
  this.chatService.newMessageReceived()
  .subscribe(async data => {
    this.clickedUser =  sessionStorage.getItem('userId');

    if (data.userId == '626980f33808d1c41ba27690' && data.toUser == this.clickedUser  || data.userId == '626980f33808d1c41ba27690' && data.toUser == this.connectedUser._id || data.userId == this.clickedUser && data.toUser == '626980f33808d1c41ba27690'  || data.userId == this.connectedUser._id && data.toUser == '626980f33808d1c41ba27690' ) {
    console.log({data});

    this.lastInsertedMsg = await this.chatService.getLastMsg();
      if (this.messageArray.find(p => p._id === this.lastInsertedMsg._id) === undefined) {
        this.messageArray.push(this.lastInsertedMsg);
    }

    }

    this.messageText = '';
  });

  this.chatService.allChat()
  .subscribe( data => this.chatHistory = data);

   }



  async ngOnInit() {
    sessionStorage.clear();
    this.connectedUser = this.authService.getUser();     
    this.username = this.connectedUser.firstName;
    this.name = this.connectedUser.userName;
    if(this.connectedUser.role === 'user'){
    this.getMessagesUser(this.connectedUser._id);
    }

    if (this.connectedUser.role === "admin") {
      this.usersList = await this.chatService.getUsersList();
      
      const indexToDelete = this.usersList.findIndex(t => t._id.userId == "626980f33808d1c41ba27690");
      console.log({indexToDelete});
      if(indexToDelete >=0) {
      this.usersList.splice(indexToDelete, 1);
      }

    }

   if (this.name === this.connectedUser.userName) {
    this.showMessageForUser = true;
   }
   
    
  }

  
   
  // sendMessage(event) {
  //   console.log(event)
  //   const date = new Date().toDateString();
  //   const time = new Date().toTimeString().split(' ')[0];
  //   // this.chatService.sendMessage({userName: this.name, message: this.messageText, date: date, time: time});
  //   if (this.connectedUser.role == 'user') {
  //     console.log(this.connectedUser.role);
      
  //   this.chatService.sendMessage({userId :this.connectedUser._id,name: this.connectedUser.firstname,userName: this.name,email: this.connectedUser.email , message: this.messageText, date: date, time: time,toUser: "626980f33808d1c41ba27690"});
  //   }
  //   if (this.connectedUser.role == 'admin') {
  //     console.log(this.connectedUser.role);

  //   this.chatService.sendMessage({userId :this.connectedUser._id,name: this.connectedUser.firstname,userName: this.name,email: this.connectedUser.email , message: this.messageText, date: date, time: time,toUser: this.clickedUser});
  //   }

      
  //   this.addMessage();
  // }



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
    // this.chatService.sendMessage({userName: this.name, message: this.messageText, date: date, time: time});

    // this.chatService.sendMessage({userId :this.connectedUser._id,name: this.connectedUser.firstname,userName: this.name,email: this.connectedUser.email , message: this.messageText, date: date, time: time,toUser: "626980f33808d1c41ba27690"});
    if (this.connectedUser.role == 'user') {
      console.log(this.connectedUser.role);
      
    this.chatService.sendMessage({userId :this.connectedUser._id,name: this.connectedUser.firstname,userName: this.name,email: this.connectedUser.email , message: this.messageText, date: date, time: time,toUser: "626980f33808d1c41ba27690"});
    }
    if (this.connectedUser.role == 'admin') {
      console.log(this.connectedUser.role);
      this.clickedUser =  sessionStorage.getItem('userId');

    this.chatService.sendMessage({userId :this.connectedUser._id,name: this.connectedUser.firstname,userName: this.name,email: this.connectedUser.email , message: this.messageText, date: date, time: time,toUser: this.clickedUser});
    }



    this.addMessage();
    // this.showTypingPara = false;
    }
    // this.chatService.typing({userName: this.name});
   
  }

  // ADD NEW MESSAGE
  addMessage() {
    const date1 = new Date().toDateString();
    const time1 = new Date().toTimeString().split(' ')[0];
    
    if (this.connectedUser.role === 'user'){
    this.newMsg = {
      userId :this.connectedUser._id,
      name: this.connectedUser.firstname,
      userName: this.name ,
      email: this.connectedUser.email ,
      message: this.messageText,
      date: date1,
      time: time1,
      toUser: "626980f33808d1c41ba27690"
    };
  }
      
   
  if (this.connectedUser.role === 'admin'){
    this.clickedUser =  sessionStorage.getItem('userId');
    
    this.newMsg = {
      userId :this.connectedUser._id,
      name: this.connectedUser.firstname,
      userName: this.name ,
      email: this.connectedUser.email ,
      message: this.messageText,
      date: date1,
      time: time1,
      toUser: this.clickedUser,
    };
  }
console.log('this.newMsg  ', this.newMsg);

    // if (this.connectedUser.userName !== newMsg.userName || this.connectedUser.role !=='admin') {
    //   return;
    // }
    this.chatService.saveMessage(this.newMsg)
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

  // GET MESSAGE FOR USER WHEN HIS ROLE IS USER DIRECTLY WHEN PAGE LOADED
  getMessagesUser(userId) {
    
    this.chatService.allMessages(userId)
    .subscribe(
      res => { 
      
        this.historyMessages = res;
        console.log(this.historyMessages);
        
             },
      err => { console.log(err); }
    );
  }


  // GET MESSAGE OF USER WHEN THE USER IS ADMIN
 async getMessages(e: Event) {
  sessionStorage.clear();
  this.messageArray =[];
  // get the username from html
    const userName = (e.target as any).innerHTML;
    //   get the user Id and store in sessionStorage

    this.userDetails = await this.authService.getUserDetail(userName);

    console.log('this.userDetails._id    ', this.userDetails._id);
    
    sessionStorage.setItem('userId',this.userDetails._id);

    this.chatService.allMessages(this.userDetails._id)
    .subscribe(
      res => { 
        this.historyMessages = res;
        console.log(this.historyMessages);
             },
      err => { console.log(err); }
    );
  }

// background color for selected username 
  getStyle(userId) {
   const userFromStorage = sessionStorage.getItem('userId');

    if (userId === userFromStorage) {
        return "blue";
    } else {
        return "";
    }
}

  // to solver error  NG0100
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

F
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
