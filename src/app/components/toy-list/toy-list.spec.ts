import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToyList } from './toy-list';

describe('ToyList', () => {
  let component: ToyList;
  let fixture: ComponentFixture<ToyList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToyList],
    }).compileComponents();

    fixture = TestBed.createComponent(ToyList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
