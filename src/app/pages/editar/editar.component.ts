import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent {
  buscarCep: string = '';
  id = this.route.snapshot.params['id']
  client: any;
  estados: any;
  cidades: any;
  disabled: boolean = true;
  forms: any;
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
    private appService: AppService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.createForm();
    this.getEstados();
    this.getCliente();
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

  getCliente() {
    this.appService.getClientById(this.id).subscribe({
      next: res => {
        this.client = res
        this.getCidades(this.client.estado)
        this.forms.patchValue({
          nome: this.client.nome,
          email: this.client.email,
          cpf: this.client.cpf,
          endereco: this.client.endereco,
          estado: this.client.estado,
          cep: this.client.cep,
          cidade: this.client.cidade,
          nomeCartao: this.client.nomeCartao,
          dataExpiracaoMes: this.client.dataExpiracaoMes,
          dataExpiracaoAno: this.client.dataExpiracaoAno,
          numeroCartao: this.client.numeroCartao,
          codigoSeguranca: this.client.codigoSeguranca,
          dataCriacao: this.client.dataCriacao
        })
      }
    })
  }

  getByCep(cep: string) {
    this.disabled = false
    if(cep.length == 8) {
      this.appService.getByCep(cep).subscribe({
        next: (res: any) => {
          this.forms.patchValue({
            endereco: res.logradouro,
            estado: res.uf,
            cidade: res.localidade
          })
        }
      })
    }
  }


  getEstados() {
    this.appService.getEstados().subscribe({
      next: (res: any) => {
        console.log(res)
        this.estados = res
      }
    })
  }

  getCidades(UF: any) {
    if (UF) {
      this.appService.getCidades(UF).subscribe({
        next: (res: any) => {
          this.cidades = res;
          this.disabled = false;
        }
      });
    } else {
      this.cidades = [];
      this.disabled = true;
    }
  }

  submitForm() {
    const formValues = this.forms.value;
    formValues.dataCriacao = new Date()
    if (this.forms.valid) {
      this.appService.editClients(formValues, this.id).subscribe({
        next: res => {
          this.router.navigate(['/lista'])
        }, error: err => err
      })
    } else {
      window.alert('Preencha todos os campos corretamente')
    }
  }

}
