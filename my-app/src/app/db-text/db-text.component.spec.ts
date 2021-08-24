import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbTextComponent } from './db-text.component';

describe('DbTextComponent', () => {
  let component: DbTextComponent;
  let fixture: ComponentFixture<DbTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
