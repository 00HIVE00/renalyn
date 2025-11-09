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

console.log('Portfolio website loaded successfully!');
