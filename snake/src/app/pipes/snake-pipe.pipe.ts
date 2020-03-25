import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'snakePipe'
})
export class SnakePipePipe implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    if (value < 60) {
      return value < 10 ? '00:0' + value : '00:' + value;
    } else {
      let min: any;
      let sec: any;
      min = parseInt((value / 60).toString());
      sec = value % 60;
      min = (min < 10 ? '0' + min : min);
      sec = (sec < 10 ? '0' + sec : sec);
      return min + ':' + sec;
    }
  }

}
