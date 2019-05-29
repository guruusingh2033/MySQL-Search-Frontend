import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService, ApiService } from '../_services';

@Component({ templateUrl: 'query.component.html' })
export class QueryComponent implements OnInit {
    currentUser: any;
    organization: any;
    devID: any;
    sources: any = [];
    onEventChangeSources: any = [];
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
    flag: boolean = false;
    showHome: boolean = false;
    loginData: any;
    loading = false;
    displayedColumns: string[] = ['datetime', 'message'];
    public chartType: string = 'bar';
    public chartDatasets: Array<any> = [];
    public chartLabels: Array<any> = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private apiService: ApiService,
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.loginData = this.activatedRoute.snapshot.params;
        this.onPageLoad();
        this.organization = this.loginData.organization;
    }

    //on page load
    onPageLoad() {
        this.defaultDate();
        this.loading = true;
        this.authenticationService.loginWithQueryString(this.loginData)
            .subscribe(
                data => {
                    if (data.length) {
                        this.getDeviceIdByOrganization();
                        this.showHome = true;
                    }
                    else {
                        this.alertService.error("You're not authenticated to see this page");
                        this.loading = false;
                    }
                },
                error => {
                    this.alertService.error("You're not authenticated to see this page");
                    this.loading = false;
                });
    }

    defaultDate() {
        this.getCurentDate();
        var temp = this.currentDate.setDate(this.currentDate.getDate() - 7);
        this.startDate = new Date(temp);
        this.endDate = new Date();
    }

    chart() {
        if (this.chartDatasets.length > 0) {
            return true
        }
        else {
            return false
        }
    }

    //getting current date
    getCurentDate() {
        var today = new Date();
        this.currentDate = today;
    }

    //getting devices
    getDeviceIdByOrganization() {
        this.showLoader = true;
        this.apiService.getDeviceIdByOrganization(this.organization)
            .subscribe((res) => {
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
                        this.timeHistoryData(this.startDate, this.endDate);
                        this.showLoader = false;
                        this.defaultDate();
                    })
            })
    }

    //run when devID change
    onDevIdChange(devID: any) {
        this.devIdForSearch = devID;

        this.apiService.getSourceByDevId(devID)
            .subscribe((res) => {

                this.onEventChangeSources = res.sort(function (a: any, b: any) { //data sorting
                    var d1: any = new Date(a.datetime);
                    var d2: any = new Date(b.datetime);
                    return d1 - d2;
                })
                this.onLoadSource = this.onEventChangeSources;
                this.sourceValue = this.onEventChangeSources[0].source;
            })
    }

    //data according to time history
    timeHistoryData(startDate: any, endDate: any) {
        this.oneDayArray();
        this.showLoader = true;
        this.dynamicArray = this.getDateArray(this.startDate, this.endDate);
        this.apiService.getDataByTime(startDate, endDate, this.devIdForSearch, this.sourceValue, this.searchValue)
            .subscribe((res) => {
                if (res.length) {
                    this.onEventChangeSources = res.sort(function (a: any, b: any) { //data sorting
                        var d1: any = new Date(a.datetime);
                        var d2: any = new Date(b.datetime);
                        return d1 - d2;
                    })
                }

                else {
                    this.onEventChangeSources = [];
                    this.updateChart(this.onEventChangeSources)
                    this.tableSource = new MatTableDataSource(this.onEventChangeSources);
                    this.tableSource.paginator = this.paginator;
                    this.showLoader = false;
                }

                if (this.flag === false) {
                    this.onEventChangeSources.forEach((data: any) => {
                        var d1 = new Date(data.datetime).toISOString().split('T')[0];
                        var index = this.dynamicArray.findIndex(x => x.date === d1);
                        if (index >= 0) {
                            const result = this.onEventChangeSources.filter(search => search.datetime.includes(d1));
                            this.dynamicArray[index].length = result.length;
                        }
                    })
                }
                else {
                    this.showLoader = true;
                    this.dynamicArray = [];
                    this.dynamicArray = this.time_array;
                    this.onEventChangeSources.forEach((data: any) => {
                        var backDate = data.datetime.split('T')[0];
                        var backendTime = (data.datetime.split('T')[1]).split('.')[0].split(':')[0];
                        var index = this.dynamicArray.findIndex(x => x.hours == backendTime);
                        if (index >= 0) {
                            const result = res.filter(search => search.datetime.includes(backDate));
                            this.dynamicArray[index].length = result.length;
                        }
                    })
                    this.tableSource = new MatTableDataSource(this.onEventChangeSources);
                    this.tableSource.paginator = this.paginator;
                    this.showLoader = false;
                }

                this.updateChart(this.dynamicArray)
                this.tableSource = new MatTableDataSource(this.onEventChangeSources);
                this.tableSource.paginator = this.paginator;
                this.showLoader = false;
            },
                err => {
                    this.onEventChangeSources = [];
                    this.updateChart(this.onEventChangeSources)
                    this.tableSource = new MatTableDataSource(this.onEventChangeSources);
                    this.tableSource.paginator = this.paginator;
                    this.showLoader = false;
                })
    }

    //create array for 24 hours
    oneDayArray() {
        this.time_array = [];
        var currentTime: any = new Date();
        var Time_24hrs_before: any;
        Time_24hrs_before = new Date(currentTime - 3600000 * 24);
        var count = 0;
        function addZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
        while (count != 24) {
            let time_string = addZero(Time_24hrs_before.getHours()) + ":" + addZero(Time_24hrs_before.getMinutes()) + ":" + addZero(Time_24hrs_before.getSeconds());
            this.time_array.push({ date: time_string, length: null, hours: addZero(Time_24hrs_before.getHours()) })
            Time_24hrs_before = new Date(Time_24hrs_before.getTime() + 3600000)
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

            arr.push({ length: null, date: newdate });
            dt.setDate(dt.getDate() + 1);
        }
        return arr;
    }

    //time history filter
    timeFilter(time: any) {
        this.dynamicArray = [];
        switch (time) {

            case "1":
                this.flag = true;
                this.getCurentDate();
                var temp = this.currentDate.setDate(this.currentDate.getDate() - 1);
                this.startDate = new Date(temp);
                this.endDate = new Date();
                break;

            case "2":
                this.flag = false;
                this.getCurentDate();
                var temp = this.currentDate.setDate(this.currentDate.getDate() - 7);
                this.startDate = new Date(temp)
                this.endDate = new Date();
                break;

            case "3":
                this.flag = false;
                this.getCurentDate();
                var temp = this.currentDate.setMonth(this.currentDate.getMonth() - 3);
                this.startDate = new Date(temp)
                this.endDate = new Date();
                break;
            case "4":
                this.flag = false;
                this.getCurentDate();
                var temp = this.currentDate.setMonth(this.currentDate.getMonth() - 6);
                this.startDate = new Date(temp)
                this.endDate = new Date();
                break;
            case "5":
                this.flag = false;
                this.getCurentDate();
                var temp = this.currentDate.setMonth(this.currentDate.getMonth() - 12);
                this.startDate = new Date(temp)
                this.endDate = new Date();
                break;
            case "6":
                this.flag = false;
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
                    max: 4
                }
            }]
        }
    };

    //message counter
    messageCount(source) {
        this.messageCounter = [];
        var array: any = [];
        source.forEach(datum => {
            var d = new Date(datum.datetime).toISOString().split('T')[0];
            var t = new Date(datum.datetime).toISOString().split('T')[1].split('.')[0];
            array.push({ date: d, time: t, datetime: datum.datetime, message: datum.message })
        })

        array.forEach(data => {
            const result = array.filter(search => search.datetime.includes(data.date));
            if (this.messageCounter.findIndex(x => x.date === data.date) < 0) {
                this.messageCounter.push({ length: result.length, date: data.date })
            }
        })
    }

    updateChart(chartSource: any) {
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
    searchEvent(event: any) {
        this.searchValue = event;
    }

    //event fired on source change
    sourceEvent(event: any) {
        this.sourceValue = event;
    }
}