import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToyDetail } from './toy-detail';

describe('ToyDetail', () => {
  let component: ToyDetail;
  let fixture: ComponentFixture<ToyDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToyDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(ToyDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
