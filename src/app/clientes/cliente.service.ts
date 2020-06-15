import { Injectable } from '@angular/core';
// import localeEs from '@angular/common/locales/es';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente.js';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { formatDate, DatePipe, registerLocaleData } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint = 'http://localhost:8080/api';
  private httpHeaders = new HttpHeaders({
    'Content-Type' : 'application/json'
  });

  constructor(private http: HttpClient, private router: Router) { }

  // Lee un mock y lo devuelve como observable
  // getClientes(): Observable<Cliente[]> {
  //   return of(CLIENTES);
  // }

  // Convencional
  // getClientes(): Observable<Cliente[]> {
  //   return this.http.get<Cliente[]>(this.urlEndPoint);
  // }

  getClientes(): Observable<Cliente[]> {
    return this.http.get(`${this.urlEndPoint}/clientes`).pipe(
      tap( (response: any) => {
        console.log('Cliente service tap 1');
        (response as Cliente[]).forEach(cliente => {

        })
      }),
      map(response => {
        const clientes = response as Cliente[];
        return clientes.map(c => {
          c.nombre = c.nombre.toUpperCase();
          // registerLocaleData(localeEs, 'es');
          const datePipe = new DatePipe('es');
          c.createAt = datePipe.transform(c.createAt, 'EEEE dd, MMMM yyyy'); // fullDate, formatDate(c.createAt, 'dd-MM-yyyy', 'en-US');
          return c;
        });
      })
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(`${this.urlEndPoint}/clientes`, cliente, {headers: this.httpHeaders})
    .pipe(
      map( (response: any) => response.cliente as Cliente),
      catchError( e => {
        if (e.status == 400) {
          return throwError(e);
        }
        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/clientes/${id}`)
    .pipe(
      catchError( e => {
        this.router.navigate(['/clientes']);
        console.log(e.error);
        Swal.fire('Error al editar al cliente', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/clientes/${cliente.id}`, cliente, {headers: this.httpHeaders} )
    .pipe(
      catchError( e => {
        if (e.status == 400) {
          return throwError(e);
        }
        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/clientes/${id}`, {headers: this.httpHeaders})
    .pipe(
      catchError( e => {
        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
