import { Injectable } from '@angular/core';
import { ExerciseWorkoutPlan } from '../models/exercise-workout-plan.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExerciseWorkoutPlanService {
  constructor(private http: HttpClient) {	}

  listExerciseWorkoutPlan(workout_plan_id: number, skip: number = 0, limit: number = 10): Observable<ExerciseWorkoutPlan[]> {
		return this.http.get<ExerciseWorkoutPlan[]>(`${environment.baseURI.api}/exercise-workout-plan?workout_plan_id=${workout_plan_id}&skip=${skip}&limit=${limit}`);
	}
}
