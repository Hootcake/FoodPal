/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { FoodPalTestModule } from '../../../test.module';
import { Shopping_ListDialogComponent } from '../../../../../../main/webapp/app/entities/shopping-list/shopping-list-dialog.component';
import { Shopping_ListService } from '../../../../../../main/webapp/app/entities/shopping-list/shopping-list.service';
import { Shopping_List } from '../../../../../../main/webapp/app/entities/shopping-list/shopping-list.model';
import { UserService } from '../../../../../../main/webapp/app/shared';

describe('Component Tests', () => {

    describe('Shopping_List Management Dialog Component', () => {
        let comp: Shopping_ListDialogComponent;
        let fixture: ComponentFixture<Shopping_ListDialogComponent>;
        let service: Shopping_ListService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [FoodPalTestModule],
                declarations: [Shopping_ListDialogComponent],
                providers: [
                    UserService,
                    Shopping_ListService
                ]
            })
            .overrideTemplate(Shopping_ListDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(Shopping_ListDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(Shopping_ListService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Shopping_List(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(entity));
                        comp.shopping_List = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'shopping_ListListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Shopping_List();
                        spyOn(service, 'create').and.returnValue(Observable.of(entity));
                        comp.shopping_List = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'shopping_ListListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
