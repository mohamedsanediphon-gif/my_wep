/**
 * MOHAMED EL-SAYED MOHAMED SANAD - PORTFOLIO JAVASCRIPT
 * Aspiring Network Support Engineer | CCNA
 * Pure Vanilla JavaScript (No Frameworks, No External Dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* =========================================================================
     1. THEME SWITCHER (Dark Mode Default + Light Mode + LocalStorage)
     ========================================================================= */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved preference or default to 'dark'
  const savedTheme = localStorage.getItem('sanad-portfolio-theme') || 'dark';
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      localStorage.setItem('sanad-portfolio-theme', newTheme);
    });
  }

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }

  /* =========================================================================
     2. NAVBAR SCROLL EFFECT & MOBILE MENU
     ========================================================================= */
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky navbar shadow on scroll
  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileToggle.classList.contains('open');
      toggleMobileMenu(!isOpen);
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
        toggleMobileMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMobileMenu(false);
      }
    });
  }

  function toggleMobileMenu(open) {
    if (!mobileToggle || !navMenu) return;
    if (open) {
      mobileToggle.classList.add('open');
      navMenu.classList.add('open');
      mobileToggle.setAttribute('aria-expanded', 'true');
    } else {
      mobileToggle.classList.remove('open');
      navMenu.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  }

  /* =========================================================================
     3. ACTIVE NAVIGATION LINK ON SCROLL (IntersectionObserver)
     ========================================================================= */
  const sections = document.querySelectorAll('section[id], header[id]');

  const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));

  /* =========================================================================
     4. SCROLL REVEAL ANIMATIONS
     ========================================================================= */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('active'));
  }

  /* =========================================================================
     5. DYNAMIC NETWORK CONSTELLATION CANVAS (Hero Background)
     Subtle, lightweight mesh with travelling data packets
     ========================================================================= */
  const canvas = document.getElementById('network-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width, height;
    let nodes = [];
    let packets = [];
    let isVisible = true;

    // Node count scaled by viewport width
    const getNodeCount = () => {
      if (window.innerWidth < 600) return 22;
      if (window.innerWidth < 1000) return 38;
      return 55;
    };

    const maxConnectionDist = 135;

    class NetworkNode {
      constructor(x, y) {
        this.x = x || Math.random() * width;
        this.y = y || Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 2 + 1.8;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce gently at boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(nodeColor) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();
      }
    }

    class DataPacket {
      constructor(sourceNode, targetNode) {
        this.source = sourceNode;
        this.target = targetNode;
        this.progress = 0;
        this.speed = Math.random() * 0.015 + 0.01;
      }

      update() {
        this.progress += this.speed;
      }

      draw(packetColor) {
        const x = this.source.x + (this.target.x - this.source.x) * this.progress;
        const y = this.source.y + (this.target.y - this.source.y) * this.progress;

        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = packetColor;
        ctx.shadowBlur = 8;
        ctx.shadowColor = packetColor;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initNetwork() {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
      nodes = [];
      packets = [];

      const count = getNodeCount();
      for (let i = 0; i < count; i++) {
        nodes.push(new NetworkNode());
      }
    }

    function spawnPacket() {
      if (nodes.length < 2 || packets.length > 8) return;
      const sourceIdx = Math.floor(Math.random() * nodes.length);
      const source = nodes[sourceIdx];

      // Find nearby neighbour
      for (let j = 0; j < nodes.length; j++) {
        if (sourceIdx === j) continue;
        const target = nodes[j];
        const dist = Math.hypot(source.x - target.x, source.y - target.y);
        if (dist < maxConnectionDist && Math.random() < 0.25) {
          packets.push(new DataPacket(source, target));
          break;
        }
      }
    }

    let lastPacketTime = 0;

    function animate(currentTime) {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      const isLight = htmlRoot.getAttribute('data-theme') === 'light';
      const nodeColor = isLight ? 'rgba(2, 132, 199, 0.65)' : 'rgba(56, 189, 248, 0.75)';
      const lineColorBase = isLight ? '2, 132, 199' : '14, 165, 233';
      const packetColor = isLight ? '#0284c7' : '#38bdf8';

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update();
        nodes[i].draw(nodeColor);

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDist) {
            const alpha = (1 - dist / maxConnectionDist) * (isLight ? 0.22 : 0.28);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${lineColorBase}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Periodically spawn packet
      if (currentTime - lastPacketTime > 600) {
        spawnPacket();
        lastPacketTime = currentTime;
      }

      // Update and draw packets
      for (let p = packets.length - 1; p >= 0; p--) {
        packets[p].update();
        if (packets[p].progress >= 1) {
          packets.splice(p, 1);
        } else {
          packets[p].draw(packetColor);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    // Responsive Canvas Resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initNetwork();
      }, 150);
    }, { passive: true });

    // Pause animation when hero is off-screen
    const heroSection = document.getElementById('hero');
    if ('IntersectionObserver' in window && heroSection) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!isVisible) {
              isVisible = true;
              animationFrameId = requestAnimationFrame(animate);
            }
          } else {
            isVisible = false;
            cancelAnimationFrame(animationFrameId);
          }
        });
      }, { threshold: 0 });
      heroObserver.observe(heroSection);
    }

    initNetwork();
    animationFrameId = requestAnimationFrame(animate);
  }

  /* =========================================================================
     6. PROJECT DETAILS MODAL ("Available Upon Request")
     ========================================================================= */
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalBody = document.getElementById('modal-body');
  const modalEmailBtn = document.getElementById('modal-email-btn');
  const modalTriggerBtns = document.querySelectorAll('.modal-trigger-btn');

  const projectData = {
    cisco: {
      title: 'Cisco Networking Labs',
      subtitle: 'Packet Tracer Topology Files (.pkt) & Documentation',
      content: `
        <p style="margin-bottom: 12px;">
          This portfolio project includes complete simulation files created in <strong>Cisco Packet Tracer</strong>. It highlights practical implementations of:
        </p>
        <ul style="list-style: disc; margin-left: 20px; margin-bottom: 16px; color: var(--text-secondary); line-height: 1.8;">
          <li>Multi-router interconnections with static routing &amp; default gateways</li>
          <li>VLAN creation, access/trunk port assignments &amp; Inter-VLAN routing (Router-on-a-Stick)</li>
          <li>DHCP pool configuration and IP helper addresses</li>
          <li>Standard and Extended Access Control Lists (ACLs) for traffic filtering</li>
          <li>Network Address Translation (NAT/PAT) for private-to-public mapping</li>
          <li>Cisco IOS command line diagnostics and end-to-end ping troubleshooting</li>
        </ul>
        <p style="font-size: 0.875rem; color: var(--text-muted);">
          Because these files consist of proprietary Packet Tracer labs (.pkt) and network topology schematics, they are provided directly upon request to recruiters, managers, or peers.
        </p>
      `,
      emailSubject: 'Request for Cisco Packet Tracer Lab Files - Mohamed Sanad Portfolio'
    },
    cpp: {
      title: 'C++ Mini Projects',
      subtitle: 'Academic Console Applications & Problem Solving',
      content: `
        <p style="margin-bottom: 12px;">
          A suite of console applications engineered in <strong>C++</strong> during undergraduate studies at Benha University, focusing on core programming mechanics and algorithmic thinking:
        </p>
        <ul style="list-style: disc; margin-left: 20px; margin-bottom: 16px; color: var(--text-secondary); line-height: 1.8;">
          <li><strong>Calculator:</strong> Arithmetic processing, operator precedence, and robust input validation.</li>
          <li><strong>Student Management System:</strong> Dynamic records, searching, sorting, and grade computation.</li>
          <li><strong>Bank Management System:</strong> Account creation, balance updates, transaction simulation, and data persistence.</li>
          <li><strong>Library Management System:</strong> Book indexing, check-out/check-in records, and inventory lookups.</li>
          <li><strong>Simple Game:</strong> Interactive terminal-based game logic and state loops.</li>
        </ul>
        <p style="font-size: 0.875rem; color: var(--text-muted);">
          Source code files (.cpp / Visual Studio solutions) are available upon direct request.
        </p>
      `,
      emailSubject: 'Request for C++ Mini Projects Code - Mohamed Sanad Portfolio'
    },
    python: {
      title: 'Python Mini Projects',
      subtitle: 'Scripting, Data Management & Logic Applications',
      content: `
        <p style="margin-bottom: 12px;">
          A collection of functional Python scripts developed to master scripting, modular logic, and data structures:
        </p>
        <ul style="list-style: disc; margin-left: 20px; margin-bottom: 16px; color: var(--text-secondary); line-height: 1.8;">
          <li><strong>Calculator:</strong> Clean functions for operations, math evaluation, and error handling.</li>
          <li><strong>Student / Grades Management System:</strong> Record management, grade point calculations, and structured output.</li>
          <li><strong>Login / Registration System:</strong> User credentials validation, hashing logic concepts, and persistent file records.</li>
        </ul>
        <p style="font-size: 0.875rem; color: var(--text-muted);">
          Source code scripts (.py) and project documentation are readily available upon request.
        </p>
      `,
      emailSubject: 'Request for Python Mini Projects Code - Mohamed Sanad Portfolio'
    }
  };

  modalTriggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = btn.getAttribute('data-project');
      const data = projectData[projKey];

      if (data && projectModal) {
        modalTitle.textContent = data.title;
        modalSubtitle.textContent = data.subtitle;
        modalBody.innerHTML = data.content;
        modalEmailBtn.setAttribute('href', `mailto:Mohamedsanediphon@gmail.com?subject=${encodeURIComponent(data.emailSubject)}`);

        openModal();
      }
    });
  });

  function openModal() {
    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalCloseBtn.focus();
  }

  function closeModal() {
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
      closeModal();
    }
  });

  /* =========================================================================
     7. CLIPBOARD COPY UTILITY WITH TOAST NOTIFICATION
     ========================================================================= */
  const copyButtons = document.querySelectorAll('.copy-btn');
  const toastNotice = document.getElementById('toast-notice');
  const toastText = document.getElementById('toast-text');
  let toastTimer;

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-clipboard');
      if (!textToCopy) return;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy)
          .then(() => showToast(`Copied "${textToCopy}" to clipboard!`))
          .catch(() => fallbackCopy(textToCopy));
      } else {
        fallbackCopy(textToCopy);
      }
    });
  });

  function fallbackCopy(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.left = '-9999px';
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(`Copied "${text}" to clipboard!`);
    } catch (err) {
      showToast('Could not copy automatically. Please copy manually.');
    }
    document.body.removeChild(tempInput);
  }

  function showToast(message) {
    if (!toastNotice || !toastText) return;
    toastText.textContent = message;
    toastNotice.classList.add('visible');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotice.classList.remove('visible');
    }, 2800);
  }

  /* =========================================================================
     8. CONTACT FORM HANDLING (Client-Side Validation & Feedback)
     ========================================================================= */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      // Basic validation
      if (!nameVal || !emailVal || !messageVal) {
        displayFormStatus('Please complete all required fields.', 'error');
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        displayFormStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate sending state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; width: 18px; height: 18px;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        <span>Processing Message...</span>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        contactForm.reset();

        displayFormStatus(
          `Thank you, ${nameVal}! Your message has been prepared. You can also reach Mohamed directly at Mohamedsanediphon@gmail.com.`,
          'success'
        );
      }, 750);
    });
  }

  function displayFormStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* =========================================================================
     9. BACK TO TOP BUTTON
     ========================================================================= */
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* =========================================================================
     10. SMOOTH SCROLL FOR ALL ANCHOR LINKS
     ========================================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Set focus to target for accessibility
        targetEl.setAttribute('tabindex', '-1');
        targetEl.focus({ preventScroll: true });
      }
    });
  });

});
