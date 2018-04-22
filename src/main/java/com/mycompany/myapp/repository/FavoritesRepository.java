package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Favorites;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the Favorites entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FavoritesRepository extends JpaRepository<Favorites, Long> {

    @Query("select favorites from Favorites favorites where favorites.user.login = ?#{principal.username}")
    List<Favorites> findByUserIsCurrentUser();

}
