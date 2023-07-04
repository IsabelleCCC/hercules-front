import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';
import { FitnessTest, GetFitnessTest } from '../models/fitness-test.model';
import { FitnessTestService } from '../services/fitness-test.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Toast } from '../helpers/toast';
import Swal from 'sweetalert2';
import { ButtonLoading } from '../helpers/button-loading';

@Component({
  selector: 'app-avaliacao-fisica',
  templateUrl: './avaliacao-fisica.component.html',
  styleUrls: ['./avaliacao-fisica.component.css'],
  styles: [
		`
			.light-blue-backdrop {
				background-color: #5cb3fd;
			}
		`,
	]
})

export class AvaliacaoFisicaComponent {
  public fitnessTestForm: FormGroup
  public fitnessTestList: GetFitnessTest[] = []
  closeResult?: string;

  constructor(private modalService: NgbModal, private fb: FormBuilder, private authService: AuthService, private fitnessTestService: FitnessTestService) {
    this.fitnessTestForm = this.fb.group({
			weight: [null, [
        Validators.required,
        Validators.min(1),
        Validators.max(999)
      ]],
      body_fat: [null, [
        Validators.min(1),
        Validators.max(999)
      ]],
      chest: [null, [
        Validators.min(1),
        Validators.max(999)
      ]],
      right_arm_contr: [null, [
        Validators.min(1),
        Validators.max(999)
      ]],
      left_arm_contr: [null, [
        Validators.min(1),
        Validators.max(999)
      ]],
      hip: [null, [
        Validators.min(1),
        Validators.max(999)
      ]],
      right_arm_relax: [null, [
        Validators.min(1),
        Validators.max(999)
      ]],
      left_arm_relax: [null, [
        Validators.min(1),
        Validators.max(999)
      ]],
      abdomen: [null, [
        Validators.min(1),
        Validators.max(999)
      ]],
      waist: [null, [
        Validators.min(1),
        Validators.max(999)
      ]],
      right_forearm: [null, [
        Validators.min(1),
        Validators.max(999)
      ]],
      left_forearm: [null, [
        Validators.min(1),
        Validators.max(999)
      ]],
      right_thigh: [null, [
        Validators.min(1),
        Validators.max(999)
      ]],
      left_thigh: [null, [
        Validators.min(1),
        Validators.max(999)
      ]],
      scapular: [null, [
        Validators.min(1),
        Validators.max(999)
      ]],
      right_calf: [null, [
        Validators.min(1),
        Validators.max(999)
      ]],
      left_calf: [null, [
        Validators.min(1),
        Validators.max(999)
      ]],
      observations: [null]
		});

    this.fitnessTestService.list(this.authService.userId).subscribe({
      next: (response: GetFitnessTest[]) => {
        this.fitnessTestList = response
        console.log(response)
      },
      error: (error: HttpErrorResponse) => {
        switch (error.error.detail) {
          default:
            this.fitnessTestList = []
            Toast.fire({
              icon: 'question',
              title: 'Nenhuma avaliação física associada a esse usuário.'
            })
            break;
        }
      }
    })
  }

  openModal(content: TemplateRef<any>) {
		this.modalService.open(content, { centered: true, scrollable: true });

	}

  setPage() {
		this.fitnessTestService.list(this.authService.userId).subscribe({
      next: (response: GetFitnessTest[]) => {
        this.fitnessTestList = response
        console.log(response)
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

  insertFitnessTest(button: HTMLButtonElement) {
    const loading = new ButtonLoading(button);

    this.fitnessTestForm.markAllAsTouched();

    if (this.fitnessTestForm.invalid) {
      Swal.fire(
        "Ocorreu um erro",
        "Certifique-se de que os valores inseridos são nválidos.",
        "error"
      );
      return
    }

    this.fitnessTestForm.disable();
    this.fitnessTestForm.value['user_id'] = this.authService.userId

    this.fitnessTestService.insert(this.fitnessTestForm.value).subscribe({
      next: (response: FitnessTest) => {
        Swal.fire(
          "Sucesso",
          "Avaliação inserida com sucesso.",
          "success"
        ).then(() => {
          this.modalService.dismissAll()
          this.setPage()
        })
      },

      error: (error: HttpErrorResponse) => {
        switch (error.error.detail) {
          default:
            loading.remove()
            Swal.fire(
              "Ocorreu um erro",
              "Algo inesperado aconteceu, tente novamente mais tarde.",
              "error"
            );
            break;
        }
      }

    }).add(() => this.fitnessTestForm.enable());
  }

  deleteFitnessTest(event: Event, button: HTMLButtonElement, id: number) {
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

				this.fitnessTestService.delete(id).subscribe({
					next: () => {
            Toast.fire({
              icon: 'success',
              title: 'Avaliação física deletada.'
            })

						this.setPage();
					},
					error: (error: HttpErrorResponse) => {
						switch(error.error.detail) {
							case "Avaliação física não encontrada.":
								this.setPage();
								break;
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

}
