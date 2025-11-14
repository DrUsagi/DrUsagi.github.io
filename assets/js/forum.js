// Forum JavaScript
// This forum uses Firebase Firestore for data storage
// IP-based authentication is handled client-side (note: this is not fully secure, but sufficient for a personal website)

// Firebase configuration
// IMPORTANT: Replace these with your own Firebase config
// Get your config from: https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Check if Firebase is configured
function isFirebaseConfigured() {
  return firebaseConfig.apiKey !== "YOUR_API_KEY" && 
         firebaseConfig.projectId !== "YOUR_PROJECT_ID" &&
         typeof firebase !== 'undefined';
}

// Initialize Firebase
let db = null;
if (typeof firebase !== 'undefined' && isFirebaseConfigured()) {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
} else {
  console.error('Firebase not configured or SDK not loaded');
}

// Get user's IP address (using a free service)
async function getUserIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting IP:', error);
    // Fallback: use a random ID stored in localStorage
    let ip = localStorage.getItem('userIP');
    if (!ip) {
      ip = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userIP', ip);
    }
    return ip;
  }
}

// Store IP in localStorage for consistency
let userIP = null;
getUserIP().then(ip => {
  userIP = ip;
  localStorage.setItem('userIP', ip);
});

// Get IP from localStorage if available (for faster loading)
if (!userIP) {
  userIP = localStorage.getItem('userIP') || 'unknown';
}

// Forum state
let currentPostId = null;
let posts = [];

// Initialize forum
document.addEventListener('DOMContentLoaded', function() {
  // Check Firebase configuration
  if (!isFirebaseConfigured() || !db) {
    const errorMsg = `
      <div class="error" style="padding: 2em; margin: 2em 0;">
        <h3>⚠️ Firebase Not Configured</h3>
        <p>To use the forum, you need to configure Firebase:</p>
        <ol style="text-align: left; max-width: 600px; margin: 1em auto;">
          <li>Go to <a href="https://console.firebase.google.com/" target="_blank">Firebase Console</a> and create a project</li>
          <li>Enable Firestore Database</li>
          <li>Get your Firebase configuration from Project Settings</li>
          <li>Open <code>assets/js/forum.js</code> and replace the <code>firebaseConfig</code> object with your configuration</li>
          <li>See <code>FIREBASE_SETUP.md</code> for detailed instructions</li>
        </ol>
        <p style="margin-top: 1em;">
          <strong>Quick Setup:</strong><br>
          Edit <code>assets/js/forum.js</code> and replace:<br>
          <code style="background: #f0f0f0; padding: 0.5em; display: inline-block; margin-top: 0.5em;">
            apiKey: "YOUR_API_KEY"<br>
            projectId: "YOUR_PROJECT_ID"<br>
            ...
          </code>
        </p>
      </div>
    `;
    const postsList = document.getElementById('posts-list');
    if (postsList) {
      postsList.innerHTML = errorMsg;
    }
    const newPostSection = document.getElementById('new-post-section');
    if (newPostSection) {
      newPostSection.style.display = 'none';
    }
    return;
  }

  // Load posts
  loadPosts();

  // New post form handler
  const newPostForm = document.getElementById('new-post-form');
  if (newPostForm) {
    newPostForm.addEventListener('submit', handleNewPost);
  }

  // Reply form handler
  const replyForm = document.getElementById('reply-form');
  if (replyForm) {
    replyForm.addEventListener('submit', handleReply);
  }

  // Modal close handler
  const modal = document.getElementById('post-modal');
  const closeBtn = document.querySelector('.close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});

// Load all posts
function loadPosts() {
  if (!db || !isFirebaseConfigured()) {
    console.error('Firebase not configured');
    return;
  }

  const postsList = document.getElementById('posts-list');
  postsList.innerHTML = '<p class="loading">Loading posts...</p>';

  db.collection('forum_posts')
    .orderBy('createdAt', 'desc')
    .get()
    .then((querySnapshot) => {
      posts = [];
      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });

      if (posts.length === 0) {
        postsList.innerHTML = '<p>No posts yet. Be the first to start a discussion!</p>';
        return;
      }

      postsList.innerHTML = '';
      posts.forEach(post => {
        postsList.appendChild(createPostElement(post));
      });
    })
    .catch((error) => {
      console.error('Error loading posts:', error);
      postsList.innerHTML = '<div class="error">Error loading posts. Please refresh the page.</div>';
    });
}

// Create post element
function createPostElement(post) {
  const postDiv = document.createElement('div');
  postDiv.className = 'post-item';
  postDiv.dataset.postId = post.id;

  const createdAt = post.createdAt ? post.createdAt.toDate() : new Date();
  const replyCount = post.replies ? post.replies.length : 0;

  postDiv.innerHTML = `
    <div class="post-header">
      <h3 class="post-title">${escapeHtml(post.title)}</h3>
      <span class="post-meta">${formatDate(createdAt)}</span>
    </div>
    <div class="post-meta">By ${escapeHtml(post.author)} • ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}</div>
    <div class="post-content">${escapeHtml(post.content.substring(0, 200))}${post.content.length > 200 ? '...' : ''}</div>
    <div class="post-actions">
      <button class="btn btn--primary view-post-btn" data-post-id="${post.id}">View & Reply</button>
      ${canEditPost(post) ? `
        <button class="btn btn--secondary edit-post-btn" data-post-id="${post.id}">Edit</button>
        <button class="btn btn--danger delete-post-btn" data-post-id="${post.id}">Delete</button>
      ` : ''}
    </div>
  `;

  // Add event listeners
  postDiv.querySelector('.view-post-btn').addEventListener('click', () => viewPost(post.id));
  if (postDiv.querySelector('.edit-post-btn')) {
    postDiv.querySelector('.edit-post-btn').addEventListener('click', () => editPost(post.id));
  }
  if (postDiv.querySelector('.delete-post-btn')) {
    postDiv.querySelector('.delete-post-btn').addEventListener('click', () => deletePost(post.id));
  }

  return postDiv;
}

// Handle new post submission
async function handleNewPost(e) {
  e.preventDefault();

  const title = document.getElementById('post-title').value.trim();
  const author = document.getElementById('post-author').value.trim();
  const content = document.getElementById('post-content').value.trim();

  if (!title || !author || !content) {
    alert('Please fill in all fields');
    return;
  }

  if (!db || !isFirebaseConfigured()) {
    alert('Firebase not configured. Please configure Firebase in assets/js/forum.js');
    return;
  }

  const ip = await getUserIP();

  const newPost = {
    title: title,
    author: author,
    content: content,
    authorIP: ip,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    replies: []
  };

  try {
    await db.collection('forum_posts').add(newPost);
    
    // Reset form
    document.getElementById('new-post-form').reset();
    
    // Show success message
    showMessage('Post created successfully!', 'success');
    
    // Reload posts
    loadPosts();
  } catch (error) {
    console.error('Error creating post:', error);
    showMessage('Error creating post. Please try again.', 'error');
  }
}

// View post and replies
function viewPost(postId) {
  if (!db || !isFirebaseConfigured()) return;

  const post = posts.find(p => p.id === postId);
  if (!post) return;

  currentPostId = postId;
  const modal = document.getElementById('post-modal');
  const modalContent = document.getElementById('modal-post-content');
  const repliesList = document.getElementById('replies-list');

  const createdAt = post.createdAt ? post.createdAt.toDate() : new Date();

  modalContent.innerHTML = `
    <h2>${escapeHtml(post.title)}</h2>
    <div class="post-meta">By ${escapeHtml(post.author)} • ${formatDate(createdAt)}</div>
    <div class="post-content" style="margin: 1em 0; padding: 1em; background: #f9f9f9; border-radius: 4px;">
      ${escapeHtml(post.content).replace(/\n/g, '<br>')}
    </div>
    ${canEditPost(post) ? `
      <div class="post-actions">
        <button class="btn btn--secondary edit-post-btn" data-post-id="${post.id}">Edit Post</button>
        <button class="btn btn--danger delete-post-btn" data-post-id="${post.id}">Delete Post</button>
      </div>
    ` : ''}
  `;

  // Add edit/delete handlers
  const editBtn = modalContent.querySelector('.edit-post-btn');
  const deleteBtn = modalContent.querySelector('.delete-post-btn');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      editPost(postId);
    });
  }
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this post? This will also delete all replies.')) {
        modal.style.display = 'none';
        deletePost(postId);
      }
    });
  }

  // Load replies
  loadReplies(postId);

  modal.style.display = 'block';
}

