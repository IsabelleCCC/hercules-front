import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoMuscularComponent } from './grupo-muscular.component';

describe('GrupoMuscularComponent', () => {
  let component: GrupoMuscularComponent;
  let fixture: ComponentFixture<GrupoMuscularComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrupoMuscularComponent]
    });
    fixture = TestBed.createComponent(GrupoMuscularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
