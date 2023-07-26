import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  isSubmit = false; 
  form:FormGroup = this.fb.group({
     email:['aamir@yopmail.com',[Validators.required]],
     name:['aamir',[Validators.required]],
     password:['123456',[Validators.required]],
  }) 
  constructor(private fb:FormBuilder,private authService:AuthService) {}
 
  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) {
      return;
    }

    const { name,email, password } = this.form.value;
    this.authService.register(name,email, password).subscribe({next:(res) => {
      console.log(res);
      if(res.status ==='success'){
        alert(`Register Successfully`)
      }else {
        alert(res.message)
      }
    }});
  }
 
  get email():FormControl {
   return this.form.get('email') as FormControl
  }
 
  get password():FormControl {
   return this.form.get('password') as FormControl
  }

  get name():FormControl {
    return this.form.get('name') as FormControl
   }
}
