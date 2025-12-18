// Mobile Menu Toggle
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Show Project Detail Alert
function showProjectDetail(projectName) {
    const message = `You clicked on "${projectName}"!\n\nIn a full implementation, this would navigate to a detailed project page with:\n- Full project description\n- Screenshots and demos\n- Technologies used\n- Challenges and solutions\n- Live demo link`;
    alert(message);
}

// Handle Form Submission
function handleSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Show success animation
    const submitBtn = event.target.querySelector('.submit-button');
    submitBtn.textContent = 'Sending...';
    submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    
    // Simulate form submission
    setTimeout(() => {
        alert(`Thank you, ${name}! Your message has been received.\n\nI'll get back to you at ${email} as soon as possible.`);
        submitBtn.textContent = 'Message Sent! ✓';
        
        // Reset form after 2 seconds
        setTimeout(() => {
            event.target.reset();
            submitBtn.textContent = 'Send Message';
            submitBtn.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
        }, 2000);
    }, 1500);
}

// Add scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.project-card, .skill-card, .blog-card');
    elements.forEach(el => observer.observe(el));
});

// Add click ripple effect
document.addEventListener('click', (e) => {
    const isClickable = e.target.closest('.cta-button, .project-card, .skill-card, .blog-card, .submit-button');
    if (isClickable) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.left = e.pageX - 10 + 'px';
        ripple.style.top = e.pageY - 10 + 'px';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'rippleEffect 0.6s ease-out';
        
        document.body.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
});

// Broken Link Checker - Checks for broken internal and external links
// This function should be run periodically (weekly for large sites, monthly for small sites)
function checkBrokenLinks() {
    const links = document.querySelectorAll('a[href]');
    const brokenLinks = [];
    let checkedLinks = 0;
    const totalLinks = links.length;
    
    console.log(`Checking ${totalLinks} links for broken references...`);
    
    links.forEach((link, index) => {
        const href = link.getAttribute('href');
        
        // Skip mailto, tel, and javascript links
        if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || href.startsWith('#')) {
            checkedLinks++;
            return;
        }
        
        // For internal links, check if the file exists
        if (!href.startsWith('http')) {
            fetch(href, { method: 'HEAD', mode: 'no-cors' })
                .catch(() => {
                    brokenLinks.push({
                        url: href,
                        element: link,
                        text: link.textContent.trim() || 'No text'
                    });
                })
                .finally(() => {
                    checkedLinks++;
                    if (checkedLinks === totalLinks) {
                        reportBrokenLinks(brokenLinks);
                    }
                });
        } else {
            // For external links, try to fetch them
            fetch(href, { method: 'HEAD', mode: 'no-cors' })
                .catch(() => {
                    brokenLinks.push({
                        url: href,
                        element: link,
                        text: link.textContent.trim() || 'No text',
                        type: 'external'
                    });
                })
                .finally(() => {
                    checkedLinks++;
                    if (checkedLinks === totalLinks) {
                        reportBrokenLinks(brokenLinks);
                    }
                });
        }
    });
    
    // If no links to check
    if (totalLinks === 0) {
        console.log('No links found to check.');
    }
}

function reportBrokenLinks(brokenLinks) {
    if (brokenLinks.length === 0) {
        console.log('✓ All links are working correctly!');
        return;
    }
    
    console.warn(`⚠ Found ${brokenLinks.length} potentially broken link(s):`);
    brokenLinks.forEach((brokenLink, index) => {
        console.warn(`${index + 1}. ${brokenLink.url} (Link text: "${brokenLink.text}")`);
        // Optionally mark broken links in the DOM
        if (brokenLink.element) {
            brokenLink.element.style.border = '2px solid red';
            brokenLink.element.title = 'This link may be broken';
        }
    });
    
    // Store broken links info (can be sent to analytics or logging service)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'broken_link_detected', {
            'broken_links_count': brokenLinks.length,
            'broken_links': brokenLinks.map(l => l.url).join(', ')
        });
    }
}

// Run broken link check on page load (can be disabled in production)
// For production, use this only in development or via a scheduled task
// Uncomment the line below to enable automatic checking
// document.addEventListener('DOMContentLoaded', () => setTimeout(checkBrokenLinks, 2000));

// Manual link checker function that can be called from browser console
// Usage: In browser console, type: checkBrokenLinks()
window.checkBrokenLinks = checkBrokenLinks;

// Link classification helper - identifies internal, inbound, and outbound links
function classifyLinks() {
    const links = document.querySelectorAll('a[href]');
    const baseDomain = window.location.hostname;
    const classification = {
        internal: [],
        outbound: [],
        inbound: [] // Note: Inbound links are links from OTHER sites TO your site, 
                    // so they won't be found in your own HTML, but you can track them via analytics
    };
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        const linkText = link.textContent.trim() || 'No text';
        
        // Skip special protocol links
        if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || href.startsWith('#')) {
            return;
        }
        
        // Internal links (same domain or relative paths)
        if (!href.startsWith('http') || href.includes(baseDomain)) {
            classification.internal.push({
                url: href,
                text: linkText
            });
        } else {
            // Outbound links (different domain)
            classification.outbound.push({
                url: href,
                text: linkText
            });
        }
    });
    
    console.log('Link Classification:');
    console.log(`Internal Links: ${classification.internal.length}`, classification.internal);
    console.log(`Outbound Links: ${classification.outbound.length}`, classification.outbound);
    
    return classification;
}

// Make classifyLinks available globally
window.classifyLinks = classifyLinks;

console.log('Portfolio website loaded successfully!');
console.log('SEO Tools Available:');
console.log('  - checkBrokenLinks() - Check for broken links');
console.log('  - classifyLinks() - Classify links as internal/outbound');
