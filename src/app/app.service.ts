import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IClient } from './models/client.model'

@Injectable({
  providedIn: 'root'
})

export class AppService {
  private apiUrl = 'http://localhost:3000/clients'
  private govUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades'
  private cepUrl = 'https://viacep.com.br/ws'

  constructor(private http: HttpClient) { }

  public getClients(): Observable<IClient[]>{
    return this.http.get<IClient[]>(this.apiUrl)
  }

  public getClientById(id: number) {
    return this.http.get<IClient[]>(`${this.apiUrl}/${id}`)
  }

  public createClients(value: IClient): Observable<any>{
    return this.http.post(this.apiUrl,value)
  }

  public editClients(value: IClient, id: any): Observable<any>{
    return this.http.put(`${this.apiUrl}/${id}`, value)
  }

  public deleteClients(id: any): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`)
  }

  public getEstados() {
    return this.http.get(`${this.govUrl}/estados`)
  }

  public getCidades(UF: any) {
    return this.http.get(`${this.govUrl}/estados/${UF}/municipios`)
  }

  getByCep(cep: string) {
    return this.http.get(`${this.cepUrl}/${cep}/json/`)
  }
}
