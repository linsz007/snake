import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnakePipePipe } from '../app/pipes/snake-pipe.pipe';

@NgModule({
  declarations: [
    SnakePipePipe
  ],
  exports: [SnakePipePipe],
  imports: [
    CommonModule
  ]
})
export class ShareModule {
}
