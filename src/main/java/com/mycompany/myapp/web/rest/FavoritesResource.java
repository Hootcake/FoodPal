package com.mycompany.myapp.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.mycompany.myapp.domain.Favorites;

import com.mycompany.myapp.repository.FavoritesRepository;
import com.mycompany.myapp.repository.search.FavoritesSearchRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import com.mycompany.myapp.web.rest.util.HeaderUtil;
import com.mycompany.myapp.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Favorites.
 */
@RestController
@RequestMapping("/api")
public class FavoritesResource {

    private final Logger log = LoggerFactory.getLogger(FavoritesResource.class);

    private static final String ENTITY_NAME = "favorites";

    private final FavoritesRepository favoritesRepository;

    private final FavoritesSearchRepository favoritesSearchRepository;

    public FavoritesResource(FavoritesRepository favoritesRepository, FavoritesSearchRepository favoritesSearchRepository) {
        this.favoritesRepository = favoritesRepository;
        this.favoritesSearchRepository = favoritesSearchRepository;
    }

    /**
     * POST  /favorites : Create a new favorites.
     *
     * @param favorites the favorites to create
     * @return the ResponseEntity with status 201 (Created) and with body the new favorites, or with status 400 (Bad Request) if the favorites has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/favorites")
    @Timed
    public ResponseEntity<Favorites> createFavorites(@RequestBody Favorites favorites) throws URISyntaxException {
        log.debug("REST request to save Favorites : {}", favorites);
        if (favorites.getId() != null) {
            throw new BadRequestAlertException("A new favorites cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Favorites result = favoritesRepository.save(favorites);
        favoritesSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/favorites/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /favorites : Updates an existing favorites.
     *
     * @param favorites the favorites to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated favorites,
     * or with status 400 (Bad Request) if the favorites is not valid,
     * or with status 500 (Internal Server Error) if the favorites couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/favorites")
    @Timed
    public ResponseEntity<Favorites> updateFavorites(@RequestBody Favorites favorites) throws URISyntaxException {
        log.debug("REST request to update Favorites : {}", favorites);
        if (favorites.getId() == null) {
            return createFavorites(favorites);
        }
        Favorites result = favoritesRepository.save(favorites);
        favoritesSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, favorites.getId().toString()))
            .body(result);
    }

    /**
     * GET  /favorites : get all the favorites.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of favorites in body
     */
    @GetMapping("/favorites")
    @Timed
    public ResponseEntity<List<Favorites>> getAllFavorites(Pageable pageable) {
        log.debug("REST request to get a page of Favorites");
        Page<Favorites> page = favoritesRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/favorites");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /favorites/:id : get the "id" favorites.
     *
     * @param id the id of the favorites to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the favorites, or with status 404 (Not Found)
     */
    @GetMapping("/favorites/{id}")
    @Timed
    public ResponseEntity<Favorites> getFavorites(@PathVariable Long id) {
        log.debug("REST request to get Favorites : {}", id);
        Favorites favorites = favoritesRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(favorites));
    }

    /**
     * DELETE  /favorites/:id : delete the "id" favorites.
     *
     * @param id the id of the favorites to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/favorites/{id}")
    @Timed
    public ResponseEntity<Void> deleteFavorites(@PathVariable Long id) {
        log.debug("REST request to delete Favorites : {}", id);
        favoritesRepository.delete(id);
        favoritesSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/favorites?query=:query : search for the favorites corresponding
     * to the query.
     *
     * @param query the query of the favorites search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/favorites")
    @Timed
    public ResponseEntity<List<Favorites>> searchFavorites(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Favorites for query {}", query);
        Page<Favorites> page = favoritesSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/favorites");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
