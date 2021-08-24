import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements OnInit {
  selectedFile;
  fReader;
  name = '';
  uploadPercent;

  color = 'primary';
  mode = 'determinate';
  sub1;
  sub2;
  sub3;
  sub4;

  constructor(private webSocketService: WebSocketService, public router: Router) {}

  ngOnInit() {

    this.sub1 = this.webSocketService.listen('MoreData').subscribe((data:any)=>{
      this.uploadPercent = data['percent'];
      let startingRange = data['startingRange'] * 5000000; //The Next Blocks Starting Position
      let newFile; //The Variable that will hold the new Block of data
      newFile = this.selectedFile.slice(
        startingRange,
        startingRange +
          Math.min(5000000, this.selectedFile.size - startingRange)
      );

      this.fReader.readAsBinaryString(newFile);
    });

    this.sub2 = this.webSocketService.listen('Done').subscribe((data:any)=>{
      this.uploadPercent = 100;
      this.router.navigate(['start']);
    });

    this.sub3 = this.webSocketService.listen('upload-error').subscribe((data:any)=>{
      alert(data);
    });
    this.sub4 = this.webSocketService.listen('wrongdata').subscribe((data:any)=>{
      alert(data);
    });
  }


  onFileSelect(event) {
    this.selectedFile = event.target.files[0];
    this.name = this.selectedFile.name;
    console.log(this.selectedFile);
    this.upload();
  }

  upload() {
    this.fReader = new FileReader();
    this.fReader.onload = (event) => {
      this.webSocketService.emit('Upload', {
        fileName: this.name,
        data: event.target.result,
        size: this.selectedFile.size
      });
    };
    this.webSocketService.emit('Start', {
      fileName: this.name,
      size: this.selectedFile.size,
    });
  }

  ngOnDestroy ()
  { // socket subscriptions wieder unsubsciben um memory-leak zu verhinden
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
    this.sub4.unsubscribe();
  }
}
