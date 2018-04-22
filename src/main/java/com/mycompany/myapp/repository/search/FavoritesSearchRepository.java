package com.mycompany.myapp.repository.search;

import com.mycompany.myapp.domain.Favorites;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Favorites entity.
 */
public interface FavoritesSearchRepository extends ElasticsearchRepository<Favorites, Long> {
}
