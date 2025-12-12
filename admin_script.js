// Complete GreenLine Admin Panel JavaScript with Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌿 GreenLine Admin Panel Initialized');
    
    // Initialize everything
    initializeAdminPanel();
    setupEventListeners();
    loadInitialData();
    updateCurrentDate();
});

// Initialize admin panel
function initializeAdminPanel() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('greenline_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update theme toggle icon
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    
    // Show loading animation for 1 second
    setTimeout(() => {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            loadingOverlay.style.visibility = 'hidden';
        }
        showToast('Welcome to GreenLine Admin Panel!', 'success');
    }, 1000);
}

// Setup all event listeners
function setupEventListeners() {
    // Mobile navigation toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const sidebar = document.getElementById('sidebar');
    
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    mobileOverlay.addEventListener('click', closeMobileMenu);
    
    // Close sidebar when clicking on navigation links (mobile)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                closeMobileMenu();
            }
        });
    });
    
    // Navigation
    setupNavigation();
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Notification panel
    document.getElementById('notificationBtn').addEventListener('click', toggleNotifications);
    document.getElementById('closeNotifications').addEventListener('click', toggleNotifications);
    document.getElementById('markAllRead').addEventListener('click', markAllNotificationsRead);
    
    // Refresh dashboard
    document.getElementById('refreshDashboard').addEventListener('click', refreshDashboard);
    
    // Load demo data
    document.getElementById('loadDemoData').addEventListener('click', addSampleData);
    
    // Picture management
    setupPictureManagement();
    
    // Leadership management
    setupLeadershipManagement();
    
    // Bulk actions
    document.getElementById('bulkAddPictures').addEventListener('click', showBulkAddModal);
    document.getElementById('exportPictures').addEventListener('click', exportPictures);
    document.getElementById('exportLeaders').addEventListener('click', exportLeaders);
    
    // Backup and restore
    document.getElementById('backupData').addEventListener('click', backupData);
    document.getElementById('importData').addEventListener('click', importData);
    
    // View all activity
    document.getElementById('viewAllActivity').addEventListener('click', viewAllActivity);
    
    // Preview slider
    setupPreviewSlider();
    
    // Modal close
    document.getElementById('closeModal').addEventListener('click', closeModal);
    
    // Click outside modal to close
    document.getElementById('imageModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    // Character counters
    document.getElementById('picture-alt').addEventListener('input', updateAltCharCount);
    document.getElementById('leader-bio').addEventListener('input', updateBioCharCount);
    
    // Image preview updates
    document.getElementById('picture-url').addEventListener('input', updateImagePreview);
    document.getElementById('leader-name').addEventListener('input', updateLeaderPreview);
    document.getElementById('leader-title').addEventListener('input', updateLeaderPreview);
    document.getElementById('leader-photo').addEventListener('input', updateLeaderPreview);
    document.getElementById('leader-department').addEventListener('change', updateLeaderPreview);
    
    // Test image URL
    document.getElementById('testImageUrl').addEventListener('click', testImageUrl);
    
    // Tags input
    setupTagsInput();
    
    // Expertise selection
    setupExpertiseSelection();
    
    // Order controls
    document.getElementById('increaseOrder').addEventListener('click', increaseOrder);
    document.getElementById('decreaseOrder').addEventListener('click', decreaseOrder);
    
    // Use template
    document.getElementById('useTemplate').addEventListener('click', useLeaderTemplate);
    
    // Search functionality
    document.getElementById('pictureSearch').addEventListener('input', searchPictures);
    document.getElementById('leaderSearch').addEventListener('input', searchLeaders);
    
    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', toggleView);
    });
    
    // Sort functionality
    document.getElementById('sort-pictures').addEventListener('change', sortPictures);
    document.getElementById('sort-leaders').addEventListener('change', sortLeaders);
    
    // Filter functionality
    document.getElementById('filter-page').addEventListener('change', filterPictures);
    document.getElementById('filter-section').addEventListener('change', filterPictures);
    document.getElementById('filter-department').addEventListener('change', filterLeaders);
    
    // Select all pictures
    document.getElementById('selectAllPictures').addEventListener('click', selectAllPictures);
    document.getElementById('deleteSelectedPictures').addEventListener('click', deleteSelectedPictures);
    
    // Rotate and zoom preview
    document.getElementById('rotatePreview').addEventListener('click', rotatePreview);
    document.getElementById('zoomPreview').addEventListener('click', zoomPreview);
}

