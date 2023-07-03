import { Component, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkoutPlan } from '../models/workout-plan.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { WorkoutPlanService } from '../services/workout-plan.service';
import { ExerciseWorkoutPlan, ExerciseWorkoutPlanEdited } from '../models/exercise-workout-plan.model';
import { ExerciseWorkoutPlanService } from '../services/exercise-workout-plan.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { WorkoutModel } from '../models/workout.model';
import { WorkoutService } from '../services/workout.service';
import { Toast } from '../helpers/toast';
import { ButtonLoading } from '../helpers/button-loading';

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
  public setsForm: FormGroup

  public workoutPlanList: WorkoutPlan[] = []
  public exerciseWorkoutPlanList?: ExerciseWorkoutPlanEdited[]
  public exerciseWorkoutPlan?: ExerciseWorkoutPlanEdited

  public Count = []
  closeResult?: string;

  constructor(private modalService: NgbModal, private fb: FormBuilder, private authService: AuthService, private workoutPlanService: WorkoutPlanService, private exerciseWorkoutPlanService: ExerciseWorkoutPlanService, private workoutService: WorkoutService) {
    this.workoutPlanForm = this.fb.group({
      workoutPlan: ["", [
        Validators.required,
        Validators.min(1)
      ]]
    })

    this.setsForm = this.fb.group({
      setsArray: this.fb.array([])
    })

    this.workoutPlanService.listWorkoutPlan(this.authService.userId).subscribe({
      next: (response: WorkoutPlan[]) => {
        this.workoutPlanList = response
      }
    })
  }

  listExerciseWorkoutPlan(id?: string) {
    if (!id) {
      return
    }
    this.exerciseWorkoutPlanService.listExerciseWorkoutPlan(parseInt(id)).subscribe({
      next: (response: ExerciseWorkoutPlan[]) => {
        const groupedData: ExerciseWorkoutPlanEdited[] = [];

        response.forEach((item) => {
          const existingExercise = groupedData.find(
            (exercise) => exercise.exercise_id === item.exercise_id
          );

          if (existingExercise) {
            existingExercise.workout_list.push({
              workout_id: item.workout_id,
              workout_max_weight: item.workout_max_weight,
              workout_reps: item.workout_reps,
            });
          } else {
            const newExercise: ExerciseWorkoutPlanEdited = {
              exercise_id: item.exercise_id,
              exercise_name: item.exercise_name,
              id: item.id,
              reps: item.reps,
              sets: item.sets,
              workout_plan_id: item.workout_id,
              combination: item.combination,
              workout_list: [
                {
                  workout_id: item.workout_id,
                  workout_max_weight: item.workout_max_weight,
                  workout_reps: item.workout_reps,
                },
              ],
            };
            groupedData.push(newExercise);
          }
        });

        this.exerciseWorkoutPlanList = groupedData
      },

      error: (error: HttpErrorResponse) => {
        switch (error.error.detail) {
          case "Nenhum registro associado a esse plano de treino.":
            this.exerciseWorkoutPlanList = []
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

  openModalUpdate(content: TemplateRef<any>, exercise_clicked: ExerciseWorkoutPlanEdited) {
		this.modalService.open(content, { centered: true, scrollable: true });
    this.exerciseWorkoutPlan = exercise_clicked
    let control = this.getSets()
    control.controls = []

    if (this.exerciseWorkoutPlan.workout_list[0].workout_id != null) {
      for (let index = 0; index < this.exerciseWorkoutPlan.workout_list.length; index++) {
        const element = this.exerciseWorkoutPlan.workout_list[index]

        const setGroup = this.fb.group({
          reps: [element.workout_reps, [
            Validators.required,
            Validators.min(1)
          ]],
          max_weight: [element.workout_max_weight, [
            Validators.required,
            Validators.min(1)
          ]]
        })
        control.push(setGroup)
      }
    } else {
      for (let index = 0; index < exercise_clicked.sets; index++) {
        const setGroup = this.fb.group({
          reps: ["", [
            Validators.required,
            Validators.min(1)
          ]],
          max_weight: ["", [
            Validators.required,
            Validators.min(1)
          ]]
        })
        control.push(setGroup)
      }
    }
	}

  getSets() {
    return this.setsForm.get('setsArray') as FormArray
  }

  insertWorkout(button: HTMLButtonElement): void {
    const loading = new ButtonLoading(button);
    this.setsForm.markAllAsTouched()

    if (this.setsForm.invalid) {
      Swal.fire(
        "Ocorreu um erro",
        "Valores inseridos inválidos.",
        "error"
      );
      loading.remove()
      return
    }

    this.setsForm.disable()

    let bodyList: WorkoutModel[] = []

    this.setsForm.value['setsArray'].forEach((setInfo: any) => {
      let body: WorkoutModel = {
		    workout_exercise_id: this.exerciseWorkoutPlan!.id,
        reps: setInfo.reps,
		    max_weight: setInfo.max_weight
      }

      bodyList.push(body)
    })

    this.workoutService.insertWorkout(bodyList).subscribe({
      next: (response: WorkoutModel[]) => {
        Swal.fire({
          icon: "success",
          title: "Exercício inserido"
        }).then(() => this.modalService.dismissAll())
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
      this.setsForm.enable()
      loading.remove()
    })
  }
}
