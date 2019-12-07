import { Injectable } from '@angular/core';
@Injectable()

export class LocalDataService {
    private userDataString: string = 'User';
    private remembermeDataString: string = 'RememberMe';
    constructor() { }

    public setUserData(value: any) {
        this.setItem(this.userDataString, value);
    }

    public getUserData() {
        return this.getItem(this.userDataString);
    }

    public setRemembermeData(data: any) {
        this.setItem(this.remembermeDataString, data);
    }

    public getRemembermeData() {
        return this.getItem(this.remembermeDataString);
    }

    private setItem(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    private getItem(key: string) {
        let data = localStorage.getItem(key);
        if (data == undefined || data == "undefined" || data == null)
            return null;
        return JSON.parse(data);
    }
    public GetXTableNames() {
        let tableNames = null;
        var UserData = this.getUserData();
        if (UserData) {
            if (UserData.IsApproved == true) {
                tableNames = UserData.xTableNames;
            }
            return tableNames;
        }
    }

}