// Mobile menu functions
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileOverlay');
    const toggleBtn = document.getElementById('mobileMenuToggle');
    
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('active');
    
    // Change icon based on state
    if (sidebar.classList.contains('mobile-open')) {
        toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    } else {
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = ''; // Re-enable scrolling
    }
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileOverlay');
    const toggleBtn = document.getElementById('mobileMenuToggle');
    
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.style.overflow = ''; // Re-enable scrolling
}

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.classList.contains('external')) return;
            
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Switch to section
            switchSection(sectionId);
        });
    });
}

// Switch between sections
function switchSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Update page title
        const sectionName = targetSection.querySelector('h1').textContent;
        document.title = `${sectionName} | GreenLine Admin`;
        
        // If switching to dashboard, refresh it
        if (sectionId === 'dashboard') {
            refreshDashboard();
        }
    }
}

// Toggle theme
function toggleTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('greenline_theme', 'light');
        showToast('Switched to light theme', 'info');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('greenline_theme', 'dark');
        showToast('Switched to dark theme', 'info');
    }
}

// Toggle notification panel
function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    panel.classList.toggle('open');
    
    // Mark as read when opening
    if (panel.classList.contains('open')) {
        document.querySelector('.notification-count').textContent = '0';
        document.querySelector('.notification-count').style.display = 'none';
    }
}

// Mark all notifications as read
function markAllNotificationsRead() {
    document.querySelectorAll('.notification-item.unread').forEach(item => {
        item.classList.remove('unread');
    });
    
    showToast('All notifications marked as read', 'success');
    toggleNotifications();
}

// Update current date display
function updateCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Refresh dashboard
function refreshDashboard() {
    const refreshBtn = document.getElementById('refreshDashboard');
    const originalHTML = refreshBtn.innerHTML;
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
    refreshBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        updateDashboardCounts();
        updateMiniCharts();
        updatePreviewSlides();
        updateActivityTimeline();
        
        refreshBtn.innerHTML = originalHTML;
        refreshBtn.disabled = false;
        
        showToast('Dashboard refreshed successfully', 'success');
    }, 800);
}

// Update dashboard counts
function updateDashboardCounts() {
    const pictures = JSON.parse(localStorage.getItem('greenline_pictures') || '[]');
    const leaders = JSON.parse(localStorage.getItem('greenline_leaders') || '[]');
    
    document.getElementById('picture-count').textContent = pictures.length;
    document.getElementById('leadership-count').textContent = leaders.length;
    document.getElementById('leaderCount').textContent = leaders.length;
}

// Update mini charts
function updateMiniCharts() {
    // Picture growth chart
    const pictureChart = document.getElementById('picture-chart');
    if (pictureChart) {
        pictureChart.innerHTML = '';
        const values = [30, 45, 60, 75, 90];
        values.forEach(value => {
            const bar = document.createElement('div');
            bar.style.width = '6px';
            bar.style.height = `${value}%`;
            bar.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-green').trim();
            bar.style.marginRight = '2px';
            bar.style.borderRadius = '2px';
            bar.style.display = 'inline-block';
            pictureChart.appendChild(bar);
        });
    }
    
    // Leader growth chart
    const leaderChart = document.getElementById('leader-chart');
    if (leaderChart) {
        leaderChart.innerHTML = '';
        const values = [20, 40, 60, 80, 100];
        values.forEach(value => {
            const bar = document.createElement('div');
            bar.style.width = '6px';
            bar.style.height = `${value}%`;
            bar.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--success').trim();
            bar.style.marginRight = '2px';
            bar.style.borderRadius = '2px';
            bar.style.display = 'inline-block';
            leaderChart.appendChild(bar);
        });
    }
}

