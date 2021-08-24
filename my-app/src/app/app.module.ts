import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {AutosizeModule} from 'ngx-autosize';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';


import { AppComponent } from './app.component';
import { BlockyModule } from './blockly/blocky.module';
import { StudentSiteComponent } from './student-site/student-site.component';
import { DBDiagramComponent } from './db-diagram/db-diagram.component';
import { TableComponent} from './table/table.component';
import { DbTextComponent } from './db-text/db-text.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { StartComponent } from './start/start.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentSiteComponent,
    DBDiagramComponent,
    TableComponent,
    DbTextComponent,
    ImpressumComponent,
    FileUploadComponent,
    StartComponent,
    HomeComponent,

  ],
  imports: [
    BlockyModule,
    MDBBootstrapModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    AutosizeModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
