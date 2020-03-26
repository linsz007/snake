import { NgModule } from '@angular/core';
import { SnakeComponent } from './snake.component';
import { RouterModule } from '@angular/router';
import { ShareModule } from '../../share/share.module';
import { CommonModule } from '@angular/common';

const routes = [
  {
    path: '',
    component: SnakeComponent
  }
];

@NgModule({
  declarations: [SnakeComponent],
  imports: [RouterModule.forChild(routes), ShareModule, CommonModule]
})
export class SnakeModule {
}
