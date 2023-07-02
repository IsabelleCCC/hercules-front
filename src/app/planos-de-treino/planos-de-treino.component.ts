import { Component, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExerciseModel } from '../models/exercise.model';
import { AuthService } from '../services/auth.service';
import { ExerciseService } from '../services/exercise.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkoutPlan, InsertWorkoutPlan, DeleteWorkoutPlan } from '../models/workout-plan.model';
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
  closeResult?: string;

  constructor(private modalService: NgbModal, private fb: FormBuilder, private authService: AuthService, private exerciseService: ExerciseService, private workoutPlanService: WorkoutPlanService) {
    this.workoutPlanForm = this.fb.group({
      name: ["", [
        Validators.required,
        Validators.min(1)
      ]],
      start_date: ["", [
        Validators.required
      ]],
      end_date: ["", [
        Validators.required
      ]]
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
		this.modalService.open(content, { centered: true, scrollable: true });

    if (workoutPlan != null) {
      this.workoutPlanForm = this.fb.group({
        name: [workoutPlan.name, [
          Validators.required,
          Validators.min(1)
        ]],
        start_date: [workoutPlan.start_date, [
          Validators.required
        ]],
        end_date: [workoutPlan.end_date, [
          Validators.required
        ]]
      })
    }
	}

  submitWorkoutPlan(): void {
    this.insertWorkoutPlan()
  }

  insertWorkoutPlan(): void {
    this.workoutPlanForm.markAllAsTouched()

    if (this.workoutPlanForm.invalid) {
      Swal.fire(
        "Ocorreu um erro",
        "Valores inseridos inválidos.",
        "error"
      );
    }

    this.workoutPlanForm.disable()


    const body: InsertWorkoutPlan = {
      name: this.workoutPlanForm.controls['name'].value,
      start_date: this.workoutPlanForm.controls['start_date'].value,
      end_date: this.workoutPlanForm.controls['end_date'].value,
      user_id: this.authService.userId
    }


    this.workoutPlanService.insertWorkoutPlan(body).subscribe({
      next: (response: WorkoutPlan) => {
        Swal.fire({
          icon: "success",
          title: "Plano de treino inserido"
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

    })
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
				const loading = new ButtonLoading(button);

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
						switch(error.error.message) {
							case "invalidForecast":
								this.setPage();
								break;
							default:
								Swal.fire(
									"Ocorreu um erro",
									"Algo inesperado aconteceu, tente novamente mais tarde",
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
