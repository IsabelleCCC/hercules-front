import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkoutDoneModel, WorkoutDoneWithName, WorkoutDonePagination } from '../models/workout-done.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkoutDoneService {
  constructor(private http: HttpClient) {	}

  insertWorkoutDone(body: WorkoutDoneModel): Observable<WorkoutDoneModel> {
    return this.http.post<WorkoutDoneModel>(`${environment.baseURI.api}/workout-done`, body);
  }

  listWorkoutsDone(user_id: number, skip: number = 0, limit: number = 100): Observable<WorkoutDonePagination> {
		return this.http.get<WorkoutDonePagination>(`${environment.baseURI.api}/workout-done?user_id=${user_id}&skip=${skip}&limit=${limit}`);
	}
}
