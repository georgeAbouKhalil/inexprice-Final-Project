import { Component, OnInit } from '@angular/core';
import { Subscription , interval } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private subscription: Subscription;
  constructor() { }

  public dateNow = new Date('Mar 19 2022 23:07:00');
  public dDay = new Date(this.dateNow.getTime() + (30 * 24 * 60 * 60 * 1000));
  
  public timeDifference;
  public seconds;
  public minutes;
  public hours;
  public days;


  private getTimeDifference () {
    this.timeDifference = this.dDay.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
}

private allocateTimeUnits (timeDifference) {
    this.seconds = Math.floor((timeDifference) / (1000) % 60);
    this.minutes = Math.floor((timeDifference) / (1000 * 60) % 60);
    this.hours = Math.floor((timeDifference) / (1000 * 60 * 60) % 24);
    this.days = Math.floor((timeDifference) / (1000 * 60 * 60 * 24));
}
  

  ngOnInit(): void {
    this.getTimeDifference(); 

    this.subscription = interval(1000).subscribe(x => { 
        this.getTimeDifference(); 
        if( this.days < 0 && this.hours < 0 && this.minutes < 0 && this.seconds < 0){
        this.dateNow = new Date(this.dateNow.getTime() + (30 * 24 * 60 * 60 * 1000));
        this.dDay = new Date(this.dateNow.getTime() + (30 * 24 * 60 * 60 * 1000));

        this.getTimeDifference();  
      }
        });
}

ngOnDestroy() {
  this.subscription.unsubscribe();
  }

}