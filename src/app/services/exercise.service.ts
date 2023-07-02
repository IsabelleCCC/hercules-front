import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExerciseModel } from '../models/exercise.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  constructor(private http: HttpClient) {	}

  listExercise(skip: number = 0, limit: number = 100): Observable<ExerciseModel[]> {
		return this.http.get<ExerciseModel[]>(`${environment.baseURI.api}/exercise?skip=${skip}&limit=${limit}`);
	}
}
