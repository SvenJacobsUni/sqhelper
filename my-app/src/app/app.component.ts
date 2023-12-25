import { Component, OnInit, ViewChild } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { ModalContainerComponent } from 'angular-bootstrap-md';
import { Title } from '@angular/platform-browser';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('setsModal', { static: true }) setsModal: ModalContainerComponent;
  constructor(
    private titleService: Title,
    private webSocketService: WebSocketService,
    public impressum: MatDialog,
    public datenschutz: MatDialog,
    ) {}

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
  ngOnInit() {
    this.setTitle("SQheLper");

    this.webSocketService.listen('temp_user_id').subscribe((data:any)=>{
      window.localStorage.setItem("temp_user_id", data);
    })
  }
  openImpressum() {
    const dialogRef = this.impressum.open(ImpressumComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openDatenschutz() {
    const dialogRef = this.datenschutz.open(DatenschutzComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

@Component({
  selector: 'impressum',
  templateUrl: 'impressum.html',
})
export class ImpressumComponent {}

@Component({
  selector: 'datenschutz',
  templateUrl: 'datenschutz.html',
})
export class DatenschutzComponent {}
