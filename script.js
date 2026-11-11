(function () {
  // Dynamic Year in footer
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Mobile navigation toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    // Close mobile menu when a nav link is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }

  // Active section highlighting on scroll & Back to top button visibility
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset + 120;

    // Show/hide back to top button
    if (backToTopBtn) {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active nav link highlight
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Smooth scroll to top when back to top button is clicked
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Contact form submission handler (Email + WhatsApp bridge)
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn.innerHTML;

      // Extract form values for WhatsApp forwarding
      const name = form.querySelector('#name')?.value.trim() || 'Client';
      const email = form.querySelector('#email')?.value.trim() || '';
      const phone = form.querySelector('#phone')?.value.trim() || 'Not provided';
      const service = form.querySelector('#service')?.value || 'General Inquiry';
      const message = form.querySelector('#message')?.value.trim() || '';

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending message...';

      // Build formatted WhatsApp message
      const waText = `*New Project Inquiry from Website*%0A%0A` +
        `*Name:* ${encodeURIComponent(name)}%0A` +
        `*Email:* ${encodeURIComponent(email)}%0A` +
        `*Phone:* ${encodeURIComponent(phone)}%0A` +
        `*Service:* ${encodeURIComponent(service)}%0A` +
        `*Message:* ${encodeURIComponent(message)}`;

      const waUrl = `https://wa.me/2349047552985?text=${waText}`;

      try {
        const formData = new FormData(form);
        const endpoint = form.getAttribute('action') || 'https://formspree.io/f/mnpdqvrj';

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        if (response.ok) {
          if (feedback) {
            feedback.innerHTML = `
              <div class="feedback-success">
                <p>✅ <strong>Thank you! Your details have been sent to my email.</strong></p>
                <p style="margin: 0.5rem 0; font-size: 0.88rem; color: var(--text-muted);">Want a faster response? Click below to also send this directly to my WhatsApp:</p>
                <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="whatsapp-send-btn">
                  <i class="fab fa-whatsapp"></i> Also Send to my WhatsApp
                </a>
              </div>
            `;
            feedback.style.display = 'block';
          }
          // Attempt to open WhatsApp directly as well
          window.open(waUrl, '_blank');
          form.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        // Fallback: If network/endpoint issues arise, ensure the client can still send via WhatsApp
        if (feedback) {
          feedback.innerHTML = `
            <div class="feedback-success">
              <p>✅ <strong>Your message is ready!</strong></p>
              <p style="margin: 0.5rem 0; font-size: 0.88rem; color: var(--text-muted);">Click below to send your details directly to my WhatsApp:</p>
              <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="whatsapp-send-btn">
                <i class="fab fa-whatsapp"></i> Send to WhatsApp Now
              </a>
            </div>
          `;
          feedback.style.display = 'block';
        }
        window.open(waUrl, '_blank');
        form.reset();
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  }
})();
