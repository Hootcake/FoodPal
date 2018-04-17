package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Inventory;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the Inventory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    @Query("select inventory from Inventory inventory where inventory.user.login = ?#{principal.username}")
    List<Inventory> findByUserIsCurrentUser();
    
    @Query("select inventory from Inventory inventory where inventory.user.login = ?#{principal.username}")
    Page<Inventory> findByUserIsCurrentUser(Pageable pageable);


}
