import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public date: string;
  
  constructor() {
    this.date = this.getCurrentDate();
   }

  ngOnInit(): void {
  }


  private getCurrentDate(): string {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const monthIndex = now.getMonth();
    const year = now.getFullYear();
    return months[monthIndex] + " " + year;
}



}
