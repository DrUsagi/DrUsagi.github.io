---
layout: single
title: "Guestbook"
permalink: /guestbook/
author_profile: true
comments: false
---

# Guestbook

Welcome to my guestbook! Feel free to leave a message, share your thoughts, or just say hello. 

<div id="guestbook-container">
  <div id="guestbook-form">
    <h3>Leave a Message</h3>
    <form id="message-form">
      <div class="form-group">
        <label for="visitor-name">Your Name (optional):</label>
        <input type="text" id="visitor-name" placeholder="Anonymous" />
      </div>
      <div class="form-group">
        <label for="message-content">Your Message <span class="required">*</span>:</label>
        <textarea id="message-content" rows="5" placeholder="Write your message here (Markdown supported)..." required></textarea>
        <small>You can use Markdown formatting in your message.</small>
      </div>
      <button type="submit" id="submit-btn" class="btn btn--primary">Submit Message</button>
      <p id="form-status" class="form-status"></p>
    </form>
  </div>

  <div id="guestbook-messages">
    <h3>Messages</h3>
    <div id="messages-list">
      <p class="loading">Loading messages...</p>
    </div>
  </div>
</div>

<style>
#guestbook-container {
  max-width: 800px;
  margin: 0 auto;
}

#guestbook-form {
  background: #f5f5f5;
  padding: 2em;
  border-radius: 8px;
  margin-bottom: 2em;
}

.form-group {
  margin-bottom: 1.5em;
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
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
}

.form-group small {
  display: block;
  margin-top: 0.5em;
  color: #666;
  font-size: 0.9em;
}

.required {
  color: #d32f2f;
}

.form-status {
  margin-top: 1em;
  padding: 0.75em;
  border-radius: 4px;
  display: none;
}

.form-status.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  display: block;
}

.form-status.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  display: block;
}

.form-status.info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
  display: block;
}

#guestbook-messages {
  margin-top: 2em;
}

.message-item {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5em;
  margin-bottom: 1.5em;
  position: relative;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
  padding-bottom: 0.5em;
  border-bottom: 1px solid #e0e0e0;
}

.message-author {
  font-weight: bold;
  color: #333;
}

.message-date {
  color: #666;
  font-size: 0.9em;
}

.message-content {
  margin-top: 1em;
  line-height: 1.6;
}

.message-content p {
  margin: 0.5em 0;
}

.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.25em 0.75em;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85em;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.delete-btn:hover {
  opacity: 1;
}

.delete-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 2em;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 3em;
  color: #666;
}

.empty-state p {
  font-size: 1.1em;
  margin: 0.5em 0;
}

.setup-notice {
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  padding: 1.5em;
  margin-bottom: 2em;
}

.setup-notice h4 {
  margin-top: 0;
  color: #856404;
}

