import { Component, OnInit } from '@angular/core';
import { AuthenticationService} from '../_services/authentication.service'
import { Router } from '@angular/router';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {    

    constructor(
        private authService: AuthenticationService,
        private router: Router,
        ) { }

    ngOnInit() {
        
    }

    logout()
    {
        this.authService.logout();
        this.router.navigate(['']);
    }

    
}