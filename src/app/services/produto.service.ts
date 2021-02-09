import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Produto } from '../models/produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get<any>('assets/produtos.json')
    .toPromise()
    .then(res => <Produto[]>res.data)
    .then(data => { return data; });
  }
}
