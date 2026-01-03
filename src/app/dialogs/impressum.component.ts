import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-impressum',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Impressum</h2>
    <mat-dialog-content class="mat-typography">
      <h3>Angaben gemaess § 5 TMG</h3>
      <p>Sven Jacobs</p>
      <p>Didaktik der Informatik</p>
      <p>Universitaet Siegen<br />
      Hoelderlinstrasse 3a<br />
      57076 Siegen</p>

      <h3>Kontakt</h3>
      <p>Telefon: 027122298937<br />
      E-Mail: sven.jacobs&#64;uni-siegen.de</p>

      <h3>Weitere Hinweise</h3>
      <p>Diese Seite entstand im Rahmen meiner Bachelorarbeit an der Universitaet Siegen. Die Webanwendung kann mit wenigen Schritt selbst gehostet werden:</p>
      <a mat-raised-button color="primary" href="https://github.com/SvenJacobsUni/sqhelper" target="_blank">
        <mat-icon>code</mat-icon> Quellcode
      </a>
      <br />

      <section>
        <h2>MIT License</h2>
        <p>Copyright (c) University of Siegen</p>

        <p>
          Permission is hereby granted, free of charge, to any person obtaining a copy
          of this software and associated documentation files (the "Software"), to deal
          in the Software without restriction, including without limitation the rights
          to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
          copies of the Software, and to permit persons to whom the Software is
          furnished to do so, subject to the following conditions:
        </p>

        <p>
          The above copyright notice and this permission notice shall be included in all
          copies or substantial portions of the Software.
        </p>

        <p>
          <code>
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
          </code>
        </p>
      </section>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Okay</button>
    </mat-dialog-actions>
  `
})
export class ImpressumComponent { }
