package com.mycompany.myapp.repository.search;

import com.mycompany.myapp.domain.Recommend;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Recommend entity.
 */
public interface RecommendSearchRepository extends ElasticsearchRepository<Recommend, Long> {
}
