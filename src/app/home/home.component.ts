import { Component, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { WorkoutDoneWithName } from '../models/workout-done.model';
import { WorkoutDoneService } from '../services/workout-done.service';
import { AuthService } from '../services/auth.service';
import { DateTime } from 'luxon';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  closeResult?: string;

  public workoutDoneList: WorkoutDoneWithName[] = []

  constructor(
    private offcanvasService: NgbOffcanvas,
    private router: Router,
    private route: ActivatedRoute,
    private workoutDoneService: WorkoutDoneService,
    private authService: AuthService
  ) {

    this.workoutDoneService.listWorkoutsDone(this.authService.userId).subscribe({
      next: (response: WorkoutDoneWithName[]) => {

        this.workoutDoneList = response.map(workout => {
          const localDate = this.convertToLocalDatetime(workout.datetime)
          return {
            ...workout,
            datetime: localDate
          };
        });

      }
    })

  }

  convertToLocalDatetime(datetime: string) {
    const localDatetime = DateTime.fromISO(datetime, { zone: 'utc' }).setZone('local');
    const formattedDate = localDatetime.toFormat('dd/MM/yyyy HH:mm');

    return formattedDate
  }

  goToPage(pageName:string){
    this.router.navigate([`${pageName}`]);
  }
}