// Update preview slides
function updatePreviewSlides() {
    const pictures = JSON.parse(localStorage.getItem('greenline_pictures') || '[]');
    const leaders = JSON.parse(localStorage.getItem('greenline_leaders') || '[]');
    
    // Update latest pictures
    const latestPictures = document.getElementById('latestPictures');
    if (pictures.length > 0) {
        latestPictures.innerHTML = '';
        pictures.slice(-3).forEach(pic => {
            const img = document.createElement('img');
            img.src = pic.url;
            img.alt = pic.alt;
            img.style.width = '90px';
            img.style.height = '70px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '6px';
            img.style.marginRight = '8px';
            img.style.marginBottom = '8px';
            img.onerror = function() {
                this.src = 'https://via.placeholder.com/90x70/1e5631/FFFFFF?text=Image';
            };
            latestPictures.appendChild(img);
        });
    } else {
        latestPictures.innerHTML = '<p class="preview-empty">No pictures added yet. Add your first image!</p>';
    }
    
    // Update latest leaders
    const latestLeaders = document.getElementById('latestLeaders');
    if (leaders.length > 0) {
        latestLeaders.innerHTML = '';
        leaders.slice(-2).forEach(leader => {
            const div = document.createElement('div');
            div.className = 'preview-leader';
            div.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <img src="${leader.photo}" alt="${leader.name}" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover;" onerror="this.src='https://via.placeholder.com/35/1e5631/FFFFFF?text=${leader.name.charAt(0)}'">
                    <div>
                        <h5 style="margin: 0; font-size: 13px;">${leader.name}</h5>
                        <p style="margin: 0; font-size: 11px; color: var(--primary-green);">${leader.title}</p>
                    </div>
                </div>
            `;
            latestLeaders.appendChild(div);
        });
    } else {
        latestLeaders.innerHTML = '<p class="preview-empty">No team members added yet. Add your first leader!</p>';
    }
}

// Update activity timeline
function updateActivityTimeline() {
    const timeline = document.getElementById('activityTimeline');
    const activities = JSON.parse(localStorage.getItem('greenline_activities') || '[]');
    
    if (activities.length > 0) {
        timeline.innerHTML = '';
        activities.slice(-3).forEach(activity => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.innerHTML = `
                <div class="timeline-icon ${activity.type}">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="timeline-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <span class="timeline-time">${activity.time}</span>
                </div>
            `;
            timeline.appendChild(item);
        });
    }
}

// Setup picture management
function setupPictureManagement() {
    const form = document.getElementById('pictureForm');
    if (form) {
        form.addEventListener('submit', addPicture);
    }
    
    document.getElementById('clearPictureForm').addEventListener('click', clearPictureForm);
    
    // Load existing pictures
    renderPictures();
}

// Add picture
function addPicture(e) {
    e.preventDefault();
    
    const loader = document.getElementById('pictureLoader');
    loader.style.display = 'inline-block';
    
    const url = document.getElementById('picture-url').value.trim();
    const altText = document.getElementById('picture-alt').value.trim();
    const page = document.getElementById('picture-page').value;
    const section = document.getElementById('picture-section').value;
    const tags = Array.from(document.querySelectorAll('.tag-item')).map(tag => tag.textContent.replace('×', '').trim());
    
    if (!url || !altText) {
        showToast('Please fill in all required fields', 'error');
        loader.style.display = 'none';
        return;
    }
    
    const picture = {
        id: Date.now(),
        url: url,
        alt: altText,
        page: page,
        section: section,
        tags: tags,
        dateAdded: new Date().toISOString(),
        size: '1920x1080',
        format: url.split('.').pop().toUpperCase()
    };
    
    let pictures = JSON.parse(localStorage.getItem('greenline_pictures') || '[]');
    pictures.push(picture);
    localStorage.setItem('greenline_pictures', JSON.stringify(pictures));
    
    addActivity('Image Added', `Added "${altText.substring(0, 30)}..." to ${page} page`, 'success', 'fa-image');
    
    renderPictures();
    updateDashboardCounts();
    updatePreviewSlides();
    
    showToast('Picture added successfully!', 'success');
    clearPictureForm();
    loader.style.display = 'none';
}

// Render pictures
function renderPictures(pictures = null) {
    if (!pictures) {
        pictures = JSON.parse(localStorage.getItem('greenline_pictures') || '[]');
    }
    
    const container = document.getElementById('pictures-grid');
    
    if (pictures.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-images"></i>
                </div>
                <h3>No Pictures Yet</h3>
                <p>Your picture gallery is empty. Add your first image to get started!</p>
                <button class="btn-empty-action" onclick="document.getElementById('picture-url').focus()">
                    <i class="fas fa-plus"></i> Add First Picture
                </button>
            </div>
        `;
        return;
    }
    
    const pageFilter = document.getElementById('filter-page').value;
    const sectionFilter = document.getElementById('filter-section').value;
    const searchTerm = document.getElementById('pictureSearch').value.toLowerCase();
    
    let filteredPictures = pictures;
    
    if (pageFilter !== 'all') {
        filteredPictures = filteredPictures.filter(p => p.page === pageFilter);
    }
    
    if (sectionFilter !== 'all') {
        filteredPictures = filteredPictures.filter(p => p.section === sectionFilter);
    }
    
    if (searchTerm) {
        filteredPictures = filteredPictures.filter(p => 
            p.alt.toLowerCase().includes(searchTerm) ||
            p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    const sortBy = document.getElementById('sort-pictures').value;
    filteredPictures.sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.dateAdded) - new Date(a.dateAdded);
        if (sortBy === 'oldest') return new Date(a.dateAdded) - new Date(b.dateAdded);
        if (sortBy === 'name') return a.alt.localeCompare(b.alt);
        return 0;
    });
    
    container.innerHTML = '';
    filteredPictures.forEach(picture => {
        const item = document.createElement('div');
        item.className = 'picture-item';
        item.setAttribute('data-id', picture.id);
        
        item.innerHTML = `
            <div class="delete-overlay">
                <i class="fas fa-trash-alt"></i>
                <span>Click to Remove</span>
            </div>
            <img src="${picture.url}" alt="${picture.alt}" onerror="this.src='https://via.placeholder.com/300x200/1e5631/FFFFFF?text=Image+Error'">
            <div class="picture-info">
                <h4>${picture.alt.substring(0, 20)}${picture.alt.length > 20 ? '...' : ''}</h4>
                <div class="picture-meta">
                    <span>${picture.page}</span>
                    <span>${picture.section}</span>
                </div>
            </div>
        `;
        
        item.addEventListener('click', function(e) {
            if (!e.target.closest('.delete-overlay')) return;
            removePicture(picture.id);
        });
        
        container.appendChild(item);
    });
}

// Clear picture form
function clearPictureForm() {
    document.getElementById('pictureForm').reset();
    document.getElementById('tagsList').innerHTML = '';
    document.getElementById('image-preview').innerHTML = `
        <div class="preview-placeholder">
            <i class="fas fa-image"></i>
            <p>Enter image URL to see preview</p>
        </div>
    `;
    document.getElementById('previewSize').textContent = '--';
    document.getElementById('previewFormat').textContent = '--';
    updateAltCharCount();
}

// Update image preview
function updateImagePreview() {
    const url = document.getElementById('picture-url').value.trim();
    const preview = document.getElementById('image-preview');
    
    if (url) {
        preview.innerHTML = `
            <img src="${url}" alt="Preview" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200/cccccc/666666?text=Invalid+URL';">
        `;
        
        document.getElementById('previewSize').textContent = '1920x1080';
        document.getElementById('previewFormat').textContent = url.split('.').pop().toUpperCase();
    }
}

// Update alt character count
function updateAltCharCount() {
    const altText = document.getElementById('picture-alt').value;
    document.getElementById('altCharCount').textContent = altText.length;
}

// Test image URL
function testImageUrl() {
    const url = document.getElementById('picture-url').value.trim();
    if (!url) {
        showToast('Please enter an image URL first', 'error');
        return;
    }
    
    const testBtn = document.getElementById('testImageUrl');
    const originalHTML = testBtn.innerHTML;
    testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
    
    setTimeout(() => {
        const img = new Image();
        img.onload = function() {
            showToast('✓ Image URL is valid and accessible', 'success');
            testBtn.innerHTML = originalHTML;
        };
        img.onerror = function() {
            showToast('✗ Image URL is invalid or not accessible', 'error');
            testBtn.innerHTML = originalHTML;
        };
        img.src = url;
    }, 1000);
}

// Setup tags input
function setupTagsInput() {
    const tagsInput = document.getElementById('picture-tags');
    const tagsList = document.getElementById('tagsList');
    
    tagsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            e.preventDefault();
            
            const tag = this.value.trim();
            const tagItem = document.createElement('div');
            tagItem.className = 'tag-item';
            tagItem.innerHTML = `
                ${tag}
                <i class="fas fa-times" onclick="this.parentElement.remove()"></i>
            `;
            
            tagsList.appendChild(tagItem);
            this.value = '';
        }
    });
}

