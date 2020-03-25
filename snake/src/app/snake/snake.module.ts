import { NgModule } from '@angular/core';
import { SnakeComponent } from './snake.component';
import { RouterModule } from '@angular/router';
import { ShareModule } from '../../share/share.module';

const routes = [
  {
    path: '',
    component: SnakeComponent
  }
];

@NgModule({
  declarations: [SnakeComponent],
  imports: [RouterModule.forChild(routes), ShareModule]
})
export class SnakeModule {
}
