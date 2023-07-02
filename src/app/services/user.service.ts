import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BearerTokenModel } from '../models/auth/bearer-token.model';
import jwtDecode from 'jwt-decode';
import { Register } from '../models/register.model';


@Injectable({
	providedIn: 'root'
})
export class UserService {
	constructor(private http: HttpClient) {	}

	register(command: Register): Observable<Register> {
		return this.http.post<Register>(`${environment.baseURI.api}/user/signup`, command);
	}

}