// Remove picture
function removePicture(id) {
    let pictures = JSON.parse(localStorage.getItem('greenline_pictures') || '[]');
    const index = pictures.findIndex(p => p.id === id);
    
    if (index !== -1) {
        const removed = pictures.splice(index, 1)[0];
        localStorage.setItem('greenline_pictures', JSON.stringify(pictures));
        
        addActivity('Image Removed', `Removed "${removed.alt.substring(0, 30)}..."`, 'warning', 'fa-trash');
        
        renderPictures();
        updateDashboardCounts();
        
        showToast('Picture removed successfully', 'success');
    }
}

// Setup leadership management
function setupLeadershipManagement() {
    const form = document.getElementById('leaderForm');
    if (form) {
        form.addEventListener('submit', addLeader);
    }
    
    document.getElementById('clearLeaderForm').addEventListener('click', clearLeaderForm);
    
    renderLeaders();
}

// Add leader
function addLeader(e) {
    e.preventDefault();
    
    const loader = document.getElementById('leaderLoader');
    loader.style.display = 'inline-block';
    
    const name = document.getElementById('leader-name').value.trim();
    const title = document.getElementById('leader-title').value.trim();
    const bio = document.getElementById('leader-bio').value.trim();
    const photo = document.getElementById('leader-photo').value.trim();
    const department = document.getElementById('leader-department').value;
    const order = parseInt(document.getElementById('leader-order').value);
    const expertise = document.getElementById('leader-expertise').value.split(',').filter(e => e);
    
    if (!name || !title || !bio) {
        showToast('Please fill in all required fields', 'error');
        loader.style.display = 'none';
        return;
    }
    
    const leader = {
        id: Date.now(),
        name: name,
        title: title,
        bio: bio,
        photo: photo || 'https://via.placeholder.com/150/1e5631/FFFFFF?text=' + name.charAt(0),
        department: department,
        order: order,
        expertise: expertise,
        dateAdded: new Date().toISOString()
    };
    
    let leaders = JSON.parse(localStorage.getItem('greenline_leaders') || '[]');
    leaders.push(leader);
    
    leaders.sort((a, b) => a.order - b.order);
    localStorage.setItem('greenline_leaders', JSON.stringify(leaders));
    
    addActivity('Team Member Added', `Added "${name}" to leadership team`, 'success', 'fa-user-plus');
    
    renderLeaders();
    updateDashboardCounts();
    updatePreviewSlides();
    
    showToast(`${name} added to leadership team!`, 'success');
    clearLeaderForm();
    loader.style.display = 'none';
}

