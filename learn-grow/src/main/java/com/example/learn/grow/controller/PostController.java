package com.example.learn.grow.controller;

import com.example.learn.grow.model.Post;
import com.example.learn.grow.service.PostService;
import com.fasterxml.jackson.core.type.TypeReference; 
import com.fasterxml.jackson.databind.ObjectMapper; 
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/postnew")
@RequiredArgsConstructor
@CrossOrigin("*")
public class PostController {

    private final PostService postService;

    @GetMapping("/posts")
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/posts/{id}")
    public Post getPost(@PathVariable Long id) {
        return postService.getPostById(id);
    }

    @PostMapping("/post")
    public ResponseEntity<Post> createPost(
            @RequestPart("title") String title,
            @RequestPart("description") String description,
            @RequestPart("files") List<MultipartFile> files
    ) throws IOException {
        Post post = postService.createPost(title, description, files);
        return ResponseEntity.ok(post);
    }

    @PutMapping("/{id}")
public ResponseEntity<Post> updatePost(
        @PathVariable Long id,
        @RequestPart("title") String title,
        @RequestPart("description") String description,
        @RequestPart(value = "files", required = false) List<MultipartFile> files,
        @RequestPart(value = "deletedFiles", required = false) String deletedFilesJson
) throws IOException {
    // Convert the deleted files JSON string into a list
    List<String> deletedFiles = deletedFilesJson != null ? parseDeletedFiles(deletedFilesJson) : null;

    // Call the service to update the post
    Post post = postService.updatePost(id, title, description, files, deletedFiles);
    return ResponseEntity.ok(post);
}


    private List<String> parseDeletedFiles(String deletedFilesJson) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(deletedFilesJson, new TypeReference<List<String>>() {});
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}
