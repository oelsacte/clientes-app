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

  getClientes(page: number): Observable<Cliente[]> {
    return this.http.get(`${this.urlEndPoint}/clientes/page/${page}`).pipe(
      tap( (response: any) => {
        console.log('Cliente service tap 1');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        });
      }),
      map( (response: any) => {
        (response.content as Cliente[]).map(c => {
          c.nombre = c.nombre.toUpperCase();
          return c;
        });
        return response;
      }),
      tap(response => {
        console.log('Cliente service tap 2');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
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
        console.log(e.error.mensaje);
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
