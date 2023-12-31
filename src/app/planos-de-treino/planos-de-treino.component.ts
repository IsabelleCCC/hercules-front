import { Component, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExerciseModel } from '../models/exercise.model';
import { AuthService } from '../services/auth.service';
import { ExerciseService } from '../services/exercise.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkoutPlan, InsertWorkoutPlan, DeleteWorkoutPlan, WorkoutPlanWithExerciseWorkoutPlan } from '../models/workout-plan.model';
import { WorkoutPlanService } from '../services/workout-plan.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonLoading } from '../helpers/button-loading';
import { Toast } from '../helpers/toast';

@Component({
  selector: 'app-planos-de-treino',
  templateUrl: './planos-de-treino.component.html',
  styleUrls: ['./planos-de-treino.component.css'],
  styles: [
		`
			.light-blue-backdrop {
				background-color: #5cb3fd;
			}
		`,
	]
})

export class PlanosDeTreinoComponent {
  public exerciseList: ExerciseModel[] = []
  public workoutPlanList: WorkoutPlan[] = []
  public workoutPlanForm: FormGroup
  private selectedWorkoutPlan: WorkoutPlan | null = null
  closeResult?: string;

  constructor(private modalService: NgbModal, private fb: FormBuilder, private authService: AuthService, private exerciseService: ExerciseService, private workoutPlanService: WorkoutPlanService) {
    this.workoutPlanForm = this.fb.group({
      name: ["", [
        Validators.required
      ]],
      start_date: ["", [
        Validators.required
      ]],
      end_date: ["", [
        Validators.required
      ]],
      exercises_workout_plan: this.fb.array([])
    })

    this.exerciseService.listExercise().subscribe({
      next: (response: ExerciseModel[]) => {
        this.exerciseList = response
      }
    })

    this.workoutPlanService.listWorkoutPlan(this.authService.userId).subscribe({
      next: (response: WorkoutPlan[]) => {
        this.workoutPlanList = response
      }
    })
  }


  openModal(content: TemplateRef<any>, workoutPlan: WorkoutPlan | null) {
    this.workoutPlanForm.reset()
    this.getExercisesWorkoutPlan().controls = []
		this.modalService.open(content, { centered: true, scrollable: true });

    if (workoutPlan != null) {
      workoutPlan.exercises_workout_plan.forEach((element) => {
        if(element.combination == null) {
          element.combination = 0
        }
        this.addExerciseWorkoutPlan()
      });
      this.workoutPlanForm.patchValue(workoutPlan)
    }

    this.selectedWorkoutPlan = workoutPlan
	}

  getExercisesWorkoutPlan() {
    return this.workoutPlanForm.get('exercises_workout_plan') as FormArray
  }

  addExerciseWorkoutPlan() {
    const group = this.fb.group({
      exercise_id: ["", [
        Validators.required,
        Validators.min(1)
      ]],
      sets:  ["", [
        Validators.required,
        Validators.min(1)
      ]],
      reps:  ["", [
        Validators.required,
        Validators.min(1)
      ]],
      combination:  [0, [
        Validators.min(0)
      ]]
    })

    this.getExercisesWorkoutPlan().push(group)


  }

  submitWorkoutPlan(): void {
    if(this.selectedWorkoutPlan) {
      this.updateWorkoutPlan()
    }else {
      this.insertWorkoutPlan()
    }
  }

  insertWorkoutPlan(): void {
    this.workoutPlanForm.markAllAsTouched()

    if (this.workoutPlanForm.invalid) {
      Swal.fire(
        "Ocorreu um erro",
        "Valores inseridos inválidos.",
        "error"
      );
      return
    }

    this.workoutPlanForm.disable()
    this.workoutPlanForm.value['user_id'] = this.authService.userId

    this.workoutPlanForm.value['exercises_workout_plan'].forEach((element:any) => {
      if(element.combination == "0") {
        element.combination = null
      }
    });
    console.log(this.workoutPlanForm.value)
    this.workoutPlanService.insertWorkoutPlan(this.workoutPlanForm.value).subscribe({
      next: (response: WorkoutPlanWithExerciseWorkoutPlan) => {
        Swal.fire({
          icon: "success",
          title: "Plano de treino inserido com sucesso"
        }).finally(() => {
          this.modalService.dismissAll()
          this.setPage()
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
            break;
        }
      }

    }).add(() => this.workoutPlanForm.enable())
  }

  updateWorkoutPlan() {
    console.log('abuble')
  }

  setPage() {
		this.workoutPlanService.listWorkoutPlan(this.authService.userId).subscribe({
      next: (response: WorkoutPlan[]) => {
        this.workoutPlanList = response
      },
      error: () => {
          Swal.fire(
            "Ocorreu um erro",
            "Algo inesperado aconteceu, tente novamente mais tarde.",
            "error"
          );
        }
    });
	}

  deleteWorkoutPlan(event: Event, button: HTMLButtonElement, id: number) {
    event.preventDefault();
		event.stopPropagation();

    Swal.fire({
			icon: "question",
			title: "Você tem certeza?",
			text: "Essa ação não poderá ser revertida.",
			showDenyButton: true,
			showConfirmButton: true,
			confirmButtonText: "Confirmar",
			denyButtonText: "Cancelar"
		}).then((result) => {
			if (result.isConfirmed) {
				const loading = new ButtonLoading(button)

				const command: DeleteWorkoutPlan = {
					id: id
				};

				this.workoutPlanService.deleteWorkoutPlan(command.id).subscribe({
					next: () => {
            Toast.fire({
              icon: 'success',
              title: 'Plano de treino deletado'
            })

						this.setPage();
					},
					error: (error: HttpErrorResponse) => {
						switch(error.error.detail) {
							default:
								Swal.fire(
									"Ocorreu um erro",
									"Não foi possível deletar.",
									"error"
								);
								break;
						}
					}
				}).add(() => loading.remove());
			}
		});
  }

  addExercise() {

  }
}
