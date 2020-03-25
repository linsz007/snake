import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { interval, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.css']
})
export class SnakeComponent implements OnInit {

  @ViewChild('canvas', {static: true}) private c: ElementRef;

  public snakeList: Array<snakeList> = [];

  private timeSubscript: Subscription; //定时器

  public time: number = 0; // 时间

  public suspendTime: number; // 暂停时间

  public score: number = 0; // 得分

  public startOrReset = '开始';

  public direction: Array<number> = [0, 24]; // 控制方向 ：x和y分别加上这个数组的元素

  public canvas: any;

  constructor() {
  }

  ngOnInit() {
    this.snakeList = [];
    this.snakeList.push({x: 4, y: 4, w: 16, h: 16});
    this.snakeList.push({x: 4, y: 28, w: 16, h: 16});


    this.canvas = this.c.nativeElement.getContext('2d');
    // 规律是+24
    this.canvas.fillStyle = 'orange';
    this.canvas.fillRect(4, 4, 16, 16);
    this.canvas.fillStyle = 'black';
    this.canvas.fillRect(4, 28, 16, 16);
  }

  /**
   * 开始
   */
  public onStart(startOrReset: string) {
    this.timeSubscript && this.timeSubscript.unsubscribe();
    this.startOrReset = '重来';
    if (startOrReset !== '继续') {
      this.time = 0;
      this.suspendTime = 0;
      this.clearCanvas();
      this.ngOnInit();
    } else {
      this.time = this.suspendTime;
    }
    // 定时器启动
    this.timeSubscript = timer((startOrReset !== '继续' ? 0 : 1000), 1000).subscribe(sec => {
      this.refreshCanvas();
      this.time = startOrReset !== '继续' ? sec : sec + this.suspendTime + 1;
    });
  }

  /**
   * 暂停
   */
  public onSuspend() {
    this.suspendTime = this.time;
    this.timeSubscript.unsubscribe();
    this.startOrReset = '继续';
  }

  /** 画新矩形
   * @param x,y
   * */
  public drawNewRect(x: number, y: number, isHead = false) {
    if (isHead) {
      this.canvas.fillStyle = 'black';
      this.canvas.fillRect(x, y, 16, 16);
    } else {
      this.canvas.fillStyle = 'orange';
      this.canvas.fillRect(x, y, 16, 16);
    }
  }

  /**
   * 清除矩形
   * @param x,y
   */
  public clearRect(x: number, y: number) {
    this.canvas.clearRect(x, y, 16, 16);
  }

  /**
   * 清楚画布
   */
  public clearCanvas() {
    this.canvas.clearRect(0, 0, 600, 600);
  }

  /**
   * 刷新画布 每秒一次 更新位置
   * @param isContinue:boolean 是否为继续
   */
  public refreshCanvas() {
    this.clearCanvas();
    for (let i = 0; i < this.snakeList.length; i++) {
      if (i === this.snakeList.length - 1) { // 判断是否是头部
        this.drawNewRect(this.snakeList[i].x + this.direction[0],
          this.snakeList[i].y + this.direction[0], true);
      } else {
        this.drawNewRect(this.snakeList[i].x + this.direction[0],
          this.snakeList[i].y + this.direction[0], false);
      }
      this.snakeList[i].x = this.snakeList[i].x + this.direction[0];
      this.snakeList[i].y = this.snakeList[i].y + this.direction[1];
    }
  }

}

class snakeList {
  x: number;
  y: number;
  w: number;
  h: number;
}
