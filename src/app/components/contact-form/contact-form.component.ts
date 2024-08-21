import { CommonModule,Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { DataService } from '../../services/data.service';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectButtonModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    ToolbarModule,
    ConfirmDialogModule,
    TooltipModule,
    TableModule,
    DialogModule
  ],
  providers:[MessageService, ConfirmationService],

  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent implements OnInit {
  contactId: number | null = null;
  contactForm: FormGroup = new FormGroup({});
  telefonoForm: FormGroup = new FormGroup({});
  direccionForm: FormGroup = new FormGroup({});
  emailForm: FormGroup = new FormGroup({});
  dataContact: any = {};
  dataDirecciones: any = [];
  dataTelefonos: any = [];
  dataEmails: any = [];

  flagDireccion: boolean = false;
  flagTelefono: boolean = false;
  flagEmail: boolean = false;
  
  get fControl() { return this.contactForm.controls }
  get fControlTel() { return this.telefonoForm.controls }
  get fControlDir() { return this.direccionForm.controls }
  get fControlEmail() { return this.emailForm.controls }

  get fValue() { return this.contactForm.value }
  get fValueTel() { return this.telefonoForm.value }
  get fValueDir() { return this.direccionForm.value }
  get fValueEmail() { return this.emailForm.value }
  get registros(): FormArray {
    return this.telefonoForm.get('registros') as FormArray;
  }
  

  constructor(private dataService: DataService, 
    private formBuilder: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private message: MessageService,
    private confirmationService: ConfirmationService,
  ){

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.contactId = params['contactId'] ? +params['contactId'] : this.contactId;
      this.inicial();
    });
  }

  inicial(){
    if(this.contactId==null){
      this.generaForm();
    }else{
      this.generaForm();
      this.getDataContact();
    }
  }

  generaForm(){
    this.contactForm = this.formBuilder.group({
      id: [null],
      nombre: [null, [Validators.required]],
      apellido: [null, [Validators.required]],
    });
    this.enableForms();
  }

  getDataContact(){
    this.spinner.show();
    this.dataService.getContact(this.contactId).subscribe({
      next: (data) => {
        if (!data?.error) {
          this.spinner.hide();
          this.dataContact = data;
          this.contactForm = this.formBuilder.group({
            id: [data.id,[Validators.required]],
            nombre: [data.nombre,[Validators.required]],
            apellido: [data.apellido,[Validators.required]],
          });
          this.dataEmails = data.emails;
          this.dataDirecciones = data.direcciones;
          this.dataTelefonos = data.telefonos;
          //this.message.add({ severity: 'success', summary: 'Correcto', detail: data.message });
          
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
  }

  enableForms(){
    this.contactForm.enable();
    this.direccionForm.enable();
    this.telefonoForm.enable();
    this.emailForm.enable();
  }

  save(){
    if(!this.contactForm.valid){
      return this.message.add({ severity: 'error', summary: 'Error', detail: 'Por favor llene el formulario de contacto correctamente' });
    }

    this.spinner.show();
    let service:Observable<any>;
    if(this.contactId!=null){
      service = this.dataService.updateContact(this.contactId, this.fValue);
    }else{
      service = this.dataService.saveContact(this.fValue);
    }

    service.subscribe({
      next: (data) => {
        if (!data?.error) {
          this.spinner.hide();
          this.message.add({ severity: 'success', summary: 'Correcto', detail: data.message });
          this.contactId = data.data;
          this.getDataContact();
        } else {
          this.spinner.hide().finally(() => {
            if (data?.message) {
              this.message.add({ severity: 'error', summary: 'Error', detail: data.message });
            } else {
              this.message.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al enviar los datos.' });
            }
          })
        }
      },
      error: (data) => {
        this.spinner.hide().finally(() => {
          if (data) {
            this.message.add({ severity: 'error', summary: 'Error', detail: data.message ? data.message : data });
          } else {
            this.message.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al enviar los datos.' });
          }
        })
      }
    });
  }

  newDireccion(){
    this.direccionForm = this.formBuilder.group({
      id:[null],
      direccion:[null,[Validators.required,Validators.maxLength(200)]],
      ciudad:[null,[Validators.required,Validators.maxLength(200)]],
      estado:[null,[Validators.required,Validators.maxLength(200)]],
      codigo_postal:[null,[Validators.required,Validators.maxLength(200)]],
      contacto_id:[this.contactId],
    });
  }

  viewDireccion(data:any){
    this.flagDireccion = true;
    this.newDireccion();
    this.direccionForm.patchValue(data);
  }

  saveDireccion(){
    if(!this.direccionForm.valid){
      return this.message.add({ severity: 'error', summary: 'Error', detail: 'Por favor llene el formulario de contacto correctamente' });
    }
    this.spinner.show();
    let service:Observable<any>;
    if(this.fValueDir.id!=null){
      service = this.dataService.updateAddreess(this.fValueDir.id, this.fValueDir);
    }else{
      service = this.dataService.saveAddress(this.fValueDir);
    }

    service.subscribe({
      next: (data) => {
        if (!data?.error) {
          this.spinner.hide();
          this.flagDireccion = false;
          this.message.add({ severity: 'success', summary: 'Correcto', detail: data.message });
          this.getDataContact();
        } else {
          this.spinner.hide().finally(() => {
            if (data?.message) {
              this.message.add({ severity: 'error', summary: 'Error', detail: data.message });
            } else {
              this.message.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al enviar los datos.' });
            }
          })
        }
      },
      error: (data) => {
        this.spinner.hide().finally(() => {
          if (data) {
            this.message.add({ severity: 'error', summary: 'Error', detail: data.message ? data.message : data });
          } else {
            this.message.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al enviar los datos.' });
          }
        })
      }
    });

  }

  newEmail(){
    this.emailForm = this.formBuilder.group({
      id:[null],
      email:[null,[Validators.required,Validators.maxLength(200), Validators.email]],
      contacto_id:[this.contactId],
    });
  }
  viewEmail(data: any){
    this.flagEmail = true;
    this.newEmail();
    this.emailForm.patchValue(data);
  }
  saveEmail(){
    if(!this.emailForm.valid){
      return this.message.add({ severity: 'error', summary: 'Error', detail: 'Por favor llene el formulario de contacto correctamente' });
    }
    this.spinner.show();
    let service:Observable<any>;
    if(this.fValueEmail.id!=null){
      service = this.dataService.updateEmail(this.fValueEmail.id, this.fValueEmail);
    }else{
      service = this.dataService.saveEmail(this.fValueEmail);
    }

    service.subscribe({
      next: (data) => {
        if (!data?.error) {
          this.spinner.hide();
          this.flagEmail = false;
          this.message.add({ severity: 'success', summary: 'Correcto', detail: data.message });
          this.getDataContact();
        } else {
          this.spinner.hide().finally(() => {
            if (data?.message) {
              this.message.add({ severity: 'error', summary: 'Error', detail: data.message });
            } else {
              this.message.add({ severity: 'error', summary: 'Error', detail: data.message? data.message : 'Ocurrio un error al enviar los datos.' });
            }
          })
        }
      },
      error: (data) => {
        this.spinner.hide().finally(() => {
          if (data) {
            this.message.add({ severity: 'error', summary: 'Error', detail: data.error.message ? data.error.message : 'Error' });
          } else {
            this.message.add({ severity: 'error', summary: 'Error', detail: data.error.message ? data.error.message : 'Ocurrio un error al enviar los datos.' });
          }
        })
      }
    });
  }

  newTelefono(){
    this.telefonoForm = this.formBuilder.group({
      id:[null],
      numero:[null,[Validators.required,Validators.maxLength(200)]],
      contacto_id:[this.contactId],
    });
  }
  viewTelefono(data: any){
    this.flagTelefono = true;
    this.newTelefono();
    this.telefonoForm.patchValue(data);
  }

  saveTelefono(){
    if(!this.telefonoForm.valid){
      return this.message.add({ severity: 'error', summary: 'Error', detail: 'Por favor llene el formulario de contacto correctamente' });
    }
    this.spinner.show();
    let service:Observable<any>;
    if(this.fValueTel.id!=null){
      service = this.dataService.updatePhone(this.fValueTel.id, this.fValueTel);
    }else{
      service = this.dataService.savePhone(this.fValueTel);
    }

    service.subscribe({
      next: (data) => {
        if (!data?.error) {
          this.spinner.hide();
          this.flagTelefono = false;
          this.message.add({ severity: 'success', summary: 'Correcto', detail: data.message });
          this.getDataContact();
        } else {
          this.spinner.hide().finally(() => {
            if (data?.message) {
              this.message.add({ severity: 'error', summary: 'Error', detail: data.message });
            } else {
              this.message.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al enviar los datos.' });
            }
          })
        }
      },
      error: (data) => {
        this.spinner.hide().finally(() => {
          if (data) {
            this.message.add({ severity: 'error', summary: 'Error', detail: data.message ? data.message : data });
          } else {
            this.message.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error al enviar los datos.' });
          }
        })
      }
    });
  }

  deleteRow(id:number,origen:string){
    let service: Observable<any>;
    switch(origen){
      case 'telefono':
        service = this.dataService.deletePhone(id);
        break;
      case 'direccion':
        service = this.dataService.deleteAddress(id);
        break;
      case 'email':
        service = this.dataService.deleteEmail(id);
        break;

    }
    this.confirmationService.confirm({
      key: 'confirm1',
      message: '¿Está seguro de eliminar el registro?',
      accept: () => {
        this.spinner.show().finally(() => {
          service.subscribe({
            next: (data) => {
              if (!data?.error) {
                this.spinner.hide();
                this.message.add({ severity: 'success', summary: 'Correcto', detail: data.message });
                this.getDataContact();
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

  back(){
    this.location.back();
  }
  

  
}
