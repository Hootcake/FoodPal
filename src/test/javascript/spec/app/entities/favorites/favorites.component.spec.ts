/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { FoodPalTestModule } from '../../../test.module';
import { FavoritesComponent } from '../../../../../../main/webapp/app/entities/favorites/favorites.component';
import { FavoritesService } from '../../../../../../main/webapp/app/entities/favorites/favorites.service';
import { Favorites } from '../../../../../../main/webapp/app/entities/favorites/favorites.model';

describe('Component Tests', () => {

    describe('Favorites Management Component', () => {
        let comp: FavoritesComponent;
        let fixture: ComponentFixture<FavoritesComponent>;
        let service: FavoritesService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [FoodPalTestModule],
                declarations: [FavoritesComponent],
                providers: [
                    FavoritesService
                ]
            })
            .overrideTemplate(FavoritesComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FavoritesComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FavoritesService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new Favorites(123)],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.favorites[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
