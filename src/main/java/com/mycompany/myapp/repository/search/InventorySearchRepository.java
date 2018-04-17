package com.mycompany.myapp.repository.search;

import com.mycompany.myapp.domain.Inventory;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Inventory entity.
 */
public interface InventorySearchRepository extends ElasticsearchRepository<Inventory, Long> {
}
