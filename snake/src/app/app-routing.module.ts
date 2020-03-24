import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '', component: AppComponent, children: [
      {
        path: '',
        redirectTo: 'snake',
        pathMatch: 'full'
      },
      {
        path: 'snake',
        loadChildren: () =>
          import('./snake/snake.module').then(m => m.SnakeModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
