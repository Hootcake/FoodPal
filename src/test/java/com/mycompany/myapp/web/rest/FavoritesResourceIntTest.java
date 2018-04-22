package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.FoodPalApp;

import com.mycompany.myapp.domain.Favorites;
import com.mycompany.myapp.repository.FavoritesRepository;
import com.mycompany.myapp.repository.search.FavoritesSearchRepository;
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
 * Test class for the FavoritesResource REST controller.
 *
 * @see FavoritesResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = FoodPalApp.class)
public class FavoritesResourceIntTest {

    private static final String DEFAULT_RECIPE_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_RECIPE_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_CUISINE = "AAAAAAAAAA";
    private static final String UPDATED_CUISINE = "BBBBBBBBBB";

    private static final String DEFAULT_INGREDIENTS = "AAAAAAAAAA";
    private static final String UPDATED_INGREDIENTS = "BBBBBBBBBB";

    private static final String DEFAULT_SOURCE_URL = "AAAAAAAAAA";
    private static final String UPDATED_SOURCE_URL = "BBBBBBBBBB";

    @Autowired
    private FavoritesRepository favoritesRepository;

    @Autowired
    private FavoritesSearchRepository favoritesSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restFavoritesMockMvc;

    private Favorites favorites;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final FavoritesResource favoritesResource = new FavoritesResource(favoritesRepository, favoritesSearchRepository);
        this.restFavoritesMockMvc = MockMvcBuilders.standaloneSetup(favoritesResource)
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
    public static Favorites createEntity(EntityManager em) {
        Favorites favorites = new Favorites()
            .recipe_title(DEFAULT_RECIPE_TITLE)
            .cuisine(DEFAULT_CUISINE)
            .ingredients(DEFAULT_INGREDIENTS)
            .source_URL(DEFAULT_SOURCE_URL);
        return favorites;
    }

    @Before
    public void initTest() {
        favoritesSearchRepository.deleteAll();
        favorites = createEntity(em);
    }

    @Test
    @Transactional
    public void createFavorites() throws Exception {
        int databaseSizeBeforeCreate = favoritesRepository.findAll().size();

        // Create the Favorites
        restFavoritesMockMvc.perform(post("/api/favorites")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(favorites)))
            .andExpect(status().isCreated());

        // Validate the Favorites in the database
        List<Favorites> favoritesList = favoritesRepository.findAll();
        assertThat(favoritesList).hasSize(databaseSizeBeforeCreate + 1);
        Favorites testFavorites = favoritesList.get(favoritesList.size() - 1);
        assertThat(testFavorites.getRecipe_title()).isEqualTo(DEFAULT_RECIPE_TITLE);
        assertThat(testFavorites.getCuisine()).isEqualTo(DEFAULT_CUISINE);
        assertThat(testFavorites.getIngredients()).isEqualTo(DEFAULT_INGREDIENTS);
        assertThat(testFavorites.getSource_URL()).isEqualTo(DEFAULT_SOURCE_URL);

