/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { FoodPalTestModule } from '../../../test.module';
import { FavoritesDetailComponent } from '../../../../../../main/webapp/app/entities/favorites/favorites-detail.component';
import { FavoritesService } from '../../../../../../main/webapp/app/entities/favorites/favorites.service';
import { Favorites } from '../../../../../../main/webapp/app/entities/favorites/favorites.model';

describe('Component Tests', () => {

    describe('Favorites Management Detail Component', () => {
        let comp: FavoritesDetailComponent;
        let fixture: ComponentFixture<FavoritesDetailComponent>;
        let service: FavoritesService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [FoodPalTestModule],
                declarations: [FavoritesDetailComponent],
                providers: [
                    FavoritesService
                ]
            })
            .overrideTemplate(FavoritesDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FavoritesDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FavoritesService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Favorites(123)));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.favorites).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
