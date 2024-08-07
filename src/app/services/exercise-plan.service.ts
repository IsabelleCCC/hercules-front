import { Injectable } from '@angular/core';
import { ExercisePlan } from '../models/exercise-plan.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExercisePlanService {
  constructor(private http: HttpClient) {	}

  listExercisePlan(workout_plan_id: number, skip: number = 0, limit: number = 10): Observable<ExercisePlan[]> {
		return this.http.get<ExercisePlan[]>(`${environment.baseURI.api}/exercise-plan?workout_plan_id=${workout_plan_id}&skip=${skip}&limit=${limit}`);
	}
}
