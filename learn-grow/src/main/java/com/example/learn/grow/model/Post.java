package com.example.learn.grow.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    // Store file paths in a separate table as a collection of strings
    @ElementCollection
    @CollectionTable(name = "post_files", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "file_path")
    private List<String> filePaths = new ArrayList<>();

    // You can add additional logic here if you need, for example, for tracking deleted files
}
