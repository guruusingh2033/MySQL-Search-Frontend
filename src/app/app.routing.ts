import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: ':organization/:username/:password', component: HomeComponent },
    { path: ':organization/:username', component: HomeComponent },
    { path: ':organization', component: HomeComponent },    
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);