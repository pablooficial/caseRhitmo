import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {
  radio0: boolean = true;
  radio1: boolean = false;
  buscarCep: string = '';
  forms: any;
  estados: any;
  cidades: any;
  estadoBusca: boolean = false;
  disabled: boolean = true;
  meses = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  anos = ['2024', '2025', '2026', '2027', '2028', '2029', '2030'];
  formaPagamento: any[] = [
    {
      nome: 'Cartão de Crédito'
    },
    {
      nome: 'Boleto Bancário'
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    private router: Router
  ) { }

  ngOnInit() {
    this.createForm();
    this.getEstados();
  }

  changeRadio(value: number) {
    if(value == 0) {
      this.radio0 = true;
      this.radio1 = false;
    }
    if(value == 1) {
      this.radio0 = false
      this.radio1 = true
    }
  }

  private createForm() {
    this.forms = this.formBuilder.group({
      nome: [{ value: '', disabled: false }, [Validators.required]],
      email: [{ value: '', disabled: false }, [Validators.required, Validators.email]],
      cpf: [{ value: '', disabled: false }, [Validators.required]],
      endereco: [{ value: '', disabled: false }, [Validators.required]],
      estado: [{ value: '', disabled: false }, [Validators.required]],
      cep: [{ value: '', disabled: false }, [Validators.required]],
      cidade: [{ value: '', disabled: false }, [Validators.required]],
      nomeCartao: [{ value: '', disabled: false }, [Validators.required]],
      dataExpiracaoMes: [{ value: '', disabled: false }, [Validators.required]],
      dataExpiracaoAno: [{ value: '', disabled: false }, [Validators.required]],
      numeroCartao: [{ value: '', disabled: false }, [Validators.required]],
      codigoSeguranca: [{ value: '', disabled: false }, [Validators.required]],
      dataCriacao: ['']
    })
  }

  getEstados() {
    this.appService.getEstados().subscribe({
      next: (res: any) => {
        this.estados = res
      }
    })
  }

  getCidades(UF: any) {
    if (UF) {
      this.appService.getCidades(UF).subscribe({
        next: (res: any) => {
          this.cidades = res;
          this.estadoBusca = true;
        }
      });
    } else {
      this.cidades = [];
      this.disabled = true;
    }
  }

  getByCep(cep: string) {
    this.disabled = false
    if(cep.length == 8) {
      this.appService.getByCep(cep).subscribe({
        next: (res: any) => {
          this.getCidades(res.uf);
          this.forms.patchValue({
            endereco: res.logradouro,
            estado: res.uf,
            cidade: res.localidade
          })
        }
      })
    }
  }

  submitForm() {
    const formValues = this.forms.value;
    formValues.dataCriacao = new Date()
    if (this.forms.valid) {
      this.appService.createClients(formValues).subscribe({
        next: res => {
          this.router.navigate(['/lista'])
          console.log('form', formValues)
        }, error: err => err
      })
    } else {
      window.alert('Preencha todos os campos corretamente')
    }
  }
}
