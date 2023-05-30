export class ClienteModel {
    id? : number; 
    idCliente : string; 
    nombre : string; 
    apellido1 : string; 
    apellido2 : string; 
    telefono : string; 
    celular : string;
    direccion : string;
    correo : string; 
    fechaIngreso? : Date; /*EL SIGNO DE PREGUNTA INDICA QUE EL VALOR DE LA VARIABLE PUEDE SER OPCIONAL*/
    constructor(c? : ClienteModel){
        if (this.id !== undefined) { //EL DOBLE "==" COMPARA EL TIPO DE DATO Y EL VALOR QUE SEAN IGUALES EL "===" COMPARA EL TIPO DE DATO Y VALOR JUNTOS
            this.id = c?.id;            
        }

        this.idCliente = c !== undefined ? c.idCliente : '';
        this.nombre = c !== undefined ? c.nombre : '';
        this.apellido1 = c !== undefined ? c.apellido1 : '';
        this.apellido2 = c !== undefined ? c.apellido2 : '';
        this.telefono = c !== undefined ? c.telefono : '';
        this.celular = c !== undefined ? c.celular : '';
        this.direccion = c !== undefined ? c.direccion : '';
        this.correo = c !== undefined ? c.correo : '';
        
        if (this.fechaIngreso !== undefined) { 
            this.fechaIngreso = c?.fechaIngreso;            
        }
    }
}
