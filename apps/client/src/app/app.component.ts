import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'sqs-image-submitting-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'client';

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private toastrService: ToastrService,
    private socket: Socket
  ) {}

  protected imageQuantity = this.formBuilder.control(10);

  protected solicitar() {
    this.httpClient
      .post('http://localhost:3000/solicitar-imagens', {
        imageQuantity: this.imageQuantity.value,
      })
      .subscribe({
        next: (response: any) => {
          this.toastrService.success(
            'Imagens geradas com sucesso',
            response.message
          );
        },
        error: (error) => {
          this.toastrService.error(
            error.error.message,
            'Erro ao enviar solicitação'
          );
          console.log(error);
        },
      });
  }

  ngOnInit(): void {
    console.log("init")
    this.socket.connect();
    console.log("connect")
    this.socket.fromEvent('Imagem gerada com sucesso').subscribe({
      next: (value) => {
        console.log('value', value);
        this.toastrService.success(
          'Imagem gerada com sucesso',
          value as string
          );
        },
        error: (error) => {
        console.log("err")
        console.log(error);
      },
    });
  }
}
