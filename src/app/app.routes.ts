import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth/auth.guard'
import { AuthComponent } from './features/auth/auth/auth.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DashboardHomeComponent } from './features/dashboard-home/dashboard-home.component';
import { TasksComponent } from './features/tasks/tasks.component';
import { TeamComponent } from './features/team/team.component';

export const routes: Routes = [
    {path:'', component: AuthComponent}, // default route
    {path:'login', component: AuthComponent},
    // {path:'signup', component: SignupComponent},
    {path:'', component: DashboardComponent, 
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: DashboardHomeComponent },
            { path: 'tasks', component: TasksComponent },
            { path: 'team', component: TeamComponent },
        ],
    }
];
