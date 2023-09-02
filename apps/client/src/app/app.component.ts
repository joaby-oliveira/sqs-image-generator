import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'sqs-image-submitting-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'client';

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private toastrService: ToastrService
  ) {}

  protected imageQuantity = this.formBuilder.control(0);

  protected solicitar() {
    this.httpClient
      .post('http://localhost:3000/solicitar-imagens', {
        imageQuantity: this.imageQuantity.value,
      })
      .subscribe({
        next: (response: any) => {
          this.toastrService.success('Imagens geradas com sucesso', response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message, 'Erro ao enviar solicitação');
          console.log(error);
        },
      });
  }
}
