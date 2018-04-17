/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { FoodPalTestModule } from '../../../test.module';
import { InventoryDetailComponent } from '../../../../../../main/webapp/app/entities/inventory/inventory-detail.component';
import { InventoryService } from '../../../../../../main/webapp/app/entities/inventory/inventory.service';
import { Inventory } from '../../../../../../main/webapp/app/entities/inventory/inventory.model';

describe('Component Tests', () => {

    describe('Inventory Management Detail Component', () => {
        let comp: InventoryDetailComponent;
        let fixture: ComponentFixture<InventoryDetailComponent>;
        let service: InventoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [FoodPalTestModule],
                declarations: [InventoryDetailComponent],
                providers: [
                    InventoryService
                ]
            })
            .overrideTemplate(InventoryDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(InventoryDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(InventoryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Inventory(123)));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.inventory).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
