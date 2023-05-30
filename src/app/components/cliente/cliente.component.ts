import { Component, OnInit, inject } from '@angular/core';
import { ClienteService } from '../../shared/services/cliente.service';
import { ClienteModel } from '../../shared/models/cliente.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

//al ligar los componenetes empiezana compartir sus funciones y datos
@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  filtro: any;
  srvCliente = inject(ClienteService);
  fb = inject(FormBuilder);
  router = inject(Router);
  frmCliente: FormGroup;
  clientes = [new ClienteModel];
  titulo: string = '';
  constructor() {
    this.frmCliente = this.fb.group({
      id: [''],
      idCliente: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(15), Validators.pattern('[0-9]*')]], //requrido
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern('([A-Za-zÑñáéíóú])( ([A-Za-zÑñáéíóú])){0,1}')]],
      apellido1: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15), Validators.pattern('([A-Za-zÑñáéíóú]*)')]],
      apellido2: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15), Validators.pattern('([A-Za-zÑñáéíóú]*)')]],
      telefono: ['', [Validators.required, Validators.pattern('[0-9]{4}-[0-9]{4}')]],
      celular: ['', [Validators.pattern('[0-9]{4}-[0-9]{4}')]],
      direccion: ['', Validators.minLength(5)],
      correo: ['', [Validators.required, Validators.email]],
      fechaIngreso: ['']
    });
  }

  get F() {
    return this.frmCliente.controls;
  }

  onSubmit() {//Guardar

    //validacion para el boton de guardado que ya se hace en el html
    //if(this.frmCliente.invalid) return;

    const cliente = {
      idCliente: this.frmCliente.value.idCliente,
      nombre: this.frmCliente.value.nombre,
      apellido1: this.frmCliente.value.apellido1,
      apellido2: this.frmCliente.value.apellido2,
      telefono: this.frmCliente.value.telefono,
      celular: this.frmCliente.value.celular,
      direccion: this.frmCliente.value.direccion,
      correo: this.frmCliente.value.correo,
    }

const texto = this.frmCliente.value.id ? 'Cambios guardados!!!' : 'Creado con Exito!!!'

    this.srvCliente.guardar(cliente, this.frmCliente.value.id)
      .subscribe({
       complete : () => {
        Swal.fire({
          title: texto,
          icon: 'success',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1000
        });
        this.filtrar();
       },
       error : (e) => {
        switch(e){
          case 404:
            Swal.fire({
              title: 'Cliente no existe',
              icon: 'error',
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonColor: '#d33',
              cancelButtonText: 'Cerrar'
            });
            break;

            case 409:
              Swal.fire({
                title: 'idCliente ya existe',
                icon: 'error',
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cerrar'
              });
            break;
          }
  
        }
});
  
console.log('Guardado');

}


  onNuevo() {
    this.titulo = 'Nuevo Cliente';
    //console.log("Creando Nuevo");
    this.frmCliente.reset();
  }
  onEditar(id: any) {
    this.titulo = 'Editar Cliente';
    this.srvCliente.buscar(id).subscribe(
      data => {
        console.log(data);
        this.frmCliente.setValue(data)
      }
    );
    console.log("Editando ", id);
  }
  //se trabajó en clases
  onEliminar(id: any, nombre: string) {
    //agregado de confirmacion Noti
    Swal.fire({
      title: 'Seguro que quiere eliminar el cliente?',
      text: nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvCliente.eliminar(id).subscribe(
          {
            //next: () => {},
            complete: () => {
              Swal.fire(
                'Eliminado!',
                'Cliente eliminado de forma correcta.',
                'success'
              );
              this.filtrar();
            },
            error: (e) => { 
              switch(e){
                case 404:
                  Swal.fire({
                    title: 'Cliente no existe',
                    icon: 'info',
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cerrar'
                  });
                break;
                case 412:
                  Swal.fire({
                    title: 'No se puede eliminar el Cliente',
                    text : 'El cliente está ligado a un artefacto',
                    icon: 'info',
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cerrar'
                  });
                break;
              }
            }
          });
      }
    })
    /*
    console.log("Eliminando ",id);
    if (window.confirm("Seguro que desea Eliminar Cliente?")) {
      this.srvCliente.eliminar(id).subscribe(
        data =>{
          data;
          this.filtrar();

        });
    }*/
  }
  onInfo(id: any) {
    console.log("Info ", id);
  }

  onCerrar() {
    this.router.navigate([''])

  }

  filtrar() {
    this.srvCliente.filtrar(this.filtro, 1, 10)
      .subscribe(
        data => {
          this.clientes = Object(data);
          console.log(this.clientes);
        }
      );
  }

  ngOnInit() {
    this.filtro = { idCliente: '', nombre: '', apellido1: '', apellido2: '' };
    this.filtrar();

  }

}