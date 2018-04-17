/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { FoodPalTestModule } from '../../../test.module';
import { RecommendDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/recommend/recommend-delete-dialog.component';
import { RecommendService } from '../../../../../../main/webapp/app/entities/recommend/recommend.service';

describe('Component Tests', () => {

    describe('Recommend Management Delete Component', () => {
        let comp: RecommendDeleteDialogComponent;
        let fixture: ComponentFixture<RecommendDeleteDialogComponent>;
        let service: RecommendService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [FoodPalTestModule],
                declarations: [RecommendDeleteDialogComponent],
                providers: [
                    RecommendService
                ]
            })
            .overrideTemplate(RecommendDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(RecommendDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RecommendService);
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
