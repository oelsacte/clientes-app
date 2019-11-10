import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css']
})
export class DirectivaComponent implements OnInit {

  public listaCursos = ['Typescript', 'Javascript', 'Java', 'PHP', 'C#'];

  public habilitar = true;


  constructor() { }

  ngOnInit() {
  }

  setHabilitar() {
    this.habilitar = (this.habilitar === true) ? false : true;
  }

}
