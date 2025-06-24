import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth/auth.guard'
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
    {path:'', component: HomeComponent}, // default route
    {path:'login', component: LoginComponent},
    {path:'dashboard', component: DashboardComponent, canActivate: [authGuard]}
];
