import { Component, OnChanges, OnInit } from '@angular/core';
import { Enumeracao } from '../models/enumeracao';
import { Produto } from '../models/produto';
import { MessageService } from 'primeng/api';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router"

@Component({
  selector: 'app-produto-cadastro',
  templateUrl: './produto-cadastro.component.html',
  styleUrls: ['./produto-cadastro.component.scss'],
  providers: [MessageService]
})
export class ProdutoCadastroComponent implements OnInit {

  value: boolean = false;
  unidadeMedida: any[] = [];
  unidadeMedidaSelecionada: any;
  public produtos: Produto[] = [];
  produtoSelecionado: Produto[] = [];
  produto: Produto = {};
  submitted: boolean = false;
  produtoDialog: boolean = false;
  public registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private messageService: MessageService, private router: Router, private activedRoute: ActivatedRoute) {
    this.registerForm = this.formBuilder.group({
      nome: ['', Validators.required],
      unidadeMedida: ['', Validators.required],
      quantidade: ['', Validators.required],
      preco: ['', Validators.required],
      produtoPerecivel: ['', Validators.required],
      dataValidade: ['', Validators.required],
      dataFabricacao: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadLocalStorage();
    this.setUnidadeDeMedida();    
    

  }

  validateDataValidade(produto: any): boolean {
    if (new Date().getTime() >= produto?.dataValidade?.getTime()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Data de validade inferior a data atual, produto encontra-se vencido.', life: 3000 });
      return false;
    } else {
      return true;
    }
  }

  validateDataFabricacao(produto: any): boolean {
    if (produto?.dataFabricacao.getTime() >= produto?.dataValidade?.getTime() && produto?.perecivel) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Data de fabricacao não pode ser superior a data de validade', life: 3000 });
      return false;
    } else {
      return true;
    }
  }

  saveProduto() {
    this.produto = this.registerForm.value;
    this.submitted = true;
    if (this.validateDataValidade(this.produto) && this.validateDataFabricacao(this.produto)) {
      if (this.produto.nome?.trim()) {
        if (this.produto.id) {
          this.produtos[this.findIndexById(this.produto.id)] = this.produto;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Produto atualizado', life: 3000 });
        }
        else {
          this.produto.id = Math.random().toString();
          this.produtos.push(this.produto);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Produto criado', life: 3000 });
        }
        localStorage.setItem("produtos", JSON.stringify(this.produtos));
        this.produtos = [...this.produtos];
        this.produtoDialog = false;
        this.produto = {};

      }
    }
  }

  findIndexById(id: string): number {    
    let index = -1;
    for (let i = 0; i < this.produtos.length; i++) {
      if (this.produtos[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  verificarEnumeracaoFracional(unidadeSelecionada: any): number {
    return unidadeSelecionada?.nome != 'Unidade' ? 3 : 0;
  }

  verificarEnumeracaoMode(unidadeSelecionada: any): boolean {
    return unidadeSelecionada?.nome != 'Unidade' ? true : false;
  }

  setUnidadeDeMedida() {
    this.unidadeMedida = [
      { nome: 'Litro', abreviacao: 'LT' },
      { nome: 'Quilograma', abreviacao: 'KG' },
      { nome: 'Unidade', abreviacao: 'UN' }
    ]
  }

  buttonCancelar() {
    this.router.navigate(['/']);
  }

  async loadLocalStorage() {
    this.produtos = await JSON.parse(localStorage.getItem('produtos') || '{}');
    this.loadProduto();
  }

  loadProduto() {
    let id: any = this.activedRoute.snapshot.paramMap.get('id');
    let index: any;
    if (id !== null) {
      for (let i = 0; i < this.produtos.length; i++) {
        if (this.produtos[i].id === id) {
          index = i;
        }
        this.produto = this.produtos[index];        
        setTimeout(() => {
          this.registerForm.setValue(this.produtos[index]);  
        }, 100);
      }
    }

  }
}
