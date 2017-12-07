import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  DatatableComponent,
  DataTableHeaderCellComponent,
  DataTableBodyRowComponent,
  DataTableBodyCellComponent
} from '.';
import { NgxDatatableModule } from '../datatable.module';

let fixture: ComponentFixture<TestFixtureComponent>;
let component: TestFixtureComponent;

describe('DatatableComponent', () => {
  beforeEach(async(setupTest));

  it('should sort date values', () => {
    const initialRows = [
      { birthDate: new Date(1980, 11, 1) },
      { birthDate: new Date(1978, 8, 5) },
      { birthDate: new Date(1995, 4, 3) }
    ];

    const columns = [
      {
        prop: 'birthDate'
      }
    ];

    component.rows = initialRows;
    component.columns = columns;
    fixture.detectChanges();

    // sort by `birthDate` ascending
    sortBy({ column: 1 });
    fixture.detectChanges();

    expect(textContent({ row: 1, column: 1 })).toContain('1978', 'Ascending');
    expect(textContent({ row: 2, column: 1 })).toContain('1980', 'Ascending');
    expect(textContent({ row: 3, column: 1 })).toContain('1995', 'Ascending');

    // sort by `birthDate` descending
    sortBy({ column: 1 });
    fixture.detectChanges();

    expect(textContent({ row: 1, column: 1 })).toContain('1995', 'Descending');
    expect(textContent({ row: 2, column: 1 })).toContain('1980', 'Descending');
    expect(textContent({ row: 3, column: 1 })).toContain('1978', 'Descending');
  });

  it('should sort number values', () => {
    const initialRows = [
      { id: 5  },
      { id: 20 },
      { id: 12 }
    ];

    const columns = [
      {
        prop: 'id'
      }
    ];

    component.rows = initialRows;
    component.columns = columns;
    fixture.detectChanges();

    // sort by `id` ascending
    sortBy({ column: 1 });
    fixture.detectChanges();

    expect(textContent({ row: 1, column: 1 })).toContain('5', 'Ascending');
    expect(textContent({ row: 2, column: 1 })).toContain('12', 'Ascending');
    expect(textContent({ row: 3, column: 1 })).toContain('20', 'Ascending');

    // sort by `id` descending
    sortBy({ column: 1 });
    fixture.detectChanges();

    expect(textContent({ row: 1, column: 1 })).toContain('20', 'Descending');
    expect(textContent({ row: 2, column: 1 })).toContain('12', 'Descending');
    expect(textContent({ row: 3, column: 1 })).toContain('5', 'Descending');
  });

  it('should sort string values', () => {
    const initialRows = [
      { product: 'Computers' },
      { product: 'Bikes' },
      { product: 'Smartphones'}
    ];

    const columns = [
      {
        prop: 'product'
      }
    ];

    component.rows = initialRows;
    component.columns = columns;
    fixture.detectChanges();

    // sort by `product` ascending
    sortBy({ column: 1 });
    fixture.detectChanges();

    expect(textContent({ row: 1, column: 1 })).toContain('Bikes', 'Ascending');
    expect(textContent({ row: 2, column: 1 })).toContain('Computers', 'Ascending');
    expect(textContent({ row: 3, column: 1 })).toContain('Smartphones', 'Ascending');

    // sort by `product` descending
    sortBy({ column: 1 });
    fixture.detectChanges();

    expect(textContent({ row: 1, column: 1 })).toContain('Smartphones', 'Descending');
    expect(textContent({ row: 2, column: 1 })).toContain('Computers', 'Descending');
    expect(textContent({ row: 3, column: 1 })).toContain('Bikes', 'Descending');
  });

  it('should sort with a custom comparator', () => {
    const initialRows = [
      { product: 'Smartphones'},
      { product: 'Cars' },
      { product: 'Bikes' }
    ];

    const columns = [
      {
        prop: 'product',
        comparator: (productA: string, productB: string) => {
          return productA.length - productB.length;
        }
      }
    ];

    component.rows = initialRows;
    component.columns = columns;
    fixture.detectChanges();

    // sort by `product` ascending
    sortBy({ column: 1 });
    fixture.detectChanges();

    expect(textContent({ row: 1, column: 1 })).toContain('Cars', 'Ascending');
    expect(textContent({ row: 2, column: 1 })).toContain('Bikes', 'Ascending');
    expect(textContent({ row: 3, column: 1 })).toContain('Smartphones', 'Ascending');

    // sort by `product` descending
    sortBy({ column: 1 });
    fixture.detectChanges();

    expect(textContent({ row: 1, column: 1 })).toContain('Smartphones', 'Descending');
    expect(textContent({ row: 2, column: 1 })).toContain('Bikes', 'Descending');
    expect(textContent({ row: 3, column: 1 })).toContain('Cars', 'Descending');
  });

  it('should sort using a stable sorting algorithm', () => {
    const initialRows = [
      { name: 'sed',        state: 'CA' },
      { name: 'dolor',      state: 'NY' },
      { name: 'ipsum',      state: 'NY' },
      { name: 'foo',        state: 'CA' },
      { name: 'bar',        state: 'CA' },
      { name: 'cat',        state: 'CA' },
      { name: 'sit',        state: 'CA' },
      { name: 'man',        state: 'CA' },
      { name: 'lorem',      state: 'NY' },
      { name: 'amet',       state: 'NY' },
      { name: 'maecennas',  state: 'NY' }
    ];
    
    /**
     * assume the following sort operations take place on `initialRows`:
     * 1) initialRows.sort(byLengthOfNameProperty) (Ascending)
     * 2) initialRows.sort(byState)                (Descending)
     * 
     * in browsers that do not natively implement stable sort (such as Chrome),
     * the result could be:
     * 
     *  [
     *    { name: 'maecennas',  state: 'NY' },
     *    { name: 'amet',       state: 'NY' },
     *    { name: 'dolor',      state: 'NY' },
     *    { name: 'ipsum',      state: 'NY' },
     *    { name: 'lorem',      state: 'NY' },
     *    { name: 'sed',        state: 'CA' },
     *    { name: 'cat',        state: 'CA' },
     *    { name: 'man',        state: 'CA' },
     *    { name: 'foo',        state: 'CA' },
     *    { name: 'bar',        state: 'CA' },
     *    { name: 'sit',        state: 'CA' }
     *  ]
     * 
     * in browsers that natively implement stable sort the result is guaranteed
     * to be:
     * 
     *  [
     *    { name: 'amet',       state: 'NY' },
     *    { name: 'dolor',      state: 'NY' },
     *    { name: 'ipsum',      state: 'NY' },
     *    { name: 'lorem',      state: 'NY' },
     *    { name: 'maecennas',  state: 'NY' },
     *    { name: 'sed',        state: 'CA' },
     *    { name: 'foo',        state: 'CA' },
     *    { name: 'bar',        state: 'CA' },
     *    { name: 'cat',        state: 'CA' },
     *    { name: 'sit',        state: 'CA' },
     *    { name: 'man',        state: 'CA' }
     *  ]
     */
    
    const columns = [
      {
        prop: 'name',
        comparator: (nameA: string, nameB: string) => {
          return nameA.length - nameB.length;
        }
      },
      {
        prop: 'state'
      }
    ];

    component.rows = initialRows;
    component.columns = columns;
    fixture.detectChanges();

    // sort by `name` ascending
    sortBy({ column: 1 });
    fixture.detectChanges();

    // sort by `state` descending
    sortBy({ column: 2 });
    fixture.detectChanges();
    sortBy({ column: 2 });
    fixture.detectChanges();

    expect(textContent({ row: 1, column: 1 })).toContain('amet');
    expect(textContent({ row: 2, column: 1 })).toContain('dolor');
    expect(textContent({ row: 3, column: 1 })).toContain('ipsum');
    expect(textContent({ row: 4, column: 1 })).toContain('lorem');
    expect(textContent({ row: 5, column: 1 })).toContain('maecennas');
    expect(textContent({ row: 6, column: 1 })).toContain('sed');
    expect(textContent({ row: 7, column: 1 })).toContain('foo');
    expect(textContent({ row: 8, column: 1 })).toContain('bar');
    expect(textContent({ row: 9, column: 1 })).toContain('cat');
    expect(textContent({ row: 10, column: 1 })).toContain('sit');
    expect(textContent({ row: 11, column: 1 })).toContain('man');
  });
  
  it('should sort correctly after push events', () => {
    const initialRows = [
      { name: 'sed',        state: 'CA' },
      { name: 'dolor',      state: 'NY' },
      { name: 'ipsum',      state: 'NY' },
      { name: 'foo',        state: 'CA' },
      { name: 'bar',        state: 'CA' },
      { name: 'cat',        state: 'CA' },
      { name: 'sit',        state: 'CA' },
      { name: 'man',        state: 'CA' },
      { name: 'lorem',      state: 'NY' },
      { name: 'amet',       state: 'NY' },
      { name: 'maecennas',  state: 'NY' }
    ];
    const additionalRows = [ ...initialRows ];
    
    const columns = [
      {
        prop: 'name',
        comparator: (nameA: string, nameB: string) => {
          return nameA.length - nameB.length;
        }
      },
      {
        prop: 'state'
      }
    ];

    component.rows = initialRows;
    component.columns = columns;
    fixture.detectChanges();

    // sort by `state` descending
    sortBy({ column: 2 });
    fixture.detectChanges();
    sortBy({ column: 2 });
    fixture.detectChanges();

    // sort by `name` ascending
    sortBy({ column: 1 });
    fixture.detectChanges();
    
    // mimic new `rows` data pushed to component
    component.rows = additionalRows;
    fixture.detectChanges();

    // sort by `state` descending
    sortBy({ column: 2 });
    fixture.detectChanges();
    sortBy({ column: 2 });
    fixture.detectChanges();
    
    expect(textContent({ row: 1, column: 1 })).toContain('amet');
    expect(textContent({ row: 2, column: 1 })).toContain('dolor');
    expect(textContent({ row: 3, column: 1 })).toContain('ipsum');
    expect(textContent({ row: 4, column: 1 })).toContain('lorem');
    expect(textContent({ row: 5, column: 1 })).toContain('maecennas');
    expect(textContent({ row: 6, column: 1 })).toContain('sed');
    expect(textContent({ row: 7, column: 1 })).toContain('foo');
    expect(textContent({ row: 8, column: 1 })).toContain('bar');
    expect(textContent({ row: 9, column: 1 })).toContain('cat');
    expect(textContent({ row: 10, column: 1 })).toContain('sit');
    expect(textContent({ row: 11, column: 1 })).toContain('man');
  });

  it('should set offset to 0 when sorting by a column', () => {
    const initialRows = [
      {id: 1},
      {id: 2},
      {id: 3}
    ];
  
    const columns = [
      {
        prop: 'id'
      }
    ];
  
    component.rows = initialRows;
    component.columns = columns;
    fixture.detectChanges();

    const datatableComponent = fixture.debugElement
      .query(By.directive(DatatableComponent))
      .componentInstance;
    datatableComponent.offset = 1;
    
    // sort by `id` descending
    sortBy({ column: 1 });
    fixture.detectChanges();
    sortBy({ column: 1 });
    fixture.detectChanges();

    expect(datatableComponent.offset).toBe(0);
  });

  it('should support array data', () => {
    const initialRows = [
      ['Hello', 123]
    ];
  
    const columns = [
      { prop: 0 },
      { prop: 1 }
    ];
  
    // previously, an exception was thrown from column-helper.ts setColumnDefaults()
    component.rows = initialRows;
    component.columns = columns;
    fixture.detectChanges();
  
    expect(textContent({ row: 1, column: 1 })).toContain('Hello');
    expect(textContent({ row: 1, column: 2 })).toContain('123');
  });
});

