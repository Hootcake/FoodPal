package com.mycompany.myapp.repository.search;

import com.mycompany.myapp.domain.Shopping_List;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Shopping_List entity.
 */
public interface Shopping_ListSearchRepository extends ElasticsearchRepository<Shopping_List, Long> {
}
