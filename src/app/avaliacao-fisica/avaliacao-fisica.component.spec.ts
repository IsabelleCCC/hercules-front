import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliacaoFisicaComponent } from './avaliacao-fisica.component';

describe('AvaliacaoFisicaComponent', () => {
  let component: AvaliacaoFisicaComponent;
  let fixture: ComponentFixture<AvaliacaoFisicaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvaliacaoFisicaComponent]
    });
    fixture = TestBed.createComponent(AvaliacaoFisicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