        // Validate the Favorites in Elasticsearch
        Favorites favoritesEs = favoritesSearchRepository.findOne(testFavorites.getId());
        assertThat(favoritesEs).isEqualToIgnoringGivenFields(testFavorites);
    }

    @Test
    @Transactional
    public void createFavoritesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = favoritesRepository.findAll().size();

        // Create the Favorites with an existing ID
        favorites.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restFavoritesMockMvc.perform(post("/api/favorites")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(favorites)))
            .andExpect(status().isBadRequest());

        // Validate the Favorites in the database
        List<Favorites> favoritesList = favoritesRepository.findAll();
        assertThat(favoritesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllFavorites() throws Exception {
        // Initialize the database
        favoritesRepository.saveAndFlush(favorites);

        // Get all the favoritesList
        restFavoritesMockMvc.perform(get("/api/favorites?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(favorites.getId().intValue())))
            .andExpect(jsonPath("$.[*].recipe_title").value(hasItem(DEFAULT_RECIPE_TITLE.toString())))
            .andExpect(jsonPath("$.[*].cuisine").value(hasItem(DEFAULT_CUISINE.toString())))
            .andExpect(jsonPath("$.[*].ingredients").value(hasItem(DEFAULT_INGREDIENTS.toString())))
            .andExpect(jsonPath("$.[*].source_URL").value(hasItem(DEFAULT_SOURCE_URL.toString())));
    }

    @Test
    @Transactional
    public void getFavorites() throws Exception {
        // Initialize the database
        favoritesRepository.saveAndFlush(favorites);

        // Get the favorites
        restFavoritesMockMvc.perform(get("/api/favorites/{id}", favorites.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(favorites.getId().intValue()))
            .andExpect(jsonPath("$.recipe_title").value(DEFAULT_RECIPE_TITLE.toString()))
            .andExpect(jsonPath("$.cuisine").value(DEFAULT_CUISINE.toString()))
            .andExpect(jsonPath("$.ingredients").value(DEFAULT_INGREDIENTS.toString()))
            .andExpect(jsonPath("$.source_URL").value(DEFAULT_SOURCE_URL.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingFavorites() throws Exception {
        // Get the favorites
        restFavoritesMockMvc.perform(get("/api/favorites/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFavorites() throws Exception {
        // Initialize the database
        favoritesRepository.saveAndFlush(favorites);
        favoritesSearchRepository.save(favorites);
        int databaseSizeBeforeUpdate = favoritesRepository.findAll().size();

        // Update the favorites
        Favorites updatedFavorites = favoritesRepository.findOne(favorites.getId());
        // Disconnect from session so that the updates on updatedFavorites are not directly saved in db
        em.detach(updatedFavorites);
        updatedFavorites
            .recipe_title(UPDATED_RECIPE_TITLE)
            .cuisine(UPDATED_CUISINE)
            .ingredients(UPDATED_INGREDIENTS)
            .source_URL(UPDATED_SOURCE_URL);

        restFavoritesMockMvc.perform(put("/api/favorites")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedFavorites)))
            .andExpect(status().isOk());

        // Validate the Favorites in the database
        List<Favorites> favoritesList = favoritesRepository.findAll();
        assertThat(favoritesList).hasSize(databaseSizeBeforeUpdate);
        Favorites testFavorites = favoritesList.get(favoritesList.size() - 1);
        assertThat(testFavorites.getRecipe_title()).isEqualTo(UPDATED_RECIPE_TITLE);
        assertThat(testFavorites.getCuisine()).isEqualTo(UPDATED_CUISINE);
        assertThat(testFavorites.getIngredients()).isEqualTo(UPDATED_INGREDIENTS);
        assertThat(testFavorites.getSource_URL()).isEqualTo(UPDATED_SOURCE_URL);

        // Validate the Favorites in Elasticsearch
        Favorites favoritesEs = favoritesSearchRepository.findOne(testFavorites.getId());
        assertThat(favoritesEs).isEqualToIgnoringGivenFields(testFavorites);
    }

    @Test
    @Transactional
    public void updateNonExistingFavorites() throws Exception {
        int databaseSizeBeforeUpdate = favoritesRepository.findAll().size();

        // Create the Favorites

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restFavoritesMockMvc.perform(put("/api/favorites")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(favorites)))
            .andExpect(status().isCreated());

        // Validate the Favorites in the database
        List<Favorites> favoritesList = favoritesRepository.findAll();
        assertThat(favoritesList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteFavorites() throws Exception {
        // Initialize the database
        favoritesRepository.saveAndFlush(favorites);
        favoritesSearchRepository.save(favorites);
        int databaseSizeBeforeDelete = favoritesRepository.findAll().size();

        // Get the favorites
        restFavoritesMockMvc.perform(delete("/api/favorites/{id}", favorites.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean favoritesExistsInEs = favoritesSearchRepository.exists(favorites.getId());
        assertThat(favoritesExistsInEs).isFalse();

        // Validate the database is empty
        List<Favorites> favoritesList = favoritesRepository.findAll();
        assertThat(favoritesList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchFavorites() throws Exception {
        // Initialize the database
        favoritesRepository.saveAndFlush(favorites);
        favoritesSearchRepository.save(favorites);

        // Search the favorites
        restFavoritesMockMvc.perform(get("/api/_search/favorites?query=id:" + favorites.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(favorites.getId().intValue())))
            .andExpect(jsonPath("$.[*].recipe_title").value(hasItem(DEFAULT_RECIPE_TITLE.toString())))
            .andExpect(jsonPath("$.[*].cuisine").value(hasItem(DEFAULT_CUISINE.toString())))
            .andExpect(jsonPath("$.[*].ingredients").value(hasItem(DEFAULT_INGREDIENTS.toString())))
            .andExpect(jsonPath("$.[*].source_URL").value(hasItem(DEFAULT_SOURCE_URL.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Favorites.class);
        Favorites favorites1 = new Favorites();
        favorites1.setId(1L);
        Favorites favorites2 = new Favorites();
        favorites2.setId(favorites1.getId());
        assertThat(favorites1).isEqualTo(favorites2);
        favorites2.setId(2L);
        assertThat(favorites1).isNotEqualTo(favorites2);
        favorites1.setId(null);
        assertThat(favorites1).isNotEqualTo(favorites2);
    }
}
