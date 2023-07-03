import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkoutPlan, InsertWorkoutPlan, WorkoutPlanWithExerciseWorkoutPlan } from '../models/workout-plan.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkoutPlanService {
  constructor(private http: HttpClient) {	}

  listWorkoutPlan(userId: number, skip: number = 0, limit: number = 50): Observable<WorkoutPlanWithExerciseWorkoutPlan[]> {
		return this.http.get<WorkoutPlanWithExerciseWorkoutPlan[]>(`${environment.baseURI.api}/workout-plan?user_id=${userId}&skip=${skip}&limit=${limit}`);
	}

  getWorkoutPlan(id: number): Observable<WorkoutPlan> {
		return this.http.get<WorkoutPlan>(`${environment.baseURI.api}/workout-plan/${id}`);
	}

  insertWorkoutPlan(body: WorkoutPlanWithExerciseWorkoutPlan): Observable<WorkoutPlanWithExerciseWorkoutPlan> {
    return this.http.post<WorkoutPlanWithExerciseWorkoutPlan>(`${environment.baseURI.api}/workout-plan`, body)
  }

  deleteWorkoutPlan(id: number): Observable<any> {
    return this.http.delete(`${environment.baseURI.api}/workout-plan/${id}`)
  }
}
