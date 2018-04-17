package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Recommend;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Recommend entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RecommendRepository extends JpaRepository<Recommend, Long> {

}
