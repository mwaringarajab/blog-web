// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Dark mode toggle functionality
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            
            // Save preference to localStorage
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }
    
    // Mobile menu functionality
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Comment form submission
    const commentForm = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');
    
    if (commentForm && commentsList) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const commentInput = document.getElementById('comment');
            
            if (nameInput.value.trim() === '' || commentInput.value.trim() === '') {
                alert('Please fill in all fields');
                return;
            }
            
            // Create new comment element
            const newComment = document.createElement('div');
            newComment.className = 'comment';
            
            const commentHeader = document.createElement('div');
            commentHeader.className = 'comment-header';
            
            const nameElement = document.createElement('h4');
            nameElement.textContent = nameInput.value;
            
            const dateElement = document.createElement('span');
            const now = new Date();
            dateElement.textContent = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
            
            const commentContent = document.createElement('p');
            commentContent.textContent = commentInput.value;
            
            // Assemble the comment
            commentHeader.appendChild(nameElement);
            commentHeader.appendChild(dateElement);
            newComment.appendChild(commentHeader);
            newComment.appendChild(commentContent);
            
            // Add to comments list
            commentsList.appendChild(newComment);
            
            // Clear form
            nameInput.value = '';
            commentInput.value = '';
            
            // Save comments to localStorage
            saveComments();
        });
        
        // Load existing comments from localStorage
        loadComments();
    }
    
    // Newsletter subscription
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('email');
            
            if (emailInput.value.trim() === '' || !isValidEmail(emailInput.value)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Display subscription confirmation
            alert('Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        });
    }
    
    // Search functionality
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const blogPosts = document.querySelectorAll('.blog-post');
    const searchResults = document.getElementById('search-results');
    
    if (searchForm && searchInput && searchResults) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const query = searchInput.value.toLowerCase().trim();
            
            if (query === '') {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
                return;
            }
            
            searchResults.innerHTML = '';
            searchResults.style.display = 'block';
            
            let found = false;
            
            blogPosts.forEach(post => {
                const title = post.querySelector('h2').textContent.toLowerCase();
                const content = post.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(query) || content.includes(query)) {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    
                    const titleElement = document.createElement('h3');
                    titleElement.textContent = post.querySelector('h2').textContent;
                    
                    const snippet = document.createElement('p');
                    snippet.textContent = post.querySelector('p').textContent.substring(0, 100) + '...';
                    
                    const link = document.createElement('a');
                    link.href = '#' + post.id;
                    link.textContent = 'Read more';
                    link.addEventListener('click', function() {
                        searchResults.style.display = 'none';
                        searchInput.value = '';
                    });
                    
                    resultItem.appendChild(titleElement);
                    resultItem.appendChild(snippet);
                    resultItem.appendChild(link);
                    
                    searchResults.appendChild(resultItem);
                    found = true;
                }
            });
            
            if (!found) {
                const noResults = document.createElement('p');
                noResults.textContent = 'No results found for "' + query + '"';
                searchResults.appendChild(noResults);
            }
        });
        
        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchForm.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
    
    // Read more functionality
    const readMoreButtons = document.querySelectorAll('.read-more');
    
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const postId = this.getAttribute('data-post');
            const fullContent = document.getElementById(postId + '-full-content');
            const excerpt = this.previousElementSibling;
            
            if (fullContent.style.display === 'none' || !fullContent.style.display) {
                fullContent.style.display = 'block';
                excerpt.style.display = 'none';
                this.textContent = 'Show less';
            } else {
                fullContent.style.display = 'none';
                excerpt.style.display = 'block';
                this.textContent = 'Read more';
            }
        });
    });
    
    // Like functionality
    const likeButtons = document.querySelectorAll('.like-button');
    
    likeButtons.forEach(button => {
        // Check if this post was previously liked
        const postId = button.getAttribute('data-post');
        if (localStorage.getItem('liked-' + postId) === 'true') {
            button.classList.add('liked');
            button.querySelector('span').textContent = 'Liked';
        }
        
        button.addEventListener('click', function() {
            const likeCount = this.querySelector('.like-count');
            const likeText = this.querySelector('span');
            
            if (this.classList.contains('liked')) {
                // Unlike
                likeCount.textContent = parseInt(likeCount.textContent) - 1;
                this.classList.remove('liked');
                likeText.textContent = 'Like';
                localStorage.setItem('liked-' + postId, 'false');
            } else {
                // Like
                likeCount.textContent = parseInt(likeCount.textContent) + 1;
                this.classList.add('liked');
                likeText.textContent = 'Liked';
                localStorage.setItem('liked-' + postId, 'true');
            }
        });
    });
    
    // Helper functions
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function saveComments() {
        if (!commentsList) return;
        
        const comments = [];
        const commentElements = commentsList.querySelectorAll('.comment');
        
        commentElements.forEach(comment => {
            const name = comment.querySelector('h4').textContent;
            const date = comment.querySelector('span').textContent;
            const content = comment.querySelector('p').textContent;
            
            comments.push({
                name: name,
                date: date,
                content: content
            });
        });
        
        localStorage.setItem('blogComments', JSON.stringify(comments));
    }
    
    function loadComments() {
        if (!commentsList) return;
        
        const savedComments = localStorage.getItem('blogComments');
        
        if (savedComments) {
            const comments = JSON.parse(savedComments);
            
            comments.forEach(comment => {
                const newComment = document.createElement('div');
                newComment.className = 'comment';
                
                const commentHeader = document.createElement('div');
                commentHeader.className = 'comment-header';
                
                const nameElement = document.createElement('h4');
                nameElement.textContent = comment.name;
                
                const dateElement = document.createElement('span');
                dateElement.textContent = comment.date;
                
                const commentContent = document.createElement('p');
                commentContent.textContent = comment.content;
                
                commentHeader.appendChild(nameElement);
                commentHeader.appendChild(dateElement);
                newComment.appendChild(commentHeader);
                newComment.appendChild(commentContent);
                
                commentsList.appendChild(newComment);
            });
        }
    }
    
    // Scroll to top button
    const scrollTopButton = document.getElementById('scroll-top');
    
    if (scrollTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopButton.style.display = 'block';
            } else {
                scrollTopButton.style.display = 'none';
            }
        });
        
        scrollTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Image gallery functionality for blog posts with galleries
    const galleries = document.querySelectorAll('.image-gallery');
    
    galleries.forEach(gallery => {
        const images = gallery.querySelectorAll('img');
        const modalContainer = document.createElement('div');
        modalContainer.className = 'gallery-modal';
        document.body.appendChild(modalContainer);
        
        images.forEach(img => {
            img.addEventListener('click', function() {
                modalContainer.innerHTML = '';
                const enlargedImg = document.createElement('img');
                enlargedImg.src = this.src;
                
                const closeButton = document.createElement('span');
                closeButton.className = 'gallery-close';
                closeButton.innerHTML = '&times;';
                closeButton.addEventListener('click', function() {
                    modalContainer.style.display = 'none';
                });
                
                modalContainer.appendChild(enlargedImg);
                modalContainer.appendChild(closeButton);
                modalContainer.style.display = 'flex';
            });
        });
        
        // Close modal on click outside
        modalContainer.addEventListener('click', function(e) {
            if (e.target === modalContainer) {
                modalContainer.style.display = 'none';
            }
        });
    });
});