import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../_models';
import { Router } from '@angular/router';

@Injectable()
export class AuthenticationService {
    loginUser = new User();
    constructor(private http: HttpClient, private router: Router,) { }

    login(loginData: User) {
        return this.http.post<any>(`${environment.apiUrl}/login`, { organization: loginData.organization, username: loginData.username, password: loginData.password })
            .pipe(map(user => {
                return user;
            }));            
    }

    //logging in user with query string
    loginWithQueryString(loginData: User) {
        return this.http.post<any>(`${environment.apiUrl}/login`, { organization: loginData.organization, username: loginData.username, password: loginData.password })
            .pipe(map(user => {
                return user;
            }));  
    }


    //logging user out
    logout() {
        localStorage.removeItem('currentUser');
        this.router.navigate(['']);
    }

    //login checker
    loginCheck()
    {
        if (localStorage.getItem('currentUser'))
        {
        return true
        }
        else
        {
            return false
        }
    }
}