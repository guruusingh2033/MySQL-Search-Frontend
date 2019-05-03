import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AlertComponent } from './_directives';
import { AuthGuard } from './_guards';
import { AlertService, AuthenticationService, ApiService } from './_services';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule, WavesModule } from 'angular-bootstrap-md';
import { HeaderComponent } from './header';


@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        MatTableModule,
        BrowserAnimationsModule,
        MatPaginatorModule,
        ChartsModule, 
        WavesModule,
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        HeaderComponent
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        ApiService,
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }