import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ButtonLoading } from '../helpers/button-loading';
import { Register } from '../models/register.model';
import { UserService } from '../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  public registerForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private route: ActivatedRoute) {
    this.registerForm = this.fb.group({
			email: [null, [
				Validators.required,
				Validators.email,
				Validators.maxLength(180)
			]],
			name: [null, [
				Validators.required,
				Validators.maxLength(100)
			]],
			password: [null, [
				Validators.required,
				Validators.maxLength(64)
			]],
      gender: [null, [
				Validators.required,
				Validators.maxLength(9)
			]],
      birth_date: [null, [
				Validators.required
			]]
		});
  }

  get registerFormControls() {
    return this.registerForm.controls;
  }

  register(button: HTMLButtonElement): void {
    const loading = new ButtonLoading(button);

    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      Swal.fire(
        "Ocorreu um erro",
        "Valores inseridos inválidos.",
        "error"
      );
    }

    this.registerForm.disable();

    const body: Register = {
      email: this.registerFormControls['email'].value,
      password: this.registerFormControls['password'].value,
      name: this.registerFormControls['name'].value,
      gender: this.registerFormControls['gender'].value,
      birth_date: this.registerFormControls['birth_date'].value
    }

    this.userService.register(body).subscribe({
      next: (response: Register) => {
        Swal.fire(
          "Sucesso",
          "Cadastro realizado com sucesso, faça o login.",
          "success"
        ).then(() => {
          this.router.navigate(["/login"])
        })
      },

      error: (error: HttpErrorResponse) => {
        switch (error.error.detail) {
          case "O usuário com este e-mail já existe.":
            loading.remove()
            Swal.fire(
              "Ocorreu um erro",
              "O usuário com este e-mail já existe.",
              "error"
            );
            break;
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

    }).add(() => this.registerForm.enable());
  }
}
