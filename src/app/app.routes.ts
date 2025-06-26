import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth/auth.guard'
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DashboardHomeComponent } from './features/dashboard-home/dashboard-home.component';
import { TasksComponent } from './features/tasks/tasks.component';
import { TeamComponent } from './features/team/team.component';
import { SignupComponent } from './features/auth/signup/signup.component';

export const routes: Routes = [
    {path:'', component: HomeComponent}, // default route
    {path:'login', component: LoginComponent},
    {path:'signup', component: SignupComponent},
    {path:'', component: DashboardComponent, 
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: DashboardHomeComponent },
            { path: 'tasks', component: TasksComponent },
            { path: 'team', component: TeamComponent },
        ],
    }
];
