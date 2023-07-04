import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FitnessTest, GetFitnessTest } from '../models/fitness-test.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FitnessTestService {
  constructor(private http: HttpClient) {	}

  list(user_id: number, skip: number = 0, limit: number = 20): Observable<GetFitnessTest[]> {
		return this.http.get<GetFitnessTest[]>(`${environment.baseURI.api}/fitness-test?user_id=${user_id}&skip=${skip}&limit=${limit}`);
	}

  insert(body: FitnessTest): Observable<FitnessTest> {
    return this.http.post<FitnessTest>(`${environment.baseURI.api}/fitness-test`, body)
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.baseURI.api}/fitness-test/${id}`)
  }
}
