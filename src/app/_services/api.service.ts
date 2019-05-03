import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {

    constructor(private http: HttpClient) { }

    //getting device ID
    getDeviceIdByOrganization(organization: any )
    {
        return this.http.post<any>(`${environment.apiUrl}/getdeviceidbyorganization`, { organization})
    }

    //getting source
    getSourceByDevId(devID: any) {
        return this.http.post<any>(`${environment.apiUrl}/getsourcesbydevid`, { devID })
    }

    //get data according to time
    getDataByTime(startDate: any, endDate: any, devIdForSearch: any, sourceValue: any, searchValue: any)
    {
        return this.http.post<any>(`${environment.apiUrl}/getdatabytime`, { startDate: startDate, endDate: endDate, devIdForSearch, sourceValue, searchValue })
    }


}