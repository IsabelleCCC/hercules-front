import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginModel } from '../models/auth/login.model';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BearerTokenModel } from '../models/auth/bearer-token.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonLoading } from '../helpers/button-loading';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  public loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private route: ActivatedRoute) {
		this.loginForm = this.fb.group({
			email: [null, [
				Validators.required,
				Validators.email,
				Validators.maxLength(180)
			]],
			password: [null, [
				Validators.required,
				Validators.maxLength(64)
			]]
		});
	}

  ngOnInit() {
  }

  get loginFormControls() {
    return this.loginForm.controls;
  }

  login(button: HTMLButtonElement): void {
    const loading = new ButtonLoading(button);

    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    this.loginForm.disable();

    const body: LoginModel = {
      email: this.loginFormControls['email'].value,
      password: this.loginFormControls['password'].value
    }

    this.authService.login(body).subscribe({
      next: (response: BearerTokenModel) => {
        localStorage.setItem('token', response.access_token)
        this.router.navigate(["/home"]);
      },

      error: (error: HttpErrorResponse) => {
        switch (error.error.detail) {
          case "E-mail incorreto.":
            loading.remove()
            Swal.fire(
              "Ocorreu um erro",
              "E-mail incorreto.",
              "error"
            );
            break;
          case "Senha incorreta.":
            loading.remove()
            Swal.fire(
              "Ocorreu um erro",
              "Senha incorreta.",
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

    }).add(() => this.loginForm.enable());
  }
}
