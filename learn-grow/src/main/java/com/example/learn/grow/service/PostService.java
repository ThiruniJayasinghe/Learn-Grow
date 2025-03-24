package com.example.learn.grow.service;

import com.example.learn.grow.model.Post;
import com.example.learn.grow.repository.PostRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;


import java.util.List;

@Service
@RequiredArgsConstructor

public class PostService {

    private final PostRepository postRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public Post updatePost(Long id, Post postDetails) {
        Post post = getPostById(id);
        post.setTitle(postDetails.getTitle());
        post.setDescription(postDetails.getDescription());
        return postRepository.save(post);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}

