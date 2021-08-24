import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  no_db_detected=false;
  sub1;

  constructor(public router: Router, private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.sub1 = this.webSocketService.listen('no-db-error').subscribe((data:any)=>{
    this.no_db_detected=true;
    })
  }
  tohome(){
    this.router.navigateByUrl("/home")
  }
  ngOnDestroy ()
  {
    this.sub1.unsubscribe()
  }

}
