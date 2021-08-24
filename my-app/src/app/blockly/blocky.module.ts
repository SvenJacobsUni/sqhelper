import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import the new component
import { BlocklyComponent } from '../blockly/blockly.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from '../app.component';
import { NgxBlocklyModule } from 'ngx-blockly';


@NgModule({
  imports: [
    BrowserModule,
    NgxBlocklyModule
  ],
  declarations: [
    BlocklyComponent
  ],
  exports: [
    BlocklyComponent
  ],
})


export class BlockyModule { }


