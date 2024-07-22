import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BearerTokenModel } from '../models/auth/bearer-token.model';
import { LoginModel } from '../models/auth/login.model';
import jwtDecode from 'jwt-decode';


@Injectable({
	providedIn: 'root'
})
export class AuthService {
	constructor(private http: HttpClient) {	}

	login(command: LoginModel): Observable<BearerTokenModel> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const params = new HttpParams()
      .set('username', command.username)
      .set('password', command.password)

		return this.http.post<BearerTokenModel>(`${environment.baseURI.api}/auth/login`, params, { headers });
	}

  get userId() {
    const token:any= jwtDecode(localStorage.getItem('token')!)
    return token.id
  }
}
