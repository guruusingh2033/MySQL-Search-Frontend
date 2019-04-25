import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../_models'

@Injectable()
export class AuthenticationService {
    loginUser = new User();
    constructor(private http: HttpClient) { }

    login(loginData: User) {
        return this.http.post<any>(`${environment.apiUrl}/login`, { organization: loginData.organization, username: loginData.username, password: loginData.password })
            .pipe(map(user => {
                console.log(user)
                if (user.length) {                    
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            }));            
    }

    logout() {
        localStorage.removeItem('currentUser');

    }
}