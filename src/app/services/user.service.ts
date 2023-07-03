import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BearerTokenModel } from '../models/auth/bearer-token.model';
import jwtDecode from 'jwt-decode';
import { User } from '../models/user.model';


@Injectable({
	providedIn: 'root'
})
export class UserService {
	constructor(private http: HttpClient) {	}

	register(command: User): Observable<User> {
		return this.http.post<User>(`${environment.baseURI.api}/user/signup`, command);
	}

  get(id: number): Observable<User> {
    return this.http.get<User>(`${environment.baseURI.api}/user/id/${id}`);
  }

  update(command: User): Observable<User> {
    return this.http.put<User>(`${environment.baseURI.api}/user`, command);
  }

}
