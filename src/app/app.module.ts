import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AlertComponent } from './_directives';
import { AlertService, AuthenticationService, ApiService } from './_services';
import { HomeComponent } from './home';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule, WavesModule } from 'angular-bootstrap-md';


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
        HomeComponent
    ],
    providers: [
        AlertService,
        AuthenticationService,
        ApiService,
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }