/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { FoodPalTestModule } from '../../../test.module';
import { Shopping_ListDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/shopping-list/shopping-list-delete-dialog.component';
import { Shopping_ListService } from '../../../../../../main/webapp/app/entities/shopping-list/shopping-list.service';

describe('Component Tests', () => {

    describe('Shopping_List Management Delete Component', () => {
        let comp: Shopping_ListDeleteDialogComponent;
        let fixture: ComponentFixture<Shopping_ListDeleteDialogComponent>;
        let service: Shopping_ListService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [FoodPalTestModule],
                declarations: [Shopping_ListDeleteDialogComponent],
                providers: [
                    Shopping_ListService
                ]
            })
            .overrideTemplate(Shopping_ListDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(Shopping_ListDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(Shopping_ListService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
