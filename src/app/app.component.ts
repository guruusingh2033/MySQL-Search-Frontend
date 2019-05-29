import { Component } from '@angular/core';
import { AuthenticationService } from './_services/authentication.service'

@Component({
    selector: 'app',
    templateUrl: 'app.component.html'
})

export class AppComponent 
{
    constructor(private auth: AuthenticationService) { }

}