import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
sub1;
db_detected = false;

  constructor(private webSocketService: WebSocketService,public router: Router) { }

  ngOnInit(): void {
    this.webSocketService.emit('check-db-detected', {})
    this.sub1 = this.webSocketService.listen('db-detected').subscribe((data:any)=>{
      this.db_detected = data;
    })
  }
  tostart(){
    this.router.navigate(['../start']);
  }

  ngOnDestroy ()
  { // socket subscriptions wieder unsubsciben um memory-leak zu verhinden (bei vielen subs kann man die sicherlich in ein array pushen und mit ner schleife unsubben)
    this.sub1.unsubscribe()
  }

}
