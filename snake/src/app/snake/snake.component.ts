import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.css']
})
export class SnakeComponent implements OnInit, OnDestroy {

  @ViewChild('canvas', {static: true}) private c: ElementRef;

  public snakeList: Array<SnakeItem> = [];

  private timeSubscription: Subscription; //定时器
  private keyboardSubscription: Subscription; // 键盘监听

  public time: number = 0; // 时间

  public suspendTime: number; // 暂停时间

  public score: number = 0; // 得分

  public startOrReset = '开始';

  public currentDirectionArr: Array<number> = [0, 24]; // 当前控制方向 ：x和y分别加上这个数组的元素

  public canvas: any;

  constructor() {
  }

  ngOnInit() {
    this.listenKeyboard(); // 注册键盘监听

    this.snakeList = [];
    this.snakeList.push({x: 4, y: 4, w: 16, h: 16, directionArr: [0, 24]});
    this.snakeList.push({x: 4, y: 28, w: 16, h: 16, directionArr: [0, 24]});
    this.currentDirectionArr = [0, 24];


    this.canvas = this.c.nativeElement.getContext('2d');
    // 规律是+24
    this.canvas.fillStyle = 'orange';
    this.canvas.fillRect(4, 4, 16, 16);
    this.canvas.fillStyle = 'black';
    this.canvas.fillRect(4, 28, 16, 16);
  }

  ngOnDestroy(): void {
  }

  /**
   * 开始
   */
  public onStart(startOrReset: string) {
    this.timeSubscription && this.timeSubscription.unsubscribe();
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
    this.timeSubscription = timer(1000, 1000).subscribe(sec => {
      this.refreshCanvas();
      this.time = startOrReset !== '继续' ? sec + 1 : sec + this.suspendTime + 1;
    });
  }

  /**
   * 暂停
   */
  public onSuspend() {
    this.suspendTime = this.time;
    this.timeSubscription.unsubscribe();
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
   * 清楚画布
   */
  public clearCanvas() {
    this.canvas.clearRect(0, 0, 600, 600);
  }

  /**
   * 刷新画布,每秒一次,更新位置
   * 原理：遍历元素，最后一个元素（头部）方向由this.currentDirectionArr控制，
   * 其他的元素（身体）由前一个元素的directionArr控制
   */
  public refreshCanvas() {
    this.clearCanvas();
    for (let i = 0; i < this.snakeList.length; i++) {
      if (i === this.snakeList.length - 1) { // 判断是否是头部
        this.drawNewRect(this.snakeList[i].x + this.currentDirectionArr[0],
          this.snakeList[i].y + this.currentDirectionArr[1], true);
        this.snakeList[i].directionArr = this.currentDirectionArr;
        this.snakeList[i].x = this.snakeList[i].x + this.currentDirectionArr[0];
        this.snakeList[i].y = this.snakeList[i].y + this.currentDirectionArr[1];
      } else {
        this.drawNewRect(this.snakeList[i].x + this.snakeList[i + 1].directionArr[0],
          this.snakeList[i].y + this.snakeList[i + 1].directionArr[1], false);
        this.snakeList[i].directionArr = this.snakeList[i + 1].directionArr;
        this.snakeList[i].x = this.snakeList[i].x + this.snakeList[i + 1].directionArr[0];
        this.snakeList[i].y = this.snakeList[i].y + this.snakeList[i + 1].directionArr[1];
      }
    }
  }

  /**
   * 键盘事件
   */
  public onKeyDown(key: string) {
    // 转向逻辑
    if (this.currentDirectionArr.toString() === [-24, 0].toString() ||
      this.currentDirectionArr.toString() === [24, 0].toString()) {
      if (key === 'ArrowUp') {
        this.currentDirectionArr = [0, -24];
      } else if (key === 'ArrowDown') {
        this.currentDirectionArr = [0, 24];
      } else {
        return;
      }
    } else {
      if (key === 'ArrowRight') {
        this.currentDirectionArr = [24, 0];
      } else if (key === 'ArrowLeft') {
        this.currentDirectionArr = [-24, 0];
      } else {
        return;
      }
    }
  }

  /**
   * 键盘监听
   */
  private listenKeyboard() {
    this.keyboardSubscription && this.keyboardSubscription.unsubscribe();
    this.keyboardSubscription = fromEvent(window, 'keydown').subscribe((event: any) => {
      this.onKeyDown(event.key);
    });
  }

}

class SnakeItem {
  x: number;
  y: number;
  w: number;
  h: number;
  directionArr: Array<number> = [0, 24];
}
