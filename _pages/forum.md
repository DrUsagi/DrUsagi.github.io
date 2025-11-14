---
layout: single
title: "Forum"
permalink: /forum/
author_profile: true
---

{% include base_path %}

<div id="forum-container">
  <h1>Discussion Forum</h1>
  <p>Welcome to the discussion forum! Feel free to start a new topic or join existing conversations.</p>
  
  <!-- New Post Form -->
  <div id="new-post-section" class="forum-section">
    <h2>Create New Post</h2>
    <form id="new-post-form">
      <div class="form-group">
        <label for="post-title">Title:</label>
        <input type="text" id="post-title" required placeholder="Enter post title...">
      </div>
      <div class="form-group">
        <label for="post-author">Your Name:</label>
        <input type="text" id="post-author" required placeholder="Enter your name...">
      </div>
      <div class="form-group">
        <label for="post-content">Content:</label>
        <textarea id="post-content" required rows="6" placeholder="Write your post content..."></textarea>
      </div>
      <button type="submit" class="btn btn--primary">Create Post</button>
    </form>
  </div>

  <!-- Posts List -->
  <div id="posts-section" class="forum-section">
    <h2>Recent Posts</h2>
    <div id="posts-list">
      <p class="loading">Loading posts...</p>
    </div>
  </div>
</div>

<!-- Post Modal (for viewing full post and replies) -->
<div id="post-modal" class="modal" style="display: none;">
  <div class="modal-content">
    <span class="close">&times;</span>
    <div id="modal-post-content"></div>
    <div id="replies-section">
      <h3>Replies</h3>
      <div id="replies-list"></div>
      <form id="reply-form">
        <div class="form-group">
          <label for="reply-author">Your Name:</label>
          <input type="text" id="reply-author" required placeholder="Enter your name...">
        </div>
        <div class="form-group">
          <label for="reply-content">Your Reply:</label>
          <textarea id="reply-content" required rows="4" placeholder="Write your reply..."></textarea>
        </div>
        <button type="submit" class="btn btn--primary">Post Reply</button>
      </form>
    </div>
  </div>
</div>

<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>

<!-- Forum JavaScript -->
<script src="{{ base_path }}/assets/js/forum.js"></script>

<style>
.forum-section {
  margin-bottom: 2em;
  padding: 1.5em;
  background: #f9f9f9;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1em;
}

.form-group label {
  display: block;
  margin-bottom: 0.5em;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75em;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1em;
}

.form-group textarea {
  resize: vertical;
}

.post-item {
  background: white;
  padding: 1.5em;
  margin-bottom: 1em;
  border-radius: 8px;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.post-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5em;
}

.post-title {
  font-size: 1.2em;
  font-weight: bold;
  color: #8B5CF6;
  margin: 0;
}

.post-meta {
  font-size: 0.9em;
  color: #666;
}

.post-content {
  margin-top: 0.5em;
  color: #333;
}

.post-actions {
  margin-top: 1em;
  display: flex;
  gap: 1em;
}

.btn {
  padding: 0.5em 1em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s;
}

.btn--primary {
  background-color: #8B5CF6;
  color: white;
}

.btn--primary:hover {
  background-color: #7C3AED;
}

.btn--danger {
  background-color: #ef4444;
  color: white;
}

.btn--danger:hover {
  background-color: #dc2626;
}

.btn--secondary {
  background-color: #6b7280;
  color: white;
}

.btn--secondary:hover {
  background-color: #4b5563;
}

.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.5);
}

.modal-content {
  background-color: #fefefe;
  margin: 5% auto;
  padding: 2em;
  border: 1px solid #888;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: #000;
}

.reply-item {
  background: #f9f9f9;
  padding: 1em;
  margin-bottom: 1em;
  border-radius: 4px;
  border-left: 3px solid #8B5CF6;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5em;
}

.reply-author {
  font-weight: bold;
  color: #8B5CF6;
}

.reply-date {
  font-size: 0.9em;
  color: #666;
}

.reply-content {
  color: #333;
}

.loading {
  text-align: center;
  color: #666;
  padding: 2em;
}

.error {
  color: #ef4444;
  padding: 1em;
  background: #fee;
  border-radius: 4px;
  margin: 1em 0;
}

.success {
  color: #10b981;
  padding: 1em;
  background: #ecfdf5;
  border-radius: 4px;
  margin: 1em 0;
}

.hidden {
  display: none;
}
</style>

