import { Enumeracao } from "./enumeracao";

export interface Produto {
    id?:string;    
    nome?:string;
    unidadeMedida?:Enumeracao;
    quantidade?:string;
    preco?:number;
    perecivel?:boolean;
    dataValidade?:Date;
    dataFabricacao?:Date;    
}