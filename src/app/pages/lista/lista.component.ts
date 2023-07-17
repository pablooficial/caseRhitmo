import { Component } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { IClient } from 'src/app/models/client.model';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent {
  clients: IClient[] = [];
  displayedColumns: any;
  filteredClients: IClient[] = [];
  filterValue: string = '';
  carregandoDados: boolean = true;

  constructor(
    private appService: AppService
  ) {
    this.displayedColumns = [
      'name',
      'email',
      'cpf',
      'createdAt',
      'icons'
    ]
  }

  ngOnInit() {
    this.getClients();
  }

  getClients() {
    this.filterValue = ''
    this.appService.getClients().subscribe({
      next: res => {
        setInterval(() => {
          this.carregandoDados = false
        }, 1000)
        this.clients = res
        this.filteredClients = res;
      }
    })
  }

  deleteClients(id: number) {
    this.appService.deleteClients(id).subscribe({
      next: res => {
        this.ngOnInit()
      }
    })
  }

  filterClients() {
    const searchTerm = this.filterValue.trim().toLowerCase();
    this.filteredClients = this.clients.filter(client =>
      client.nome.toLowerCase().includes(searchTerm)
    );
  }
}
