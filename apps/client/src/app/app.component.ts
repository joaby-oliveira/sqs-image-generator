import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'sqs-image-submitting-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'client';

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) {}

  protected imageQuantity = this.formBuilder.control(0);

  protected solicitar() {
    this.httpClient
      .post('http://localhost:3000/solicitar-imagens', {})
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
