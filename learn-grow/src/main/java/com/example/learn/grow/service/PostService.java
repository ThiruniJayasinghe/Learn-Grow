package com.example.learn.grow.service;

import com.example.learn.grow.model.Post;
import com.example.learn.grow.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final String uploadDir = System.getProperty("user.dir") + "/uploads/";

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    public Post createPost(String title, String description, List<MultipartFile> files) throws IOException {
        if (files.size() > 3) {
            throw new RuntimeException("Maximum 3 files allowed");
        }

        Post post = new Post();
        post.setTitle(title);
        post.setDescription(description);

        List<String> filePaths = new ArrayList<>();
        for (MultipartFile file : files) {
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));

            // Basic extension check
            if (!List.of(".jpg", ".jpeg", ".png", ".mp4").contains(extension.toLowerCase())) {
                throw new RuntimeException("Unsupported file format");
            }

            // Save file
            String filename = UUID.randomUUID().toString() + extension;
            File dest = new File(uploadDir + filename);
            dest.getParentFile().mkdirs();
            file.transferTo(dest);

            filePaths.add(filename);
        }

        post.setFilePaths(filePaths);
        return postRepository.save(post);
    }

    // Updated method that handles file uploads and deletions
    public Post updatePost(Long id, String title, String description, List<MultipartFile> files, List<String> deletedFiles) throws IOException {
        Post post = getPostById(id);
        post.setTitle(title);
        post.setDescription(description);
    
        // Handle file deletion
        if (deletedFiles != null && !deletedFiles.isEmpty()) {
            for (String deletedFile : deletedFiles) {
                deleteFileFromSystem(deletedFile);
                post.getFilePaths().remove(deletedFile);
            }
        }
    
        // Handle file uploads (new or updated)
        if (files != null && !files.isEmpty()) {
            // Check the total number of files after the update
            if (post.getFilePaths().size() + files.size() > 3) {
                throw new RuntimeException("Maximum 3 files allowed");
            }
    
            List<String> filePaths = new ArrayList<>(post.getFilePaths());
            for (MultipartFile file : files) {
                String originalFilename = file.getOriginalFilename();
                String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
    
                // Basic extension check
                if (!List.of(".jpg", ".jpeg", ".png", ".mp4").contains(extension.toLowerCase())) {
                    throw new RuntimeException("Unsupported file format");
                }
    
                // Save file
                String filename = UUID.randomUUID().toString() + extension;
                File dest = new File(uploadDir + filename);
                dest.getParentFile().mkdirs();
                file.transferTo(dest);
    
                filePaths.add(filename);
            }
            post.setFilePaths(filePaths);
        }
    
        return postRepository.save(post);
    }
    

    // Delete a file from the file system
    private void deleteFileFromSystem(String filename) {
        File file = new File(uploadDir + filename);
        if (file.exists()) {
            if (!file.delete()) {
                System.out.println("Failed to delete file: " + filename);
            }
        }
    }

    public void deletePost(Long id) {
        Post post = getPostById(id);
        
        // Delete all files associated with the post
        for (String filePath : post.getFilePaths()) {
            deleteFileFromSystem(filePath);
        }

        postRepository.deleteById(id);
    }

    // Additional method for updating the post with only title, description, and deleted files
    public Post updatePost(Long id, String title, String description, List<String> deletedFiles) {
        Post post = getPostById(id);
        post.setTitle(title);
        post.setDescription(description);

        // Remove deleted files from the filePaths list and delete them from the file system
        for (String fileName : deletedFiles) {
            if (post.getFilePaths().contains(fileName)) {
                // Delete the file from file system
                File fileToDelete = new File(uploadDir + fileName);
                if (fileToDelete.exists()) {
                    fileToDelete.delete();
                }

                // Remove from filePaths
                post.getFilePaths().remove(fileName);
            }
        }

        return postRepository.save(post);
    }
}
