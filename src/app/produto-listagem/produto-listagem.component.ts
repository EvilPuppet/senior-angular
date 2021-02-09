import { Component, OnInit } from '@angular/core';
import { Produto } from '../models/produto';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ProdutoService } from '../services/produto.service';

@Component({
  selector: 'app-produto-listagem',
  templateUrl: './produto-listagem.component.html',
  styleUrls: ['./produto-listagem.component.scss'],
  providers:[MessageService, ConfirmationService]
})
export class ProdutoListagemComponent implements OnInit {

  produtos: Produto[] = [];
  produtoSelecionado: Produto[] = [];
  produto: Produto = {};
  submitted: boolean = false;
  produtoDialog: boolean = false;

  constructor(private produtoService: ProdutoService, private messageService: MessageService,private confirmationService: ConfirmationService) { }  

  ngOnInit(): void {
    this.produtoService.getProducts().then(data => {
        this.produtos = data;
        if (localStorage.getItem('produtos') === null)  {
          localStorage.setItem("produtos", JSON.stringify(data));
        }        
        this.produtos = [...JSON.parse(localStorage.getItem('produtos') || '{}')];                
    });
    
  }

  deleteProdutoSelecionado() {
    this.confirmationService.confirm({
        message: 'Tem certeza que deseja excluir os Produtos selecionados?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.produtos = this.produtos.filter(val => !this.produtoSelecionado.includes(val));
            this.produtoSelecionado = [];
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Produtos Excluídos', life: 3000});
        }
    });
  }

  editProduto(produto: Produto) {
    this.produto = {...produto};
    this.produtoDialog = true;
  }

  deleteProduto(produto: Produto) {
    this.confirmationService.confirm({
        message: 'Tem certeza que deseja excluir ' + produto.nome + '?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.produtos = this.produtos.filter(val => val.id !== produto.id);
            this.produto = {};
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Produto Excluído', life: 3000});
        }
    });
  }

  hideDialog() {
    this.produtoDialog = false;
    this.submitted = false;
  }

  saveProduto() {
    this.submitted = true;

    if (this.produto.nome?.trim()) {
        if (this.produto.id) {
            this.produtos[this.findIndexById(this.produto.id)] = this.produto;                
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Produto Updated', life: 3000});
        }
        else {
            this.produto.id = this.createId();            
            this.produtos.push(this.produto);
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Produto Created', life: 3000});
        }

        this.produtos = [...this.produtos];
        this.produtoDialog = false;
        this.produto = {};
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


  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 5; i++ ) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

}
