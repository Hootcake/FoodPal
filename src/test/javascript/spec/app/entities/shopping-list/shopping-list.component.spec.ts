/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { FoodPalTestModule } from '../../../test.module';
import { Shopping_ListComponent } from '../../../../../../main/webapp/app/entities/shopping-list/shopping-list.component';
import { Shopping_ListService } from '../../../../../../main/webapp/app/entities/shopping-list/shopping-list.service';
import { Shopping_List } from '../../../../../../main/webapp/app/entities/shopping-list/shopping-list.model';

describe('Component Tests', () => {

    describe('Shopping_List Management Component', () => {
        let comp: Shopping_ListComponent;
        let fixture: ComponentFixture<Shopping_ListComponent>;
        let service: Shopping_ListService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [FoodPalTestModule],
                declarations: [Shopping_ListComponent],
                providers: [
                    Shopping_ListService
                ]
            })
            .overrideTemplate(Shopping_ListComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(Shopping_ListComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(Shopping_ListService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new Shopping_List(123)],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.shopping_Lists[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
