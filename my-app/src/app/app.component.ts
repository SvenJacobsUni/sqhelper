import { Component, OnInit, ViewChild } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { ModalContainerComponent } from 'angular-bootstrap-md';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('setsModal', { static: true }) setsModal: ModalContainerComponent;
  constructor( private titleService: Title,private webSocketService: WebSocketService) {}

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
  ngOnInit() {
    this.setTitle("SQheLper");

    this.webSocketService.listen('temp_user_id').subscribe((data:any)=>{
      window.localStorage.setItem("temp_user_id", data);
    })


  }
}
