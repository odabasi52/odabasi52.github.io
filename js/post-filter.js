document.addEventListener('DOMContentLoaded', function() {
  const filterInput = document.getElementById('postFilter');
  const resultCount = document.getElementById('filterResultCount');
  const postList = document.getElementById('postList');
  const paginationDiv = document.getElementById('pagination');
  const allPostsDataScript = document.getElementById('allPostsData');
  
  let allPosts = [];
  let filteredPosts = [];
  let currentPage = 1;
  const postsPerPage = 10;
  let debounceTimer;

  // Load all posts from the JSON data
  if (allPostsDataScript) {
    try {
      const data = JSON.parse(allPostsDataScript.textContent);
      allPosts = data.posts;
    } catch (e) {
      console.error('Error parsing posts data:', e);
    }
  }

  function renderPosts(posts) {
    postList.innerHTML = '';

    if (posts.length === 0) {
      postList.innerHTML = '<p class="no-results-message">No posts found matching your search.</p>';
      paginationDiv.innerHTML = '';
      return;
    }

    // Calculate pagination
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToShow = posts.slice(startIndex, endIndex);

    // Render posts for current page
    postsToShow.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'post-item';
      postElement.innerHTML = `
        <h2>
          <a class="post-link" href="${post.url}">
            ${post.title}
          </a>
        </h2>
        <span class="post-meta">
          ${post.date}
          ${post.author ? ` • ${post.author}` : ''}
        </span>
        <p class="post-summary">${post.summary || post.excerpt || ''}</p>
      `;
      postList.appendChild(postElement);
    });

    // Render pagination
    if (totalPages > 1) {
      paginationDiv.innerHTML = '';

      // Previous button
      if (currentPage > 1) {
        const prevBtn = document.createElement('a');
        prevBtn.href = '#';
        prevBtn.className = 'page-link';
        prevBtn.textContent = '← Previous';
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          currentPage--;
          renderPosts(posts);
          window.scrollTo(0, 0);
        });
        paginationDiv.appendChild(prevBtn);
      } else {
        const prevBtn = document.createElement('span');
        prevBtn.className = 'page-link disabled';
        prevBtn.textContent = '← Previous';
        paginationDiv.appendChild(prevBtn);
      }

      // Page numbers
      const pageNumbersDiv = document.createElement('div');
      pageNumbersDiv.className = 'page-numbers';

      for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
          const span = document.createElement('span');
          span.className = 'page-link current';
          span.textContent = i;
          pageNumbersDiv.appendChild(span);
        } else {
          const link = document.createElement('a');
          link.href = '#';
          link.className = 'page-link';
          link.textContent = i;
          link.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            renderPosts(posts);
            window.scrollTo(0, 0);
          });
          pageNumbersDiv.appendChild(link);
        }
      }

      paginationDiv.appendChild(pageNumbersDiv);

      // Next button
      if (currentPage < totalPages) {
        const nextBtn = document.createElement('a');
        nextBtn.href = '#';
        nextBtn.className = 'page-link';
        nextBtn.textContent = 'Next →';
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          currentPage++;
          renderPosts(posts);
          window.scrollTo(0, 0);
        });
        paginationDiv.appendChild(nextBtn);
      } else {
        const nextBtn = document.createElement('span');
        nextBtn.className = 'page-link disabled';
        nextBtn.textContent = 'Next →';
        paginationDiv.appendChild(nextBtn);
      }
    } else {
      paginationDiv.innerHTML = '';
    }
  }

  function filterPosts() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const searchTerm = filterInput.value.toLowerCase();
      currentPage = 1; // Reset to first page when filtering

      if (searchTerm === '') {
        filteredPosts = [...allPosts];
        resultCount.style.display = 'none';
      } else {
        filteredPosts = allPosts.filter(post => {
          const title = post.title.toLowerCase();
          const summary = (post.summary || '').toLowerCase();
          const excerpt = (post.excerpt || '').toLowerCase();
          
          return title.includes(searchTerm) || 
                 summary.includes(searchTerm) || 
                 excerpt.includes(searchTerm);
        });

        resultCount.textContent = `${filteredPosts.length} result${filteredPosts.length !== 1 ? 's' : ''} found`;
        resultCount.style.display = 'inline-block';
      }

      renderPosts(filteredPosts);
    }, 150);
  }

  if (filterInput) {
    filterInput.addEventListener('input', filterPosts);
  }

  // Initial render with all posts
  filteredPosts = [...allPosts];
  renderPosts(filteredPosts);
});
