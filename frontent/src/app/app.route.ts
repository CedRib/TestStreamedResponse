import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: 'app-root', component: AppComponent },
  { path: '', redirectTo: '/app-root', pathMatch: 'full' },
  { path: '**', redirectTo: '/app-root', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
