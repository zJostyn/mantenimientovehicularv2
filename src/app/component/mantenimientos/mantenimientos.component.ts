import { Component, Injector } from '@angular/core';
import { UsuariosService } from 'src/app/service/usuarios.service';

@Component({
  selector: 'app-mantenimientos',
  templateUrl: './mantenimientos.component.html',
  styleUrls: ['./mantenimientos.component.css']
})
export class MantenimientosComponent {
  mantenimiento: any[] = [];
  bandera: boolean = false;

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    const usuariosService = this.injector.get(UsuariosService);
    console.log(this.obtenerMantenimientos());
  }

  get isBanderaSet(): boolean {
    return !!localStorage.getItem('bandera');
  }

  obtenerMantenimientos(): void {
    if (this.isBanderaSet) {
      const usuariosService = this.injector.get(UsuariosService);

      usuariosService.getMantenimientos().subscribe(
        (result) => {
          this.mantenimiento = result;
        },
        (error) => {
          console.error('Error al obtener registros de inicio de sesión', error);
        }
      );
    } else {
      console.log('error');
    }
  }
}
