// Continuous Scroll Script

// Define the order of pages
const pages = [
    { id: 'home', url: 'index.html' },
    { id: 'about', url: 'about.html' },
    { id: 'projects', url: 'works.html' },
    { id: 'education', url: 'Education.html' },
    { id: 'contact', url: 'contact.html' }
  ];
  
  let currentPageIndex = 0;
  
  // Function to load content
  function loadContent(url, targetElement) {
    fetch(url)
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const content = doc.querySelector('.section-container');
        targetElement.innerHTML = content.innerHTML;
      })
      .catch(error => console.error('Error loading content:', error));
  }
  
  // Function to handle scrolling
  function handleScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const bodyHeight = document.body.offsetHeight;
  
    // If we're near the bottom of the page, load the next page
    if (scrollPosition >= bodyHeight - 100 && currentPageIndex < pages.length - 1) {
      currentPageIndex++;
      const nextPage = pages[currentPageIndex];
      const newSection = document.createElement('div');
      newSection.id = nextPage.id;
      newSection.className = 'section-container';
      document.body.appendChild(newSection);
      loadContent(nextPage.url, newSection);
      
      // Update the URL without reloading the page
      history.pushState(null, '', nextPage.url);
      
      // Update active nav item
      updateActiveNavItem();
    }
  }
  
  // Function to update active nav item
  function updateActiveNavItem() {
    const navItems = document.querySelectorAll('#navbar-collapse a');
    navItems.forEach(item => item.classList.remove('active'));
    const currentNav = document.querySelector(`#navbar-collapse a[href="./${pages[currentPageIndex].url}"]`);
    if (currentNav) currentNav.classList.add('active');
  }
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);
  
  // Initial load
  window.addEventListener('DOMContentLoaded', (event) => {
    const initialSection = document.createElement('div');
    initialSection.id = pages[0].id;
    initialSection.className = 'section-container';
    document.body.appendChild(initialSection);
    loadContent(pages[0].url, initialSection);
    updateActiveNavItem();
  });
  
  // Handle navigation clicks
  document.querySelector('#navbar-collapse').addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      event.preventDefault();
      const clickedPageIndex = pages.findIndex(page => page.url === event.target.getAttribute('href').slice(2));
      if (clickedPageIndex !== -1) {
        window.scrollTo(0, 0);
        document.body.innerHTML = '';
        currentPageIndex = clickedPageIndex;
        const newSection = document.createElement('div');
        newSection.id = pages[currentPageIndex].id;
        newSection.className = 'section-container';
        document.body.appendChild(newSection);
        loadContent(pages[currentPageIndex].url, newSection);
        history.pushState(null, '', pages[currentPageIndex].url);
        updateActiveNavItem();
      }
    }
  });