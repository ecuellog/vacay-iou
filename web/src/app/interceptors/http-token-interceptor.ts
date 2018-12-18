import { Injectable, Injector } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
    constructor(private cookies: CookieService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        console.log("intercepted request ... ");
        const modified = req.clone({setHeaders: {'x-csrf-token': this.cookies.get('csrf-token')}});

        //send the newly created request
        return next.handle(modified);
    }
}
