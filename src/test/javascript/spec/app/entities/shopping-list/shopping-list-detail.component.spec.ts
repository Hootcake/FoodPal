/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { FoodPalTestModule } from '../../../test.module';
import { Shopping_ListDetailComponent } from '../../../../../../main/webapp/app/entities/shopping-list/shopping-list-detail.component';
import { Shopping_ListService } from '../../../../../../main/webapp/app/entities/shopping-list/shopping-list.service';
import { Shopping_List } from '../../../../../../main/webapp/app/entities/shopping-list/shopping-list.model';

describe('Component Tests', () => {

    describe('Shopping_List Management Detail Component', () => {
        let comp: Shopping_ListDetailComponent;
        let fixture: ComponentFixture<Shopping_ListDetailComponent>;
        let service: Shopping_ListService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [FoodPalTestModule],
                declarations: [Shopping_ListDetailComponent],
                providers: [
                    Shopping_ListService
                ]
            })
            .overrideTemplate(Shopping_ListDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(Shopping_ListDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(Shopping_ListService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Shopping_List(123)));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.shopping_List).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
