import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MuscleGroupByDate } from '../models/exercise-done.model';

@Injectable({
  providedIn: 'root'
})
export class ExerciseDoneService {
  constructor(private http: HttpClient) {	}

  listMuscleGroupByDate(user_id: number, skip: number = 0, limit: number = 100): Observable<MuscleGroupByDate[]> {
    return this.http.get<MuscleGroupByDate[]>(`${environment.baseURI.api}/exercise-done/muscle-group-by-date/${user_id}?skip=${skip}&limit=${limit}`);
  }

}
