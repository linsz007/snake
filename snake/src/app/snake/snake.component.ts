import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.css']
})
export class SnakeComponent implements OnInit {

  @ViewChild('canvas', {static: true}) private c: ElementRef;

  public canvas: any;

  constructor() {
  }

  ngOnInit() {
    this.canvas = this.c.nativeElement.getContext('2d');
    console.log(this.canvas);
    // 规律是+24
    this.canvas.fillStyle = 'orange';
    this.canvas.fillRect(4, 4, 16, 16);
    this.canvas.fillRect(4, 28, 16, 16);
    this.canvas.fillRect(4, 52, 16, 16);
  }

}
