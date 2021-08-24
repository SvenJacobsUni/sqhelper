import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentSiteComponent } from './student-site.component';

describe('StudentSiteComponent', () => {
  let component: StudentSiteComponent;
  let fixture: ComponentFixture<StudentSiteComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentSiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
