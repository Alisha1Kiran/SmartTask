import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
    {path:'', component: HomeComponent}, // default route
    {path:'login', component: LoginComponent}
];
