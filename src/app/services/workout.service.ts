import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkoutModel } from '../models/workout.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  constructor(private http: HttpClient) {	}

  insertWorkout(body: WorkoutModel[]): Observable<WorkoutModel[]> {
    return this.http.post<WorkoutModel[]>(`${environment.baseURI.api}/workout`, body);
  }
}