.setup-notice code {
  background: #f8f9fa;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}
</style>

<script>
// Guestbook functionality
(function() {
  'use strict';

  // Configuration - Update these values
  const GIST_ID = ''; // Leave empty to create new gist on first message
  const GIST_FILENAME = 'guestbook.json';
  const STORAGE_KEY = 'guestbook_visitor_id';
  const API_ENDPOINT = ''; // Your serverless function URL (e.g., Vercel, Netlify)
  
  // Get or create visitor ID (stored in localStorage)
  function getVisitorId() {
    let visitorId = localStorage.getItem(STORAGE_KEY);
    if (!visitorId) {
      // Generate a unique ID for this visitor
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(STORAGE_KEY, visitorId);
    }
    return visitorId;
  }

  // Load messages
  async function loadMessages() {
    const messagesList = document.getElementById('messages-list');
    
    if (!GIST_ID && !API_ENDPOINT) {
      messagesList.innerHTML = `
        <div class="setup-notice">
          <h4>⚠️ Guestbook Setup Required</h4>
          <p>This guestbook requires backend configuration. Please see <code>GUESTBOOK_SETUP.md</code> for setup instructions.</p>
          <p><strong>Quick Setup Options:</strong></p>
          <ul>
            <li>Use a serverless function (Vercel, Netlify Functions)</li>
            <li>Use Firebase Firestore</li>
            <li>Use Staticman (already configured in _config.yml)</li>
          </ul>
        </div>
      `;
      return;
    }

    try {
      let messages = [];
      
      if (API_ENDPOINT) {
        // Use custom API endpoint
        const response = await fetch(`${API_ENDPOINT}/messages`);
        if (response.ok) {
          messages = await response.json();
        }
      } else if (GIST_ID) {
        // Use GitHub Gist
        const response = await fetch(`https://api.github.com/gists/${GIST_ID}`);
        if (response.ok) {
          const gist = await response.json();
          const content = gist.files[GIST_FILENAME].content;
          messages = JSON.parse(content);
        }
      }

      displayMessages(messages);
    } catch (error) {
      console.error('Error loading messages:', error);
      messagesList.innerHTML = '<p class="error">Failed to load messages. Please try again later.</p>';
    }
  }

  // Display messages
  function displayMessages(messages) {
    const messagesList = document.getElementById('messages-list');
    const visitorId = getVisitorId();

    if (!messages || messages.length === 0) {
      messagesList.innerHTML = '<div class="empty-state"><p>No messages yet. Be the first to leave a message!</p></div>';
      return;
    }

    // Sort by date (newest first)
    messages.sort((a, b) => new Date(b.date) - new Date(a.date));

    messagesList.innerHTML = messages.map((msg, index) => {
      const canDelete = msg.visitorId === visitorId;
      const date = new Date(msg.date).toLocaleString();
      
      return `
        <div class="message-item" data-index="${index}" data-visitor-id="${msg.visitorId}">
          <div class="message-header">
            <span class="message-author">${escapeHtml(msg.name || 'Anonymous')}</span>
            <div style="display: flex; align-items: center; gap: 1em;">
              <span class="message-date">${date}</span>
              ${canDelete ? `<button class="delete-btn" onclick="deleteMessage(${index}, '${msg.visitorId}')">Delete</button>` : ''}
            </div>
          </div>
          <div class="message-content">${marked.parse(msg.content)}</div>
        </div>
      `;
    }).join('');
  }

  // Submit new message
  async function submitMessage(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('visitor-name');
    const contentInput = document.getElementById('message-content');
    const submitBtn = document.getElementById('submit-btn');
    const statusEl = document.getElementById('form-status');

    const name = nameInput.value.trim() || 'Anonymous';
    const content = contentInput.value.trim();

    if (!content) {
      showStatus('Please enter a message.', 'error');
      return;
    }

    submitBtn.disabled = true;
    showStatus('Submitting message...', 'info');

    const message = {
      name: name,
      content: content,
      date: new Date().toISOString(),
      visitorId: getVisitorId()
    };

    try {
      if (API_ENDPOINT) {
        // Use custom API endpoint
        const response = await fetch(`${API_ENDPOINT}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message)
        });

        if (!response.ok) {
          throw new Error('Failed to submit message');
        }

        showStatus('Message submitted successfully!', 'success');
        contentInput.value = '';
        nameInput.value = '';
        setTimeout(() => {
          loadMessages();
          showStatus('', '');
        }, 1500);
      } else {
        // Fallback: Show setup instructions
        showStatus('Backend API not configured. Please set up API_ENDPOINT or use Staticman. See GUESTBOOK_SETUP.md for details.', 'error');
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      showStatus('Failed to submit message. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  }

  // Delete message
  window.deleteMessage = async function(index, visitorId) {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    const currentVisitorId = getVisitorId();
    if (visitorId !== currentVisitorId) {
      alert('You can only delete your own messages.');
      return;
    }

    try {
      if (API_ENDPOINT) {
        const response = await fetch(`${API_ENDPOINT}/messages/${index}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ visitorId: currentVisitorId })
        });

        if (!response.ok) {
          throw new Error('Failed to delete message');
        }

        loadMessages();
      } else {
        alert('Delete functionality requires backend API setup.');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message. Please try again.');
    }
  }

  // Helper functions
  function showStatus(message, type) {
    const statusEl = document.getElementById('form-status');
    statusEl.textContent = message;
    statusEl.className = type ? `form-status ${type}` : 'form-status';
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize
  document.getElementById('message-form').addEventListener('submit', submitMessage);
  loadMessages();
})();
</script>