@Component({
  template: `
    <ngx-datatable
      [columns]="columns"
      [rows]="rows">
    </ngx-datatable>
  `
})
class TestFixtureComponent {
  columns: any[] = [];
  rows: any[] = [];
}

function setupTest() {
  return TestBed.configureTestingModule({
    declarations: [ TestFixtureComponent ],
    imports: [ NgxDatatableModule ]
  })
  .compileComponents()
  .then(() => {
    fixture = TestBed.createComponent(TestFixtureComponent);
    component = fixture.componentInstance;
  });
}

/**
 * mimics the act of a user clicking a column to sort it
 */
function sortBy({ column }: { column: number }) {
  const columnIndex = column - 1;
  const headerCellDe = fixture.debugElement
    .queryAll(By.directive(DataTableHeaderCellComponent))[columnIndex];
  const de = headerCellDe.query(By.css('span:last-child'));
  
  de.triggerEventHandler('click', null);
}

/**
 * test helper function to return text content of a cell within the
 * body of the ngx-datatable component
 */
function textContent({ row, column }: { row: number, column: number }) {
  const [ rowIndex, columnIndex ] = [ row - 1, column - 1];
  const bodyRowDe = fixture.debugElement
    .queryAll(By.directive(DataTableBodyRowComponent))[rowIndex];
  const bodyCellDe = bodyRowDe
    .queryAll(By.directive(DataTableBodyCellComponent))[columnIndex];
  
  return bodyCellDe.nativeElement.textContent;
}
