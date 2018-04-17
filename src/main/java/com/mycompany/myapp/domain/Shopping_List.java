package com.mycompany.myapp.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Shopping_List.
 */
@Entity
@Table(name = "shopping_list")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "shopping_list")
public class Shopping_List implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "items")
    private String items;

    @Column(name = "notes")
    private String notes;

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getItems() {
        return items;
    }

    public Shopping_List items(String items) {
        this.items = items;
        return this;
    }

    public void setItems(String items) {
        this.items = items;
    }

    public String getNotes() {
        return notes;
    }

    public Shopping_List notes(String notes) {
        this.notes = notes;
        return this;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public User getUser() {
        return user;
    }

    public Shopping_List user(User user) {
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
        Shopping_List shopping_List = (Shopping_List) o;
        if (shopping_List.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), shopping_List.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Shopping_List{" +
            "id=" + getId() +
            ", items='" + getItems() + "'" +
            ", notes='" + getNotes() + "'" +
            "}";
    }
}
