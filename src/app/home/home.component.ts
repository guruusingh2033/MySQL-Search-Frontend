import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService} from '../_services/authentication.service'
import { ApiService } from '../_services/api.service'
import { Router } from '@angular/router';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    currentUser: any;
    organization: any;
    devID: any;
    sources: any;
    displayedColumns: string[] = ['datetime', 'message'];
    public chartType: string = 'bar';
    public chartDatasets: Array<any> = [
        { data: [1, 1, 1, 1, 1, 1, 2], label: 'No. of messages', borderWidth: 1 }
    ];
    public chartLabels: Array<any> = ['2019-04-01T10:21:35.000Z', '2019-04-16T10:21:35.000Z', '2019-04-09T10:21:35.000Z', '2019-04-21T10:21:35.000Z', '2019-04-19T10:21:35.000Z', '2019-04-17T10:21:35.000Z', '2019-04-01T13:21:35.000Z'];
    

    constructor(
        private authService: AuthenticationService,
        private apiService: ApiService,
        private router: Router,
        ) { }

    ngOnInit() 
    {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.organization = this.currentUser[0].org;
        this.getDeviceIdByOrganization();
        }

    //getting devices
    getDeviceIdByOrganization()
    {
        this.apiService.getDeviceIdByOrganization(this.organization)
        .subscribe((res)=>
        {
            this.devID = res.sort();
            this.onDevIdChange(this.devID[0].devID)
        })
    }

    //run when devID change
    onDevIdChange(devID: any)
    {
        this.apiService.getSourceByDevId(devID)
            .subscribe((res) => {
                this.sources = res;
                })

    }

    //time history filter
    timeFilter(time: any)
    {
        switch (time)
        {
            case "1":
            break;

            case "2":
            break;

            case "3":
                break;
            case "4":
                break;
            case "5":
                break;
            case "6":
                break;
        }
    }


    

    // public chartClicked(e: any): void { }
    // public chartHovered(e: any): void { }

    public chartOptions: any = {
        responsive: true,       
        maintainAspectRatio: false, 
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 4

                }
            }]
        }
    };

    
}