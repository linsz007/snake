import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.css']
})
export class SnakeComponent implements OnInit {

  @ViewChild('canvas', {static: true}) private canvas: ElementRef;

  public ctx: any;

  constructor() {
  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    console.log(this.ctx);
  }

}
