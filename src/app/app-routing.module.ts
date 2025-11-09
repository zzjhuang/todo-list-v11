import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
const routes: Routes = [
  { path: '', redirectTo: '/todo', pathMatch: 'full' },
  //直接加載
  { path: 'todo/:username', component: TodoComponent },
  { path: 'todo', component: TodoComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  //懶加載寫法
  // {path:'todo', loadChildren: () => import('./todo/todo.module').then(m => m.TodoModule)},
  //                                                                ↑ =.then(({TodoModule}) => TodoModule)
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
