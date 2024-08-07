import { Component, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { WorkoutDonePagination, WorkoutDoneWithName } from '../models/workout-done.model';
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
  public skip: number = 0
  public limit: number = 5
  public pages: number[] = []
  public currentPage: number = 1;

  constructor(
    private offcanvasService: NgbOffcanvas,
    private router: Router,
    private route: ActivatedRoute,
    private workoutDoneService: WorkoutDoneService,
    private authService: AuthService
  ) {

    this.workoutDoneService.listWorkoutsDone(this.authService.userId, this.skip, this.limit).subscribe({
      next: (response: WorkoutDonePagination) => {
		    let count_pages = Math.ceil(response.count / this.limit)

        this.pages = Array.from({ length: count_pages }, (_, i) => i + 1);

        this.workoutDoneList = response['workouts_done'].map(workout => {
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

  loadWorkouts(action: any){
    if (action == 'next') {
      this.skip += this.limit

      if (this.currentPage < this.pages.length) {
        this.currentPage++;
      }
    } else if (action == 'previous') {
      this.skip -= this.limit

      if (this.currentPage > 1) {
        this.currentPage--;
      }
    } else {
      this.currentPage = action
      this.skip = (action - 1) * this.limit;
    }

    this.workoutDoneService.listWorkoutsDone(this.authService.userId, this.skip, this.limit).subscribe({
      next: (response: WorkoutDonePagination) => {
        this.workoutDoneList.pop()

        this.workoutDoneList = response.workouts_done.map(workout => {
          const localDate = this.convertToLocalDatetime(workout.datetime)
          return {
            ...workout,
            datetime: localDate
          };
        });
      }
      })
    }

  isDisabled(page: string | number): boolean {
    if (page === 'previous') {
      return this.currentPage === 1;
    } else if (page === 'next') {
      return this.currentPage === this.pages.length;
    }
    return false;
  }

}
