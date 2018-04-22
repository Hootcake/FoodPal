package com.mycompany.myapp.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.mycompany.myapp.domain.Shopping_List;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.repository.Shopping_ListRepository;
import com.mycompany.myapp.repository.UserRepository;
import com.mycompany.myapp.repository.search.Shopping_ListSearchRepository;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Shopping_List.
 */
@RestController
@RequestMapping("/api")
public class Shopping_ListResource {

    private final Logger log = LoggerFactory.getLogger(Shopping_ListResource.class);
    
    private static final String ENTITY_NAME = "shopping_List";

    private final Shopping_ListRepository shopping_ListRepository;
    
    private final UserRepository userRepository;
    
    private final Shopping_ListSearchRepository shopping_ListSearchRepository;

    public Shopping_ListResource(Shopping_ListRepository shopping_ListRepository, Shopping_ListSearchRepository shopping_ListSearchRepository, UserRepository userRepository) {
        this.shopping_ListRepository = shopping_ListRepository;
        this.shopping_ListSearchRepository = shopping_ListSearchRepository;
        this.userRepository = userRepository;
    }

    /**
     * POST  /shopping-lists : Create a new shopping_List.
     *
     * @param shopping_List the shopping_List to create
     * @return the ResponseEntity with status 201 (Created) and with body the new shopping_List, or with status 400 (Bad Request) if the shopping_List has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/shopping-lists")
    @Timed
    public ResponseEntity<Shopping_List> createShopping_List(@RequestBody Shopping_List shopping_List) throws URISyntaxException {
        log.debug("REST request to save Shopping_List : {}", shopping_List);
        if (shopping_List.getId() != null) {
            throw new BadRequestAlertException("A new shopping_List cannot already have an ID", ENTITY_NAME, "idexists");
        }
        User user=new User();
        user= userRepository.findOneByLogin(getCurrentUserLogin()).get();
    	shopping_List.setUser(user);     
        Shopping_List result = shopping_ListRepository.save(shopping_List);
        shopping_ListSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/shopping-lists/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /shopping-lists : Updates an existing shopping_List.
     *
     * @param shopping_List the shopping_List to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated shopping_List,
     * or with status 400 (Bad Request) if the shopping_List is not valid,
     * or with status 500 (Internal Server Error) if the shopping_List couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/shopping-lists")
    @Timed
    public ResponseEntity<Shopping_List> updateShopping_List(@RequestBody Shopping_List shopping_List) throws URISyntaxException {
        log.debug("REST request to update Shopping_List : {}", shopping_List);
        if (shopping_List.getId() == null) {
            return createShopping_List(shopping_List);
        }
        Shopping_List result = shopping_ListRepository.save(shopping_List);
        shopping_ListSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, shopping_List.getId().toString()))
            .body(result);
    }

    /**
     * GET  /shopping-lists : get all the shopping_Lists.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of shopping_Lists in body
     */
    @GetMapping("/shopping-lists")
    @Timed
    public ResponseEntity<List<Shopping_List>> getAllShopping_Lists(Pageable pageable) {
        log.debug("REST request to get a page of Shopping_Lists");
        Page<Shopping_List> page = shopping_ListRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/shopping-lists");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /shopping-lists/:id : get the "id" shopping_List.
     *
     * @param id the id of the shopping_List to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the shopping_List, or with status 404 (Not Found)
     */
    @GetMapping("/shopping-lists/{id}")
    @Timed
    public ResponseEntity<Shopping_List> getShopping_List(@PathVariable Long id) {
        log.debug("REST request to get Shopping_List : {}", id);
        Shopping_List shopping_List = shopping_ListRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(shopping_List));
    }

    /**
     * DELETE  /shopping-lists/:id : delete the "id" shopping_List.
     *
     * @param id the id of the shopping_List to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/shopping-lists/{id}")
    @Timed
    public ResponseEntity<Void> deleteShopping_List(@PathVariable Long id) {
        log.debug("REST request to delete Shopping_List : {}", id);
        shopping_ListRepository.delete(id);
        shopping_ListSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/shopping-lists?query=:query : search for the shopping_List corresponding
     * to the query.
     *
     * @param query the query of the shopping_List search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/shopping-lists")
    @Timed
    public ResponseEntity<List<Shopping_List>> searchShopping_Lists(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Shopping_Lists for query {}", query);
        Page<Shopping_List> page = shopping_ListSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/shopping-lists");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }
    
    public String getCurrentUserLogin() {
        org.springframework.security.core.context.SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        String login = null;
        if (authentication != null)
            if (authentication.getPrincipal() instanceof UserDetails)
             login = ((UserDetails) authentication.getPrincipal()).getUsername();
            else if (authentication.getPrincipal() instanceof String)
             login = (String) authentication.getPrincipal();

        return login; 
        }

}
