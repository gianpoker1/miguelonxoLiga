import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  userName!: string;
  password!: string;

  constructor(private authService: AuthService,
    private router: Router) { }

    onSubmit() {
      this.authService.login(this.userName, this.password).subscribe(result => {
        console.log('Resultado del inicio de sesion', result);
        if(result){
          if(this.authService.isAdmin()){
            this.router.navigate(['/admin']);
          }else if (this.authService.isPlayer()){
            this.router.navigate(['/player']);
          }
        }else {
          alert('Usuario o contraseña incorrectos');
        }
      });
    }

}
