import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService, AlertService } from '../_services'
import { MatPaginator, MatTableDataSource } from '@angular/material';


@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    currentUser: any;
    organization: any;
    devID: any;
    sources: any = [];
    onEventChangeSources: any=[];
    datetimeArray: any = [];
    messageCounter: any = [];
    tableSource: any;
    searchValue: any = '';
    sourceValue: any;
    devIdForSearch: any;
    onLoadSource: any;
    showLoader: boolean = false;
    currentDate: any;
    startDate: any = '';
    endDate: any = '';
    dynamicArray: any = [];
    time_array: any = [];
    displayedColumns: string[] = ['datetime', 'message'];
    public chartType: string = 'bar';
    public chartDatasets: Array<any> = [];
    public chartLabels: Array<any> = [];
    
    @ViewChild(MatPaginator) paginator: MatPaginator;        

    constructor(
        private apiService: ApiService,
        private alertService: AlertService
        ) { }

    ngOnInit() 
    {
        this.defaultDate();
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.organization = this.currentUser[0].org;
        this.getDeviceIdByOrganization(); 
        this.getCurentDate();
        this.oneDayArray();
        }

        defaultDate()
        {
            this.getCurentDate();
            var temp = this.currentDate.setDate(this.currentDate.getDate() - 7);
            this.startDate = new Date(temp);
            this.endDate = new Date(); 
            this.timeHistoryData(this.startDate, this.endDate)           
        }

        chart()
        {
            if (this.chartDatasets.length>0)
            {
            return true
            }
            else{
                return false
            }
        }

        //getting current date
        getCurentDate()
        {
            var today = new Date();
            this.currentDate = today;
        }

    //getting devices
    getDeviceIdByOrganization()
    {
        
        this.apiService.getDeviceIdByOrganization(this.organization)
        .subscribe((res)=>
        {
            this.devID = res.sort();
            // getting source from devID on page load
            this.apiService.getSourceByDevId(this.devID[0].devID)
                .subscribe((res) => {
                    this.sources = res.sort(function (a: any, b: any) { //data sorting
                        var d1: any = new Date(a.datetime);
                        var d2: any = new Date(b.datetime);
                        return d1 - d2;
                    })
                    this.devIdForSearch = this.sources[0].devID;
                    this.sourceValue = this.sources[0].source;
                    this.onLoadSource = this.sources;
                    this.showLoader = false;
                })
        })
    }

    //run when devID change
    onDevIdChange(devID: any)
    {
        this.devIdForSearch = devID;

        this.apiService.getSourceByDevId(devID)
            .subscribe((res) => {

                this.onEventChangeSources = res.sort(function (a:any, b:any) { //data sorting
                    var d1:any  = new Date(a.datetime);
                    var d2:any = new Date(b.datetime);
                    return d1 - d2;                
                })
                this.onLoadSource = this.onEventChangeSources;
                this.sourceValue = this.onEventChangeSources[0].source;
                })
    }

    //data according to time history
    timeHistoryData(startDate: any, endDate: any)
    {
        this.dynamicArray = this.getDateArray(this.startDate, this.endDate);
        this.apiService.getDataByTime(startDate, endDate, this.devIdForSearch, this.sourceValue, this.searchValue)
        .subscribe((res)=>{
            this.onEventChangeSources = res.sort(function (a: any, b: any) { //data sorting
                var d1: any = new Date(a.datetime);
                var d2: any = new Date(b.datetime);
                return d1 - d2;
            })
            
            this.onEventChangeSources.forEach((data: any) => {
                var d1 = new Date(data.datetime).toISOString().split('T')[0];
                var index = this.dynamicArray.findIndex(x => x.date === d1);
                if (index >= 0)
                {
                    const result = this.onEventChangeSources.filter(search => search.datetime.includes(d1));
                    this.dynamicArray[index].length = result.length;
                }
            })        
           
            this.updateChart(this.dynamicArray)
            this.tableSource = new MatTableDataSource(this.onEventChangeSources);
            this.tableSource.paginator = this.paginator;
        },
        err=>{
            this.onEventChangeSources = [];
            this.updateChart(this.onEventChangeSources)
            this.tableSource = new MatTableDataSource(this.onEventChangeSources);
            this.tableSource.paginator = this.paginator;
        })
    }

    //create array for 24 hours
    oneDayArray()
    {
        var currentTime: any = new Date();
        var Time_24hrs_before: any = new Date(currentTime - 3600000 * 24);
        var count = 0;
        this.time_array = [];

        while (count != 13) {
            let time_string = Time_24hrs_before.getHours() + "-" + Time_24hrs_before.getMinutes() + ":" + Time_24hrs_before.getSeconds();
            this.time_array.push(time_string)
            Time_24hrs_before = new Date(Time_24hrs_before + 3600000 * 2)
            count++
        }
    }

    // generating dynamic array according to dates
    getDateArray(start: any, end: any) {
    var arr = new Array();
    var dt = new Date(start);
    while (dt <= end) {
        var dayZero = '';
        var monthZero = '';
        var dateObj = new Date(dt);
        var month = dateObj.getUTCMonth() + 1;
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        if (day < 10) { dayZero = '0' }
        if (month < 10) { monthZero = '0' }
        var newdate = year + "-" + monthZero + month + "-" + dayZero + day;

        arr.push({ length: null, date: newdate});
        dt.setDate(dt.getDate() + 1);
    }
    return arr;
}

    //time history filter
    timeFilter(time: any)
    {
        this.dynamicArray = [];
        switch (time)
        {           
            
            case "1":
                this.getCurentDate();
                var temp = this.currentDate.setDate(this.currentDate.getDate() - 1);
                this.startDate = new Date(temp);
                this.endDate = new Date();            
            break;
            
            case "2":
                this.getCurentDate();
                var temp = this.currentDate.setDate(this.currentDate.getDate() - 7);
                this.startDate = new Date(temp)
                this.endDate = new Date();
            break;

            case "3":
                this.getCurentDate();
                var temp = this.currentDate.setMonth(this.currentDate.getMonth() - 3);
                this.startDate = new Date(temp)
                this.endDate = new Date();                
                break;
            case "4":
                this.getCurentDate();
                var temp = this.currentDate.setMonth(this.currentDate.getMonth() - 6);
                this.startDate = new Date(temp)
                this.endDate = new Date();
                break;
            case "5":
                this.getCurentDate();
                var temp = this.currentDate.setMonth(this.currentDate.getMonth() - 12);
                this.startDate = new Date(temp)
                this.endDate = new Date();
                break;
            case "6":
                this.getCurentDate();
                var temp = this.currentDate.setMonth(this.currentDate.getMonth() - 24);
                this.startDate = new Date(temp)
                this.endDate = new Date();
                break;
            default:                 
                break;
        }
    }

    //setting for charts
    public chartOptions: any = {
        responsive: true,       
        maintainAspectRatio: false, 
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 3
                }
            }]
        }
    };

    //message counter
    messageCount(source)
    {
        this.messageCounter = [];
        var array: any = [];
        source.forEach(datum => {
            var d = new Date(datum.datetime).toISOString().split('T')[0];
            var t = new Date(datum.datetime).toISOString().split('T')[1].split('.')[0];
            array.push({ date: d, time: t, datetime: datum.datetime, message: datum.message })
        })

        array.forEach(data => {
            const result = array.filter(search => search.datetime.includes(data.date));
            if (this.messageCounter.findIndex(x => x.date === data.date) < 0)
            {
                this.messageCounter.push({ length: result.length, date: data.date })     
            }
        })
    }

    updateChart(chartSource: any)
    {
        var messageArr: any = [];
        var dateArr: any = [];
        chartSource.forEach(data => {
            messageArr.push(data.length);
            dateArr.push(data.date);
        })
        this.chartLabels = [];
        dateArr.forEach(data => {
            this.chartLabels.push(data);
        })
        this.chartDatasets = [];
        this.chartDatasets.push({ data: messageArr, label: 'No. of messages' });
    }

    //searching
    searchEvent(event: any)
    {
        this.searchValue = event;                
    }

    //event fired on source change
    sourceEvent(event: any)
    {        
        this.sourceValue = event;
    }  
}