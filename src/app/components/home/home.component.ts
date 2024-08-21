import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DataService } from '../../services/data.service';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { TooltipModule } from 'primeng/tooltip';
import { FieldsetModule } from 'primeng/fieldset';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { error } from 'console';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, 
    TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, 
    DropdownModule, CommonModule, ButtonModule,ConfirmDialogModule, ToastModule,
    NgxSpinnerModule, TooltipModule, FieldsetModule, FormsModule, ReactiveFormsModule
  ],
  providers:[DataService, MessageService,ConfirmationService  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
  export class HomeComponent {
  contacts: any = [];
  loadingTable: boolean = false;
  contactId: number | null = null;
  formBusqueda: FormGroup = this.formBuilder.group({
    nombre:'',
    ciudad: '',
    estado: '',
    telefono: '',
    codigo_postal: '',
    email: ''
  });
  constructor(private dataService: DataService,
    private message: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    this.getContacts();
  }

  filterGlobal(dt1: Table, event: any) {
    dt1.filterGlobal(event.target.value, 'contains')
  }

  getContacts(){
    this.spinner.show();
    this.dataService.getContacts().subscribe(data => {
      this.contacts = data
      this.spinner.hide()
    });
  }

  openNew(contactId: any){
    this.router.navigate(['/contact-form'], {
      queryParams: { contactId: contactId}
    });
    this.contactId = contactId;
  }

  view(contact: any){
    this.openNew(contact.id);
  }

  del(contact: any){
    this.confirmationService.confirm({
      key: 'confirm1',
      message: '¿Está seguro de eliminar el registro?',
      accept: () => {
        this.spinner.show().finally(() => {
          this.dataService.deleteContact(contact.id).subscribe({
            next: (data) => {
              if (!data?.error) {
                this.spinner.hide();
                this.message.add({ severity: 'success', summary: 'Correcto', detail: data.message });
                this.getContacts();
              } else {
                this.spinner.hide().finally(() => {
                  if (data?.message) {
                    this.message.add({ severity: 'error', summary: 'Error', detail: data.message });
                  } else {
                    this.message.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al eliminar el registro.' });
                  }
                })
              }
            },
            error: (data) => {
              this.spinner.hide().finally(() => {
                if (data) {
                  this.message.add({ severity: 'error', summary: 'Error', detail: data.message ? data.message : data });
                } else {
                  this.message.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al eliminar el registro.' });
                }
              })
            }
          });
        });
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            break;
          case ConfirmEventType.CANCEL:
            break;
        }
      }
    });
  }

  clearFilters(){
    this.formBusqueda.reset();
    this.getContacts();
  }

  search(){

    const { ciudad, estado, codigo_postal, nombre, telefono, email } = this.formBusqueda.value;

    if (!ciudad && !estado && !codigo_postal && !nombre && !telefono && !email) {
        // Display an error or disable the submit button
        this.message.add({ severity: 'info', summary: 'Error', detail: 'Por favor llene al menos un campo' });
        return;
    }
    this.spinner.show();
    this.dataService.searchData(this.formBusqueda.value).subscribe({
      next:(data)=>{
        this.spinner.hide();
        this.contacts = data;
      },
      error:(data)=>{
        this.spinner.hide();
        this.message.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al realziar la búsqueda.' });
      }
    });
  }
}
