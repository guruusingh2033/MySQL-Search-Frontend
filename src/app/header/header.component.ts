import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service'

@Component({
    selector: 'header',
    templateUrl: 'header.component.html'
    })
export class HeaderComponent implements OnInit {
    
    constructor(private auth: AuthenticationService) { }

    ngOnInit() 
    {
        
    }

    // logging user out
    logout()
    {
        this.auth.logout()
    }

    
}