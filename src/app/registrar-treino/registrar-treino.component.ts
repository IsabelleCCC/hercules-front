import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkoutPlan } from '../models/workout-plan.model';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { WorkoutPlanService } from '../services/workout-plan.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { WorkoutDoneModel } from '../models/workout-done.model';
import { WorkoutDoneService } from '../services/workout-done.service';
import { Toast } from '../helpers/toast';
import { ButtonLoading } from '../helpers/button-loading';
import { ExercisePlan } from '../models/exercise-plan.model';

@Component({
  selector: 'app-registrar-treino',
  templateUrl: './registrar-treino.component.html',
  styleUrls: ['./registrar-treino.component.css'],
  styles: [
		`
			.light-blue-backdrop {
				background-color: #5cb3fd;
			}
		`,
	]
})
export class RegistrarTreinoComponent {
  public workoutPlanForm: FormGroup
  public workoutDoneForm: FormGroup

  public workoutPlanList: WorkoutPlan[] = []
  public exercisePlanList: ExercisePlan[] = []

  public Count = []
  closeResult?: string;

  constructor(private fb: FormBuilder, private authService: AuthService, private workoutPlanService: WorkoutPlanService, private workoutService: WorkoutDoneService) {
    this.workoutPlanForm = this.fb.group({
      workoutPlan: ["", [
        Validators.required,
        Validators.min(1)
      ]]
    })

    this.workoutPlanService.listWorkoutPlan(this.authService.userId).subscribe({
      next: (response: WorkoutPlan[]) => {
        this.workoutPlanList = response
      }
    })

    this.workoutDoneForm = this.fb.group({
      date: ['', Validators.required],
      hour: ['', Validators.required],
      duration: ['', [Validators.required, Validators.max(1440)]],
      exercises_done: this.fb.array([])
    })

  }

  getWorkoutPlan(id?: string) {
    this.workoutDoneForm.reset()
    this.exercises_done.clear()
    this.exercisePlanList = []

    if (!id) {
      return
    }

    this.workoutPlanService.getWorkoutPlan(parseInt(id)).subscribe({
      next: (response: WorkoutPlan) => {
        response.exercise_plans.forEach((exercise) => {
          this.exercisePlanList.push(exercise)

          const exerciseGroup = this.fb.group({
            exercise_name: [exercise.exercise_name],
            exercise_id: [exercise.id],
            sets_number: [exercise.sets],
            reps_number: [exercise.reps],
            sets: this.fb.array([])
          })

          const sets = exerciseGroup.get('sets') as FormArray

          for (let i = 0; i < exercise.sets; i++) {
            const setsGroup = this.fb.group({
              reps: [exercise.reps, Validators.required],
              max_weight: ['', Validators.required],
            })

            sets.push(setsGroup)
          }

          this.exercises_done.push(exerciseGroup);
        })
      },

      error: (error: HttpErrorResponse) => {
        switch (error.error.detail) {
          case "Nenhum registro associado a esse plano de treino.":
            this.workoutDoneForm.reset()
            Toast.fire({
              icon: 'question',
              title: 'Nenhum registro associado a esse plano de treino.'
            })
            break;
          default:
            Swal.fire(
              "Ocorreu um erro",
              "Algo inesperado aconteceu, tente novamente mais tarde.",
              "error"
            );
            break;
        }
      }
    })
  }

  setsByExerciseDone(control: AbstractControl): FormArray {
    return control.get('sets') as FormArray
  }

  get exercises_done(): FormArray {
    return this.workoutDoneForm.get('exercises_done') as FormArray
  }

  addSet(control: AbstractControl) {
    const sets = control.get('sets') as FormArray

    if (sets.length >= 30) {
      return
    }

    const setsGroup = this.fb.group({
      reps: [control.value['reps_number'], Validators.required],
      max_weight: ['', Validators.required],
    })

    sets.push(setsGroup)
  }

  removeSerie(index: number, control: AbstractControl) {
    const sets = control.get('sets') as FormArray

    sets.removeAt(index);
  }

  getSetsArray(sets: number) {
    return new Array(sets)
  }

  createDateTimeObj(date: string, time: string) {
    let concatDateTime = `${date}T${time}`
    let dateTime: Date = new Date(concatDateTime);
    return dateTime
  }

  insertWorkoutDone(button: HTMLButtonElement): void {
    const exercises_done = this.workoutDoneForm.value.exercises_done

    let format_exercises_done: any = []

    exercises_done.forEach((exercise: any) => {

      exercise.sets.forEach((set: any) => {

        format_exercises_done.push({
          reps: set.reps,
          max_weight: set.max_weight,
          exercise_plan_id: exercise.exercise_id
        })

      })
    });

    var workoutDatetime = this.createDateTimeObj(
      this.workoutDoneForm.value.date,
      this.workoutDoneForm.value.hour
    )

    const body: WorkoutDoneModel = {
      datetime: workoutDatetime,
      duration: this.workoutDoneForm.value.duration,
      workout_plan_id: this.exercisePlanList[0].workout_plan_id,
      exercises_done: format_exercises_done
    }


    const loading = new ButtonLoading(button);
    this.workoutDoneForm.markAllAsTouched()

    if (this.workoutDoneForm.invalid) {
      Swal.fire(
        "Ocorreu um erro",
        "Valores inseridos inválidos.",
        "error"
      );
      loading.remove()
      return
    }

    this.workoutDoneForm.disable()

    this.workoutService.insertWorkoutDone(body).subscribe({
      next: (response) => {
        Swal.fire({
          icon: "success",
          title: "Treino realizado com sucesso"
        })
      },

      error: (error: HttpErrorResponse) => {
        switch (error.error.detail) {
          default:
            Swal.fire(
              "Ocorreu um erro",
              "Algo inesperado aconteceu, tente novamente mais tarde.",
              "error"
            );
            loading.remove()
            break;
        }
      }

    }).add(() => {
      this.workoutDoneForm.enable()
      loading.remove()
    })
  }
}