// Load replies for a post
function loadReplies(postId) {
  if (!db || !isFirebaseConfigured()) return;

  const repliesList = document.getElementById('replies-list');
  repliesList.innerHTML = '<p class="loading">Loading replies...</p>';

  db.collection('forum_posts').doc(postId).get()
    .then((doc) => {
      if (!doc.exists) {
        repliesList.innerHTML = '<p>Post not found</p>';
        return;
      }

      const post = doc.data();
      const replies = post.replies || [];

      if (replies.length === 0) {
        repliesList.innerHTML = '<p>No replies yet. Be the first to reply!</p>';
        return;
      }

      repliesList.innerHTML = '';
      replies.forEach((reply, index) => {
        repliesList.appendChild(createReplyElement(reply, index, postId));
      });
    })
    .catch((error) => {
      console.error('Error loading replies:', error);
      repliesList.innerHTML = '<div class="error">Error loading replies</div>';
    });
}

// Create reply element
function createReplyElement(reply, index, postId) {
  const replyDiv = document.createElement('div');
  replyDiv.className = 'reply-item';
  replyDiv.dataset.replyIndex = index;

  const createdAt = reply.createdAt ? reply.createdAt.toDate() : new Date();

  replyDiv.innerHTML = `
    <div class="reply-header">
      <span class="reply-author">${escapeHtml(reply.author)}</span>
      <span class="reply-date">${formatDate(createdAt)}</span>
    </div>
    <div class="reply-content">${escapeHtml(reply.content).replace(/\n/g, '<br>')}</div>
    ${canEditReply(reply) ? `
      <div class="post-actions" style="margin-top: 0.5em;">
        <button class="btn btn--secondary edit-reply-btn" data-post-id="${postId}" data-reply-index="${index}">Edit</button>
        <button class="btn btn--danger delete-reply-btn" data-post-id="${postId}" data-reply-index="${index}">Delete</button>
      </div>
    ` : ''}
  `;

  // Add event listeners
  const editBtn = replyDiv.querySelector('.edit-reply-btn');
  const deleteBtn = replyDiv.querySelector('.delete-reply-btn');
  if (editBtn) {
    editBtn.addEventListener('click', () => editReply(postId, index));
  }
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this reply?')) {
        deleteReply(postId, index);
      }
    });
  }

  return replyDiv;
}

