package com.example.learn.grow.service;

import com.example.learn.grow.model.Comment;
import com.example.learn.grow.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    public Comment getCommentById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    public Comment createComment(Comment comment) {
        return commentRepository.save(comment);
    }

    public Comment updateComment(Long id, Comment updatedComment) {
        Comment existingComment = getCommentById(id);
        existingComment.setAuthor(updatedComment.getAuthor());
        existingComment.setContent(updatedComment.getContent());
        return commentRepository.save(existingComment);
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}
