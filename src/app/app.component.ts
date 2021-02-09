import { Component } from '@angular/core';
import { MegaMenuItem, MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'senior';
  
  items: MegaMenuItem[] = [];
  vertical: string = "vertical";

  ngOnInit() {
    this.items = [
      {
        label: 'Senior', icon: 'pi pi-fw pi-video',
        items: [
          [
            {
              label: 'Produtos',
              items: [{ label: 'Listagem', url:"produto-listagem" }, { label: 'Cadastro', url:"produto-cadastro/" }]              

            },            
          ],
        ]
      },
    ]
  }
}
