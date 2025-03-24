package com.example.learn.grow.repository;

import com.example.learn.grow.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface PostRepository extends JpaRepository<Post, Long> {


}

