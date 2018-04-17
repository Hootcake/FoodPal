package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Shopping_List;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the Shopping_List entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Shopping_ListRepository extends JpaRepository<Shopping_List, Long> {

    @Query("select shopping_list from Shopping_List shopping_list where shopping_list.user.login = ?#{principal.username}")
    List<Shopping_List> findByUserIsCurrentUser();

}
