import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.css']
})
export class SnakeComponent implements OnInit, OnDestroy {

  @ViewChild('canvas', {static: true}) private c: ElementRef;

  public snakeList: Array<SnakeItem> = []; //蛇身
  public food: SnakeItem = new SnakeItem(); // 食物

  private timeSubscription: Subscription; //定时器
  private keyboardSubscription: Subscription; // 键盘监听

  public time: number = 0; // 时间

  public suspendTime: number; // 暂停时间

  public score: number = 0; // 得分

  public startOrReset = '开始';

  public isGameOver = false;

  public currentDirectionArr: Array<number> = [0, 24]; // 当前控制方向 ：x和y分别加上这个数组的元素

  public canvas: any;

  constructor() {
  }

  ngOnInit() {
    this.listenKeyboard(); // 注册键盘监听

    // 重置所有
    this.snakeList = [];
    this.snakeList.push({x: 4, y: 4, w: 16, h: 16, directionArr: [0, 24]});
    this.snakeList.push({x: 4, y: 28, w: 16, h: 16, directionArr: [0, 24]});
    this.currentDirectionArr = [0, 24];
    this.score = 0;

    this.canvas = this.c.nativeElement.getContext('2d');
    // 生成初始小蛇 规律是+24
    this.canvas.fillStyle = 'orange';
    this.canvas.fillRect(4, 4, 16, 16);
    this.canvas.fillStyle = 'black';
    this.canvas.fillRect(4, 28, 16, 16);
  }

  ngOnDestroy(): void {
    this.keyboardSubscription.unsubscribe();
    this.timeSubscription.unsubscribe();
  }

  /**
   * 开始
   */
  public onStart(startOrReset: string) {
    this.isGameOver = false;
    this.timeSubscription && this.timeSubscription.unsubscribe();
    this.startOrReset = '重来';
    if (startOrReset !== '继续') {
      this.time = 0;
      this.suspendTime = 0;
      this.clearCanvas();
      this.ngOnInit();
      //生成初始食物
      this.generateFood();
    } else {
      this.time = this.suspendTime;
    }
    // 定时器启动
    this.timeSubscription = timer(1000, 500).subscribe(sec => {
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
    // 清除画布
    this.clearCanvas();

    // 判断是否吃到食物
    if (this.onEatFood()) {
      // 重新随机生成食物
      this.generateFood();
      //加分
      this.score += 10;

      //生成新身体，并放到数组头部
      const addSnakeBody = new SnakeItem();
      //新元素比尾部少一个单位 故减去directionArr
      addSnakeBody.x = this.snakeList[0].x - this.snakeList[0].directionArr[0];
      addSnakeBody.y = this.snakeList[0].y - this.snakeList[0].directionArr[1];
      addSnakeBody.directionArr = this.snakeList[0].directionArr.concat();
      this.snakeList.unshift(addSnakeBody);
    } else {
      // 重画食物,保持食物位置不变
      this.drawNewRect(this.food.x, this.food.y);
    }

    // 蛇身体逻辑,后一位复制前一位属性
    for (let i = 0; i < this.snakeList.length; i++) {
      if (i === this.snakeList.length - 1) { // 判断是否是头部
        this.drawNewRect(this.snakeList[i].x + this.currentDirectionArr[0],
          this.snakeList[i].y + this.currentDirectionArr[1], true);
        this.snakeList[i].directionArr = this.currentDirectionArr.concat();
        this.snakeList[i].x = this.snakeList[i].x + this.currentDirectionArr[0];
        this.snakeList[i].y = this.snakeList[i].y + this.currentDirectionArr[1];
      } else {
        this.drawNewRect(this.snakeList[i].x + this.snakeList[i + 1].directionArr[0],
          this.snakeList[i].y + this.snakeList[i + 1].directionArr[1], false);
        this.snakeList[i].directionArr = this.snakeList[i + 1].directionArr.concat();
        this.snakeList[i].x = this.snakeList[i].x + this.snakeList[i + 1].directionArr[0];
        this.snakeList[i].y = this.snakeList[i].y + this.snakeList[i + 1].directionArr[1];
      }
    }

    //死亡检测
    if (this.checkSnakeDeath()) {
      this.keyboardSubscription.unsubscribe();
      this.timeSubscription.unsubscribe();
      this.isGameOver = true;
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

  /**
   * 食物生成
   */
  public generateFood() {
    // 生成0~24随机整数 确定食物位置
    let randomX;
    let randomY;
    do {
      randomX = Math.floor(Math.random() * 25);
      randomY = Math.floor(Math.random() * 25);
    } while (this.checkFoodPosition(randomX, randomY));
    this.food.x = 4 + randomX * 24;
    this.food.y = 4 + randomY * 24;
    this.drawNewRect(4 + randomX * 24, 4 + randomY * 24);
  }

  //检查食物是否出现在蛇的身体上
  public checkFoodPosition(x, y): boolean {
    for (let i = 0; i < this.snakeList.length; i++) {
      if (this.snakeList[i].x === x && this.snakeList[i].y === y) {
        return true;
      }
    }
    return false;
  }

  /**
   * 检测是否吃到食物
   */
  public onEatFood(): boolean {
    // 蛇头和食物重叠
    if (this.snakeList[this.snakeList.length - 1].x === this.food.x &&
      this.snakeList[this.snakeList.length - 1].y === this.food.y) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 检测死亡 蛇头不能碰壁，不能碰身体
   */
  public checkSnakeDeath() {
    const snakeArr = this.snakeList;
    for (let i = 0; i < snakeArr.length - 1; i++) {
      if (snakeArr[snakeArr.length - 1].x === snakeArr[i].x && snakeArr[snakeArr.length - 1].y === snakeArr[i].y) {
        return true;
      }
    }
    if (snakeArr[snakeArr.length - 1].x > 600 || snakeArr[snakeArr.length - 1].x < 0 ||
      snakeArr[snakeArr.length - 1].y > 600 || snakeArr[snakeArr.length - 1].y < 0) {
      return true;
    }
    return false;
  }
}

class SnakeItem {
  x: number;
  y: number;
  w = 16;
  h = 16;
  directionArr: Array<number> = [0, 24];
}