// Render leaders
function renderLeaders(leaders = null) {
    if (!leaders) {
        leaders = JSON.parse(localStorage.getItem('greenline_leaders') || '[]');
    }
    
    const container = document.getElementById('leaders-list');
    
    if (leaders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-users"></i>
                </div>
                <h3>No Team Members Yet</h3>
                <p>Your leadership team is empty. Add your first team member to showcase GreenLine's leadership.</p>
                <button class="btn-empty-action" onclick="document.getElementById('leader-name').focus()">
                    <i class="fas fa-user-plus"></i> Add First Member
                </button>
            </div>
        `;
        return;
    }
    
    const deptFilter = document.getElementById('filter-department').value;
    const searchTerm = document.getElementById('leaderSearch').value.toLowerCase();
    
    let filteredLeaders = leaders;
    
    if (deptFilter !== 'all') {
        filteredLeaders = filteredLeaders.filter(l => l.department === deptFilter);
    }
    
    if (searchTerm) {
        filteredLeaders = filteredLeaders.filter(l => 
            l.name.toLowerCase().includes(searchTerm) ||
            l.title.toLowerCase().includes(searchTerm) ||
            l.bio.toLowerCase().includes(searchTerm)
        );
    }
    
    const sortBy = document.getElementById('sort-leaders').value;
    filteredLeaders.sort((a, b) => {
        if (sortBy === 'order') return a.order - b.order;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'department') return a.department.localeCompare(b.department);
        if (sortBy === 'newest') return new Date(b.dateAdded) - new Date(a.dateAdded);
        return 0;
    });
    
    container.innerHTML = '';
    filteredLeaders.forEach(leader => {
        const item = document.createElement('div');
        item.className = 'leader-item';
        item.setAttribute('data-id', leader.id);
        
        item.innerHTML = `
            <img src="${leader.photo}" alt="${leader.name}" class="leader-photo" onerror="this.src='https://via.placeholder.com/150/1e5631/FFFFFF?text=${leader.name.charAt(0)}'">
            <div class="leader-details">
                <h4>${leader.name}</h4>
                <p>${leader.title}</p>
                <p class="bio">${leader.bio.substring(0, 100)}${leader.bio.length > 100 ? '...' : ''}</p>
            </div>
            <div class="leader-order">${leader.order}</div>
        `;
        
        item.addEventListener('click', function() {
            removeLeader(leader.id);
        });
        
        container.appendChild(item);
    });
}

// Clear leader form
function clearLeaderForm() {
    document.getElementById('leaderForm').reset();
    document.getElementById('leader-order').value = 1;
    document.querySelectorAll('.expertise-tag.selected').forEach(tag => {
        tag.classList.remove('selected');
    });
    document.getElementById('leader-expertise').value = '';
    updateLeaderPreview();
    updateBioCharCount();
}

// Update leader preview
function updateLeaderPreview() {
    const name = document.getElementById('leader-name').value || 'Full Name';
    const title = document.getElementById('leader-title').value || 'Position/Title';
    const photo = document.getElementById('leader-photo').value;
    const department = document.getElementById('leader-department').value;
    const bio = document.getElementById('leader-bio').value || 'Biography will appear here...';
    const expertise = document.getElementById('leader-expertise').value.split(',').filter(e => e);
    
    document.getElementById('previewName').textContent = name;
    document.getElementById('previewTitle').textContent = title;
    document.getElementById('previewDepartment').textContent = department.charAt(0).toUpperCase() + department.slice(1);
    document.getElementById('previewBio').textContent = bio;
    
    if (photo) {
        document.querySelector('.preview-avatar').innerHTML = `<img src="${photo}" alt="${name}" onerror="this.src='https://via.placeholder.com/70/1e5631/FFFFFF?text=${name.charAt(0)}'">`;
    } else {
        document.querySelector('.preview-avatar').innerHTML = '<i class="fas fa-user-circle"></i>';
    }
    
    const expertiseContainer = document.getElementById('previewExpertise');
    expertiseContainer.innerHTML = '';
    expertise.forEach(exp => {
        const span = document.createElement('span');
        span.className = 'expertise-preview';
        span.textContent = exp.charAt(0).toUpperCase() + exp.slice(1);
        expertiseContainer.appendChild(span);
    });
}

// Update bio character count
function updateBioCharCount() {
    const bio = document.getElementById('leader-bio').value;
    document.getElementById('bioCharCount').textContent = bio.length;
}

// Setup expertise selection
function setupExpertiseSelection() {
    const tags = document.querySelectorAll('.expertise-tag');
    const hiddenInput = document.getElementById('leader-expertise');
    
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            this.classList.toggle('selected');
            
            const selected = Array.from(document.querySelectorAll('.expertise-tag.selected'))
                .map(t => t.getAttribute('data-value'));
            hiddenInput.value = selected.join(',');
            
            updateLeaderPreview();
        });
    });
}

// Increase order
function increaseOrder() {
    const input = document.getElementById('leader-order');
    input.value = parseInt(input.value) + 1;
}

// Decrease order
function decreaseOrder() {
    const input = document.getElementById('leader-order');
    if (input.value > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// Use leader template
function useLeaderTemplate() {
    const templates = [
        {
            name: 'Chief Sustainability Officer',
            title: 'Chief Sustainability Officer',
            bio: 'Driving GreenLine\'s sustainability initiatives with 15+ years of experience in environmental policy and sustainable development. Previously worked with UNEP on African sustainability projects.',
            department: 'executive',
            expertise: ['sustainability', 'leadership', 'strategy']
        },
        {
            name: 'Head of Agriculture',
            title: 'Head of Sustainable Agriculture',
            bio: 'Agricultural scientist specializing in organic farming and sustainable food systems. PhD in Agricultural Sciences with extensive field experience across West Africa.',
            department: 'agriculture',
            expertise: ['sustainability', 'operations', 'innovation']
        },
        {
            name: 'Marketing Director',
            title: 'Director of Strategic Marketing',
            bio: 'Expert in sustainable brand development and eco-conscious marketing strategies. Has led successful campaigns for multiple sustainable brands across Africa.',
            department: 'marketing',
            expertise: ['marketing', 'strategy', 'innovation']
        }
    ];
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    document.getElementById('leader-name').value = template.name;
    document.getElementById('leader-title').value = template.title;
    document.getElementById('leader-bio').value = template.bio;
    document.getElementById('leader-department').value = template.department;
    
    document.querySelectorAll('.expertise-tag').forEach(tag => {
        tag.classList.toggle('selected', template.expertise.includes(tag.getAttribute('data-value')));
    });
    
    document.getElementById('leader-expertise').value = template.expertise.join(',');
    
    updateLeaderPreview();
    showToast('Leadership template applied!', 'success');
}

// Remove leader
function removeLeader(id) {
    let leaders = JSON.parse(localStorage.getItem('greenline_leaders') || '[]');
    const index = leaders.findIndex(l => l.id === id);
    
    if (index !== -1) {
        const removed = leaders.splice(index, 1)[0];
        localStorage.setItem('greenline_leaders', JSON.stringify(leaders));
        
        addActivity('Team Member Removed', `Removed "${removed.name}" from leadership`, 'warning', 'fa-user-minus');
        
        renderLeaders();
        updateDashboardCounts();
        
        showToast(`${removed.name} removed from leadership team`, 'success');
    }
}

// Show bulk add modal
function showBulkAddModal() {
    showToast('Bulk add feature coming soon!', 'info');
}

// Export pictures
function exportPictures() {
    const pictures = JSON.parse(localStorage.getItem('greenline_pictures') || '[]');
    if (pictures.length === 0) {
        showToast('No pictures to export', 'warning');
        return;
    }
    
    const dataStr = JSON.stringify(pictures, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `greenline-pictures-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showToast(`Exported ${pictures.length} pictures`, 'success');
}

// Export leaders
function exportLeaders() {
    const leaders = JSON.parse(localStorage.getItem('greenline_leaders') || '[]');
    if (leaders.length === 0) {
        showToast('No leaders to export', 'warning');
        return;
    }
    
    const dataStr = JSON.stringify(leaders, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `greenline-leaders-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showToast(`Exported ${leaders.length} leaders`, 'success');
}

// Backup data
function backupData() {
    const pictures = JSON.parse(localStorage.getItem('greenline_pictures') || '[]');
    const leaders = JSON.parse(localStorage.getItem('greenline_leaders') || '[]');
    
    const backup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        pictures: pictures,
        leaders: leaders
    };
    
    const dataStr = JSON.stringify(backup, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `greenline-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    addActivity('Backup Created', 'Created full website backup', 'success', 'fa-database');
    
    showToast('Backup created successfully', 'success');
}

// Import data
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const backup = JSON.parse(event.target.result);
                
                if (!backup.pictures || !backup.leaders) {
                    throw new Error('Invalid backup file format');
                }
                
                localStorage.setItem('greenline_pictures', JSON.stringify(backup.pictures));
                localStorage.setItem('greenline_leaders', JSON.stringify(backup.leaders));
                
                renderPictures();
                renderLeaders();
                updateDashboardCounts();
                
                addActivity('Data Restored', 'Restored website data from backup', 'success', 'fa-history');
                
                showToast('Data imported successfully!', 'success');
            } catch (error) {
                showToast('Error importing backup file', 'error');
                console.error('Import error:', error);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// View all activity
function viewAllActivity() {
    showToast('Activity log feature coming soon!', 'info');
}

// Setup preview slider
function setupPreviewSlider() {
    const slides = document.querySelectorAll('.preview-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtns = document.querySelectorAll('.slide-btn.prev');
    const nextBtns = document.querySelectorAll('.slide-btn.next');
    
    let currentSlide = 0;
    
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Auto-rotate slides every 5 seconds
    setInterval(nextSlide, 5000);
    
    prevBtns.forEach(btn => btn.addEventListener('click', prevSlide));
    nextBtns.forEach(btn => btn.addEventListener('click', nextSlide));
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
}

// Close modal
function closeModal() {
    document.getElementById('imageModal').classList.remove('open');
}

// Rotate preview
function rotatePreview() {
    const preview = document.querySelector('#image-preview img');
    if (preview) {
        const currentRotation = parseInt(preview.style.transform.replace('rotate(', '').replace('deg)', '')) || 0;
        preview.style.transform = `rotate(${currentRotation + 90}deg)`;
    }
}

// Zoom preview
function zoomPreview() {
    const preview = document.querySelector('#image-preview img');
    if (preview && preview.src) {
        document.getElementById('modalImage').src = preview.src;
        document.getElementById('imageModal').classList.add('open');
    }
}

// Search pictures
function searchPictures() {
    renderPictures();
}

// Search leaders
function searchLeaders() {
    renderLeaders();
}

// Toggle view (grid/list)
function toggleView(e) {
    const view = e.currentTarget.getAttribute('data-view');
    const container = document.getElementById('picturesContainer');
    
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    if (view === 'list') {
        container.classList.add('list-view');
        document.getElementById('pictures-grid').style.gridTemplateColumns = '1fr';
    } else {
        container.classList.remove('list-view');
        document.getElementById('pictures-grid').style.gridTemplateColumns = 'repeat(auto-fill, minmax(160px, 1fr))';
    }
}

// Sort pictures
function sortPictures() {
    renderPictures();
}

// Sort leaders
function sortLeaders() {
    renderLeaders();
}

// Filter pictures
function filterPictures() {
    renderPictures();
}

// Filter leaders
function filterLeaders() {
    renderLeaders();
}

// Select all pictures
function selectAllPictures() {
    const items = document.querySelectorAll('.picture-item');
    const allSelected = Array.from(items).every(item => item.classList.contains('selected'));
    
    items.forEach(item => {
        if (allSelected) {
            item.classList.remove('selected');
        } else {
            item.classList.add('selected');
        }
    });
    
    const btn = document.getElementById('selectAllPictures');
    btn.innerHTML = allSelected ? 
        '<i class="fas fa-check-square"></i> Select All' : 
        '<i class="fas fa-times-circle"></i> Deselect All';
}

// Delete selected pictures
function deleteSelectedPictures() {
    const selected = document.querySelectorAll('.picture-item.selected');
    if (selected.length === 0) {
        showToast('No pictures selected', 'warning');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${selected.length} selected pictures?`)) {
        selected.forEach(item => {
            const id = parseInt(item.getAttribute('data-id'));
            removePicture(id);
        });
        
        showToast(`Deleted ${selected.length} pictures`, 'success');
    }
}

// Add activity to timeline
function addActivity(title, description, type, icon) {
    const activities = JSON.parse(localStorage.getItem('greenline_activities') || '[]');
    
    activities.push({
        title: title,
        description: description,
        type: type,
        icon: icon,
        time: 'Just now'
    });
    
    if (activities.length > 10) {
        activities.shift();
    }
    
    localStorage.setItem('greenline_activities', JSON.stringify(activities));
    updateActivityTimeline();
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    
    toast.className = 'toast';
    toast.classList.add(type);
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Load initial data
function loadInitialData() {
    updateDashboardCounts();
    updateMiniCharts();
    updatePreviewSlides();
    updateActivityTimeline();
    renderPictures();
    renderLeaders();
}

// Add sample data for demo
function addSampleData() {
    // Sample pictures
    const samplePictures = [
        {
            id: 1,
            url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            alt: 'Sustainable agriculture field with green crops',
            page: 'home',
            section: 'banner',
            tags: ['agriculture', 'sustainable', 'field'],
            dateAdded: new Date().toISOString(),
            size: '1920x1080',
            format: 'JPG'
        },
        {
            id: 2,
            url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            alt: 'Modern sustainable building architecture',
            page: 'home',
            section: 'content',
            tags: ['architecture', 'sustainable', 'building'],
            dateAdded: new Date(Date.now() - 86400000).toISOString(),
            size: '1920x1080',
            format: 'JPG'
        },
        {
            id: 3,
            url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            alt: 'Team collaboration meeting for sustainability project',
            page: 'strategic-marketing',
            section: 'team',
            tags: ['team', 'meeting', 'collaboration'],
            dateAdded: new Date(Date.now() - 172800000).toISOString(),
            size: '1920x1080',
            format: 'JPG'
        }
    ];
    
    // Sample leaders
    const sampleLeaders = [
        {
            id: 101,
            name: 'Alex Johnson',
            title: 'Chief Sustainability Officer',
            bio: 'Over 15 years of experience in sustainable development and environmental policy. PhD in Environmental Science from Cambridge. Previously worked with UNEP on African sustainability projects. Passionate about creating lasting environmental impact.',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            department: 'executive',
            order: 1,
            expertise: ['sustainability', 'leadership', 'strategy', 'policy'],
            dateAdded: new Date().toISOString()
        },
        {
            id: 102,
            name: 'Maria Rodriguez',
            title: 'Head of Sustainable Agriculture',
            bio: 'Agricultural scientist with expertise in organic farming and sustainable food systems. PhD in Agricultural Sciences with extensive field experience across West Africa. Former UN consultant on food security projects.',
            photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            department: 'agriculture',
            order: 2,
            expertise: ['agriculture', 'sustainability', 'operations', 'innovation'],
            dateAdded: new Date(Date.now() - 86400000).toISOString()
        }
    ];
    
    // Sample activities
    const sampleActivities = [
        {
            title: 'Admin Panel Launched',
            description: 'GreenLine Admin Panel successfully deployed and ready for use',
            type: 'success',
            icon: 'fa-rocket',
            time: '2 days ago'
        },
        {
            title: 'Sample Data Loaded',
            description: 'Demo content added for testing and demonstration',
            type: 'info',
            icon: 'fa-database',
            time: 'Just now'
        }
    ];
    
    // Save sample data
    localStorage.setItem('greenline_pictures', JSON.stringify(samplePictures));
    localStorage.setItem('greenline_leaders', JSON.stringify(sampleLeaders));
    localStorage.setItem('greenline_activities', JSON.stringify(sampleActivities));
    
    // Update UI
    loadInitialData();
    
    showToast('Demo data loaded successfully!', 'success');
}