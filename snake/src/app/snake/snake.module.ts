import { NgModule } from '@angular/core';
import { SnakeComponent } from './snake.component';
import { RouterModule } from '@angular/router';

const routes = [
  {
    path: '',
    component: SnakeComponent
  }
];

@NgModule({
  declarations: [SnakeComponent],
  imports: [RouterModule.forChild(routes)]
})
export class SnakeModule {
}
