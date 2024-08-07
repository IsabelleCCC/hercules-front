import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressoPesoComponent } from './progresso-peso.component';

describe('ProgressoPesoComponent', () => {
  let component: ProgressoPesoComponent;
  let fixture: ComponentFixture<ProgressoPesoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressoPesoComponent]
    });
    fixture = TestBed.createComponent(ProgressoPesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
