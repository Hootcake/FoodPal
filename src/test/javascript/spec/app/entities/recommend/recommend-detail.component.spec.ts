/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { FoodPalTestModule } from '../../../test.module';
import { RecommendDetailComponent } from '../../../../../../main/webapp/app/entities/recommend/recommend-detail.component';
import { RecommendService } from '../../../../../../main/webapp/app/entities/recommend/recommend.service';
import { Recommend } from '../../../../../../main/webapp/app/entities/recommend/recommend.model';

describe('Component Tests', () => {

    describe('Recommend Management Detail Component', () => {
        let comp: RecommendDetailComponent;
        let fixture: ComponentFixture<RecommendDetailComponent>;
        let service: RecommendService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [FoodPalTestModule],
                declarations: [RecommendDetailComponent],
                providers: [
                    RecommendService
                ]
            })
            .overrideTemplate(RecommendDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(RecommendDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RecommendService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Recommend(123)));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.recommend).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
