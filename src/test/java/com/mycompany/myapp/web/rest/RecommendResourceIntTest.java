package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.FoodPalApp;

import com.mycompany.myapp.domain.Recommend;
import com.mycompany.myapp.repository.RecommendRepository;
import com.mycompany.myapp.repository.search.RecommendSearchRepository;
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
 * Test class for the RecommendResource REST controller.
 *
 * @see RecommendResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = FoodPalApp.class)
public class RecommendResourceIntTest {

    @Autowired
    private RecommendRepository recommendRepository;

    @Autowired
    private RecommendSearchRepository recommendSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restRecommendMockMvc;

    private Recommend recommend;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final RecommendResource recommendResource = new RecommendResource(recommendRepository, recommendSearchRepository);
        this.restRecommendMockMvc = MockMvcBuilders.standaloneSetup(recommendResource)
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
    public static Recommend createEntity(EntityManager em) {
        Recommend recommend = new Recommend();
        return recommend;
    }

    @Before
    public void initTest() {
        recommendSearchRepository.deleteAll();
        recommend = createEntity(em);
    }

    @Test
    @Transactional
    public void createRecommend() throws Exception {
        int databaseSizeBeforeCreate = recommendRepository.findAll().size();

        // Create the Recommend
        restRecommendMockMvc.perform(post("/api/recommends")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(recommend)))
            .andExpect(status().isCreated());

        // Validate the Recommend in the database
        List<Recommend> recommendList = recommendRepository.findAll();
        assertThat(recommendList).hasSize(databaseSizeBeforeCreate + 1);
        Recommend testRecommend = recommendList.get(recommendList.size() - 1);

        // Validate the Recommend in Elasticsearch
        Recommend recommendEs = recommendSearchRepository.findOne(testRecommend.getId());
        assertThat(recommendEs).isEqualToIgnoringGivenFields(testRecommend);
    }

    @Test
    @Transactional
    public void createRecommendWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = recommendRepository.findAll().size();

        // Create the Recommend with an existing ID
        recommend.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restRecommendMockMvc.perform(post("/api/recommends")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(recommend)))
            .andExpect(status().isBadRequest());

        // Validate the Recommend in the database
        List<Recommend> recommendList = recommendRepository.findAll();
        assertThat(recommendList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllRecommends() throws Exception {
        // Initialize the database
        recommendRepository.saveAndFlush(recommend);

        // Get all the recommendList
        restRecommendMockMvc.perform(get("/api/recommends?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(recommend.getId().intValue())));
    }

    @Test
    @Transactional
    public void getRecommend() throws Exception {
        // Initialize the database
        recommendRepository.saveAndFlush(recommend);

        // Get the recommend
        restRecommendMockMvc.perform(get("/api/recommends/{id}", recommend.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(recommend.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingRecommend() throws Exception {
        // Get the recommend
        restRecommendMockMvc.perform(get("/api/recommends/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateRecommend() throws Exception {
        // Initialize the database
        recommendRepository.saveAndFlush(recommend);
        recommendSearchRepository.save(recommend);
        int databaseSizeBeforeUpdate = recommendRepository.findAll().size();

        // Update the recommend
        Recommend updatedRecommend = recommendRepository.findOne(recommend.getId());
        // Disconnect from session so that the updates on updatedRecommend are not directly saved in db
        em.detach(updatedRecommend);

        restRecommendMockMvc.perform(put("/api/recommends")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedRecommend)))
            .andExpect(status().isOk());

        // Validate the Recommend in the database
        List<Recommend> recommendList = recommendRepository.findAll();
        assertThat(recommendList).hasSize(databaseSizeBeforeUpdate);
        Recommend testRecommend = recommendList.get(recommendList.size() - 1);

        // Validate the Recommend in Elasticsearch
        Recommend recommendEs = recommendSearchRepository.findOne(testRecommend.getId());
        assertThat(recommendEs).isEqualToIgnoringGivenFields(testRecommend);
    }

    @Test
    @Transactional
    public void updateNonExistingRecommend() throws Exception {
        int databaseSizeBeforeUpdate = recommendRepository.findAll().size();

        // Create the Recommend

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restRecommendMockMvc.perform(put("/api/recommends")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(recommend)))
            .andExpect(status().isCreated());

        // Validate the Recommend in the database
        List<Recommend> recommendList = recommendRepository.findAll();
        assertThat(recommendList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteRecommend() throws Exception {
        // Initialize the database
        recommendRepository.saveAndFlush(recommend);
        recommendSearchRepository.save(recommend);
        int databaseSizeBeforeDelete = recommendRepository.findAll().size();

        // Get the recommend
        restRecommendMockMvc.perform(delete("/api/recommends/{id}", recommend.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean recommendExistsInEs = recommendSearchRepository.exists(recommend.getId());
        assertThat(recommendExistsInEs).isFalse();

        // Validate the database is empty
        List<Recommend> recommendList = recommendRepository.findAll();
        assertThat(recommendList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchRecommend() throws Exception {
        // Initialize the database
        recommendRepository.saveAndFlush(recommend);
        recommendSearchRepository.save(recommend);

        // Search the recommend
        restRecommendMockMvc.perform(get("/api/_search/recommends?query=id:" + recommend.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(recommend.getId().intValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Recommend.class);
        Recommend recommend1 = new Recommend();
        recommend1.setId(1L);
        Recommend recommend2 = new Recommend();
        recommend2.setId(recommend1.getId());
        assertThat(recommend1).isEqualTo(recommend2);
        recommend2.setId(2L);
        assertThat(recommend1).isNotEqualTo(recommend2);
        recommend1.setId(null);
        assertThat(recommend1).isNotEqualTo(recommend2);
    }
}
