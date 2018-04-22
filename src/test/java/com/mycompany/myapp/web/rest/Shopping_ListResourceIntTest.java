package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.FoodPalApp;

import com.mycompany.myapp.domain.Shopping_List;
import com.mycompany.myapp.repository.Shopping_ListRepository;
import com.mycompany.myapp.repository.UserRepository;
import com.mycompany.myapp.repository.search.Shopping_ListSearchRepository;
import com.mycompany.myapp.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static com.mycompany.myapp.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the Shopping_ListResource REST controller.
 *
 * @see Shopping_ListResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = FoodPalApp.class)
public class Shopping_ListResourceIntTest {

    private static final String DEFAULT_ITEMS = "AAAAAAAAAA";
    private static final String UPDATED_ITEMS = "BBBBBBBBBB";

    private static final String DEFAULT_NOTES = "AAAAAAAAAA";
    private static final String UPDATED_NOTES = "BBBBBBBBBB";

    @Autowired
    private Shopping_ListRepository shopping_ListRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Shopping_ListSearchRepository shopping_ListSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restShopping_ListMockMvc;

    private Shopping_List shopping_List;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final Shopping_ListResource shopping_ListResource = new Shopping_ListResource(shopping_ListRepository, shopping_ListSearchRepository, userRepository);
        this.restShopping_ListMockMvc = MockMvcBuilders.standaloneSetup(shopping_ListResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Shopping_List createEntity(EntityManager em) {
        Shopping_List shopping_List = new Shopping_List()
            .items(DEFAULT_ITEMS)
            .notes(DEFAULT_NOTES);
        return shopping_List;
    }

    @Before
    public void initTest() {
        shopping_ListSearchRepository.deleteAll();
        shopping_List = createEntity(em);
    }

    @Test
    @Transactional
    public void createShopping_List() throws Exception {
        int databaseSizeBeforeCreate = shopping_ListRepository.findAll().size();

        // Create the Shopping_List
        restShopping_ListMockMvc.perform(post("/api/shopping-lists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shopping_List)))
            .andExpect(status().isCreated());

        // Validate the Shopping_List in the database
        List<Shopping_List> shopping_ListList = shopping_ListRepository.findAll();
        assertThat(shopping_ListList).hasSize(databaseSizeBeforeCreate + 1);
        Shopping_List testShopping_List = shopping_ListList.get(shopping_ListList.size() - 1);
        assertThat(testShopping_List.getItems()).isEqualTo(DEFAULT_ITEMS);
        assertThat(testShopping_List.getNotes()).isEqualTo(DEFAULT_NOTES);

        // Validate the Shopping_List in Elasticsearch
        Shopping_List shopping_ListEs = shopping_ListSearchRepository.findOne(testShopping_List.getId());
        assertThat(shopping_ListEs).isEqualToIgnoringGivenFields(testShopping_List);
    }

    @Test
    @Transactional
    public void createShopping_ListWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = shopping_ListRepository.findAll().size();

        // Create the Shopping_List with an existing ID
        shopping_List.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restShopping_ListMockMvc.perform(post("/api/shopping-lists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shopping_List)))
            .andExpect(status().isBadRequest());

        // Validate the Shopping_List in the database
        List<Shopping_List> shopping_ListList = shopping_ListRepository.findAll();
        assertThat(shopping_ListList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllShopping_Lists() throws Exception {
        // Initialize the database
        shopping_ListRepository.saveAndFlush(shopping_List);

        // Get all the shopping_ListList
        restShopping_ListMockMvc.perform(get("/api/shopping-lists?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shopping_List.getId().intValue())))
            .andExpect(jsonPath("$.[*].items").value(hasItem(DEFAULT_ITEMS.toString())))
            .andExpect(jsonPath("$.[*].notes").value(hasItem(DEFAULT_NOTES.toString())));
    }

    @Test
    @Transactional
    public void getShopping_List() throws Exception {
        // Initialize the database
        shopping_ListRepository.saveAndFlush(shopping_List);

        // Get the shopping_List
        restShopping_ListMockMvc.perform(get("/api/shopping-lists/{id}", shopping_List.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(shopping_List.getId().intValue()))
            .andExpect(jsonPath("$.items").value(DEFAULT_ITEMS.toString()))
            .andExpect(jsonPath("$.notes").value(DEFAULT_NOTES.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingShopping_List() throws Exception {
        // Get the shopping_List
        restShopping_ListMockMvc.perform(get("/api/shopping-lists/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateShopping_List() throws Exception {
        // Initialize the database
        shopping_ListRepository.saveAndFlush(shopping_List);
        shopping_ListSearchRepository.save(shopping_List);
        int databaseSizeBeforeUpdate = shopping_ListRepository.findAll().size();

        // Update the shopping_List
        Shopping_List updatedShopping_List = shopping_ListRepository.findOne(shopping_List.getId());
        // Disconnect from session so that the updates on updatedShopping_List are not directly saved in db
        em.detach(updatedShopping_List);
        updatedShopping_List
            .items(UPDATED_ITEMS)
            .notes(UPDATED_NOTES);

        restShopping_ListMockMvc.perform(put("/api/shopping-lists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedShopping_List)))
            .andExpect(status().isOk());

        // Validate the Shopping_List in the database
        List<Shopping_List> shopping_ListList = shopping_ListRepository.findAll();
        assertThat(shopping_ListList).hasSize(databaseSizeBeforeUpdate);
        Shopping_List testShopping_List = shopping_ListList.get(shopping_ListList.size() - 1);
        assertThat(testShopping_List.getItems()).isEqualTo(UPDATED_ITEMS);
        assertThat(testShopping_List.getNotes()).isEqualTo(UPDATED_NOTES);

        // Validate the Shopping_List in Elasticsearch
        Shopping_List shopping_ListEs = shopping_ListSearchRepository.findOne(testShopping_List.getId());
        assertThat(shopping_ListEs).isEqualToIgnoringGivenFields(testShopping_List);
    }

    @Test
    @Transactional
    public void updateNonExistingShopping_List() throws Exception {
        int databaseSizeBeforeUpdate = shopping_ListRepository.findAll().size();

        // Create the Shopping_List

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restShopping_ListMockMvc.perform(put("/api/shopping-lists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shopping_List)))
            .andExpect(status().isCreated());

        // Validate the Shopping_List in the database
        List<Shopping_List> shopping_ListList = shopping_ListRepository.findAll();
        assertThat(shopping_ListList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteShopping_List() throws Exception {
        // Initialize the database
        shopping_ListRepository.saveAndFlush(shopping_List);
        shopping_ListSearchRepository.save(shopping_List);
        int databaseSizeBeforeDelete = shopping_ListRepository.findAll().size();

        // Get the shopping_List
        restShopping_ListMockMvc.perform(delete("/api/shopping-lists/{id}", shopping_List.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean shopping_ListExistsInEs = shopping_ListSearchRepository.exists(shopping_List.getId());
        assertThat(shopping_ListExistsInEs).isFalse();

        // Validate the database is empty
        List<Shopping_List> shopping_ListList = shopping_ListRepository.findAll();
        assertThat(shopping_ListList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchShopping_List() throws Exception {
        // Initialize the database
        shopping_ListRepository.saveAndFlush(shopping_List);
        shopping_ListSearchRepository.save(shopping_List);

        // Search the shopping_List
        restShopping_ListMockMvc.perform(get("/api/_search/shopping-lists?query=id:" + shopping_List.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shopping_List.getId().intValue())))
            .andExpect(jsonPath("$.[*].items").value(hasItem(DEFAULT_ITEMS.toString())))
            .andExpect(jsonPath("$.[*].notes").value(hasItem(DEFAULT_NOTES.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Shopping_List.class);
        Shopping_List shopping_List1 = new Shopping_List();
        shopping_List1.setId(1L);
        Shopping_List shopping_List2 = new Shopping_List();
        shopping_List2.setId(shopping_List1.getId());
        assertThat(shopping_List1).isEqualTo(shopping_List2);
        shopping_List2.setId(2L);
        assertThat(shopping_List1).isNotEqualTo(shopping_List2);
        shopping_List1.setId(null);
        assertThat(shopping_List1).isNotEqualTo(shopping_List2);
    }
}
