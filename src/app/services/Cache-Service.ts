import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Httprequestmodel } from '../models/Httprequestmodel';

abstract class HttpCache {
    abstract get(req: HttpRequest<any>): HttpResponse<any> | null;
    abstract put(req: HttpRequest<any>, resp: HttpResponse<any>): void;
}

@Injectable()
export class HttpCacheservice implements HttpCache {
    private cache = {};
    public cacherequest: Httprequestmodel[] = [];
    put(req: HttpRequest<any>, resp: HttpResponse<any>): void {
        
        this.cache[req.urlWithParams] = { resp: resp, respparam: JSON.stringify(resp) };
        // var storehttprequest = new Httprequestmodel()
        // storehttprequest.event = event;
        // storehttprequest.respparam = JSON.stringify(req);
        // this.cacherequest.push(storehttprequest);

    }
    get(req: HttpRequest<any>): HttpResponse<any> | null {
        return this.cache[req.urlWithParams];
        // return this.cacherequest[req.urlWithParams];
    }

}