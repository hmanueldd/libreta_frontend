import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DataService } from './services/data.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
    ButtonModule,
    TableModule,
    TagModule,
    IconFieldModule,
    InputIconModule
  ],
  providers:[DataService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  contacts: any = [];

  constructor(private dataService: DataService){}

  ngOnInit(): void {
      this.dataService.getContactos().subscribe(data => {
        this.contacts = data;
      });
  }

}
