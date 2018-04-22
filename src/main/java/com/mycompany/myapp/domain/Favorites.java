package com.mycompany.myapp.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Favorites.
 */
@Entity
@Table(name = "favorites")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "favorites")
public class Favorites implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recipe_title")
    private String recipe_title;

    @Column(name = "cuisine")
    private String cuisine;

    @Column(name = "ingredients")
    private String ingredients;

    @Column(name = "source_url")
    private String source_URL;

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRecipe_title() {
        return recipe_title;
    }

    public Favorites recipe_title(String recipe_title) {
        this.recipe_title = recipe_title;
        return this;
    }

    public void setRecipe_title(String recipe_title) {
        this.recipe_title = recipe_title;
    }

    public String getCuisine() {
        return cuisine;
    }

    public Favorites cuisine(String cuisine) {
        this.cuisine = cuisine;
        return this;
    }

    public void setCuisine(String cuisine) {
        this.cuisine = cuisine;
    }

    public String getIngredients() {
        return ingredients;
    }

    public Favorites ingredients(String ingredients) {
        this.ingredients = ingredients;
        return this;
    }

    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }

    public String getSource_URL() {
        return source_URL;
    }

    public Favorites source_URL(String source_URL) {
        this.source_URL = source_URL;
        return this;
    }

    public void setSource_URL(String source_URL) {
        this.source_URL = source_URL;
    }

    public User getUser() {
        return user;
    }

    public Favorites user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Favorites favorites = (Favorites) o;
        if (favorites.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), favorites.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Favorites{" +
            "id=" + getId() +
            ", recipe_title='" + getRecipe_title() + "'" +
            ", cuisine='" + getCuisine() + "'" +
            ", ingredients='" + getIngredients() + "'" +
            ", source_URL='" + getSource_URL() + "'" +
            "}";
    }
}
