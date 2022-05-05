import { NumberSymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-more',
  templateUrl: './view-more.component.html',
  styleUrls: ['./view-more.component.css']
})
export class ViewMoreComponent implements OnInit {
  productID: Number;
  currentProduct: any;

  constructor(private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.productID = this.actRoute.snapshot.params['id'];
  }

}
