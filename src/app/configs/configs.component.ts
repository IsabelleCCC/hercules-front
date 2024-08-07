import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { UpdatetUser, User } from '../models/user.model';
import { ButtonLoading } from '../helpers/button-loading';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-configs',
  templateUrl: './configs.component.html',
  styleUrls: ['./configs.component.css'],
})
export class ConfigsComponent {
  public userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group({
      email: [
        null,
        [Validators.required, Validators.email, Validators.maxLength(180)],
      ],
      name: [null, [Validators.required, Validators.maxLength(100)]],
      password: [null, [Validators.required, Validators.maxLength(64)]],
      gender: [null, [Validators.required, Validators.maxLength(9)]],
      birth_date: [null, [Validators.required]],
    });

    this.userService.get(this.authService.userId).subscribe({
      next: (response: User) => {
        this.userForm.patchValue(response);
      },
    });
  }

  get userFormControls() {
    return this.userForm.controls;
  }

  updateUser(button: HTMLButtonElement) {
    const loading = new ButtonLoading(button);

    if (this.userForm.invalid) {
      Swal.fire(
        'Ocorreu um erro',
        'Certifique-se de que todos os campos estão preenchidos.',
        'error'
      );
      loading.remove();
      return;
    }

    this.userForm.disable();

    const body: UpdatetUser = {
      id: this.authService.userId,
      email: this.userFormControls['email'].value,
      name: this.userFormControls['name'].value,
      password: this.userFormControls['password'].value,
      gender: this.userFormControls['gender'].value,
      birth_date: this.userFormControls['birth_date'].value,
    };

    this.userService
      .update(body)
      .subscribe({
        next: (response: User) => {
          Swal.fire('Sucesso', 'Alterações realizadas com sucesso.', 'success');
          loading.remove();
        },

        error: (error: HttpErrorResponse) => {
          switch (error.error.detail) {
            case 'Usuário não encontrado.':
              loading.remove();
              Swal.fire('Ocorreu um erro', 'Usuário não encontrado.', 'error');
              break;
            default:
              loading.remove();
              Swal.fire(
                'Ocorreu um erro',
                'Algo inesperado aconteceu, tente novamente mais tarde.',
                'error'
              );
              break;
          }
        },
      })
      .add(() => this.userForm.enable());
  }
}