// Handle reply submission
async function handleReply(e) {
  e.preventDefault();

  const author = document.getElementById('reply-author').value.trim();
  const content = document.getElementById('reply-content').value.trim();

  if (!author || !content) {
    alert('Please fill in all fields');
    return;
  }

  if (!db || !isFirebaseConfigured()) {
    alert('Firebase not configured. Please configure Firebase in assets/js/forum.js');
    return;
  }

  const ip = await getUserIP();

  const newReply = {
    author: author,
    content: content,
    authorIP: ip,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    const postRef = db.collection('forum_posts').doc(currentPostId);
    const postDoc = await postRef.get();
    const post = postDoc.data();
    const replies = post.replies || [];
    replies.push(newReply);

    await postRef.update({ replies: replies });

    // Reset form
    document.getElementById('reply-form').reset();

    // Reload replies
    loadReplies(currentPostId);
    showMessage('Reply posted successfully!', 'success');
  } catch (error) {
    console.error('Error posting reply:', error);
    showMessage('Error posting reply. Please try again.', 'error');
  }
}

// Check if user can edit a post
function canEditPost(post) {
  return post.authorIP === userIP || post.authorIP === localStorage.getItem('userIP');
}

// Check if user can edit a reply
function canEditReply(reply) {
  return reply.authorIP === userIP || reply.authorIP === localStorage.getItem('userIP');
}

// Edit post
async function editPost(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post || !canEditPost(post)) {
    alert('You can only edit your own posts');
    return;
  }

  const newTitle = prompt('Edit title:', post.title);
  if (newTitle === null) return;

  const newContent = prompt('Edit content:', post.content);
  if (newContent === null) return;

  if (!db || !isFirebaseConfigured()) return;

  try {
    await db.collection('forum_posts').doc(postId).update({
      title: newTitle,
      content: newContent,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    showMessage('Post updated successfully!', 'success');
    loadPosts();
  } catch (error) {
    console.error('Error updating post:', error);
    showMessage('Error updating post. Please try again.', 'error');
  }
}

// Delete post
async function deletePost(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post || !canEditPost(post)) {
    alert('You can only delete your own posts');
    return;
  }

  if (!db || !isFirebaseConfigured()) return;

  try {
    await db.collection('forum_posts').doc(postId).delete();
    showMessage('Post deleted successfully!', 'success');
    loadPosts();
  } catch (error) {
    console.error('Error deleting post:', error);
    showMessage('Error deleting post. Please try again.', 'error');
  }
}

// Edit reply
async function editReply(postId, replyIndex) {
  if (!db || !isFirebaseConfigured()) return;

  try {
    const postRef = db.collection('forum_posts').doc(postId);
    const postDoc = await postRef.get();
    const post = postDoc.data();
    const replies = post.replies || [];
    const reply = replies[replyIndex];

    if (!reply || !canEditReply(reply)) {
      alert('You can only edit your own replies');
      return;
    }

    const newContent = prompt('Edit reply:', reply.content);
    if (newContent === null) return;

    replies[replyIndex] = {
      ...reply,
      content: newContent,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    await postRef.update({ replies: replies });

    showMessage('Reply updated successfully!', 'success');
    loadReplies(postId);
  } catch (error) {
    console.error('Error updating reply:', error);
    showMessage('Error updating reply. Please try again.', 'error');
  }
}

// Delete reply
async function deleteReply(postId, replyIndex) {
  if (!db || !isFirebaseConfigured()) return;

  try {
    const postRef = db.collection('forum_posts').doc(postId);
    const postDoc = await postRef.get();
    const post = postDoc.data();
    const replies = post.replies || [];
    const reply = replies[replyIndex];

    if (!reply || !canEditReply(reply)) {
      alert('You can only delete your own replies');
      return;
    }

    replies.splice(replyIndex, 1);
    await postRef.update({ replies: replies });

    showMessage('Reply deleted successfully!', 'success');
    loadReplies(postId);
  } catch (error) {
    console.error('Error deleting reply:', error);
    showMessage('Error deleting reply. Please try again.', 'error');
  }
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function showMessage(message, type) {
  const container = document.getElementById('forum-container');
  const messageDiv = document.createElement('div');
  messageDiv.className = type;
  messageDiv.textContent = message;
  container.insertBefore(messageDiv, container.firstChild);
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

