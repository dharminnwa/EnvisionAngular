import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { CookieService } from 'ngx-cookie-service';
@Injectable()

export class RememberMeService {
    private remembermeDataString: string = 'RememberMe';
    private key = "asaslklk";//CryptoJS.enc.Utf8.parse('7061737323313233');
    private iv = CryptoJS.enc.Utf8.parse('7061737323313233');
    constructor(private cookieService: CookieService) { }

    public setRemembermeData(data: any) {
        this.setItem(this.remembermeDataString, data);
    }

    public getRemembermeData() {
        return this.getItem(this.remembermeDataString);
    }

    public removeRemembermeData() {
        this.removeItem(this.remembermeDataString);
    }

    private setItem(key: string, value: any) {
        let hour = 720;
        let Expiretime = (1 * hour) / 24;
        this.cookieService.set(key, JSON.stringify(value), Expiretime);
    }

    private getItem(key: string) {
        let data = this.cookieService.get(key);//sessionStorage.getItem(key);
        if (!data)
            return null;
        return JSON.parse(data);
    }

    private removeItem(key: string) {
        this.cookieService.delete(key);
    }

    public encryptData(data) {
        try {
            return CryptoJS.AES.encrypt(data, this.key).toString();
        } catch (e) {
            console.log(e);
        }
    }

    public decryptData(data) {
        try {
            const bytes = CryptoJS.AES.decrypt(data, this.key);
            if (bytes.toString()) {
                return bytes.toString(CryptoJS.enc.Utf8);
            }
            return data;
        } catch (e) {
            console.log(e);
        }
    }
}