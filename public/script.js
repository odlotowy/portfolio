document.addEventListener("DOMContentLoaded", function () {
  // Theme toggle functionality
  const themeToggle = document.getElementById("themeToggle");
  const html = document.documentElement;
  const icon = themeToggle.querySelector("i");
  const typingText = document.getElementById("typingEffect");

  const texts = [
    "FullStack Developer",
    "Backend Developer",
    "Web Developer",
    "Discord Bot Developer",
    "Roblox Luau Developer",
    "Python Developer",
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentText = texts[textIndex];

    if (!isDeleting) {
      typingText.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentText.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
        return;
      }
    } else {
      typingText.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
      }
    }

    setTimeout(typeEffect, isDeleting ? 50 : 100);
  }

  typeEffect();

  const contactForm = document.getElementById("contactForm");
  const submitButton = document.getElementById("submitButton");
  const formMessage = document.getElementById("formMessage");

  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const originalButtonContent = submitButton.innerHTML;

    // Loading state
    submitButton.disabled = true;
    submitButton.classList.add("opacity-70", "cursor-not-allowed");
    submitButton.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i>
    Sending...`;

    // Hide previous message
    formMessage.classList.add("hidden", "opacity-0", "translate-y-2");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        // Clear form
        contactForm.reset();

        // Success message
        formMessage.textContent = "Message sent successfully!";
        formMessage.className =
          "rounded-lg px-4 py-3 text-sm bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 opacity-0 translate-y-2 transition-all duration-300";

        // Animate message in
        requestAnimationFrame(() => {
          formMessage.classList.remove("opacity-0", "translate-y-2");
        });

        // Restore button
        submitButton.innerHTML = ` <i class="fa-solid fa-check mr-2"></i> Message Sent `;

        // Hide message after 5 seconds
        setTimeout(() => {
          formMessage.classList.add("opacity-0", "translate-y-2");
          setTimeout(() => {
            formMessage.classList.add("hidden");
          }, 300);
        }, 5000);

        // Restore button after 3 seconds
        setTimeout(() => {
          submitButton.innerHTML = originalButtonContent;
          submitButton.disabled = false;
          submitButton.classList.remove("opacity-70", "cursor-not-allowed");
        }, 3000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      // Error message
      formMessage.textContent = "Something went wrong. Please try again later.";

      formMessage.className =
        "rounded-lg px-4 py-3 text-sm bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 opacity-0 translate-y-2 transition-all duration-300";

      requestAnimationFrame(() => {
        formMessage.classList.remove("opacity-0", "translate-y-2");
      });

      // Restore button
      submitButton.innerHTML = originalButtonContent;
      submitButton.disabled = false;
      submitButton.classList.remove("opacity-70", "cursor-not-allowed");
    }
  });

  // Check for saved theme preference or prefer-color-scheme
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Apply theme based on saved preference or system preference
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    html.classList.add("dark");
    icon.classList.replace("fa-moon", "fa-sun");
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute("content", "#000000");
  }

  // Toggle theme when button is clicked
  themeToggle.addEventListener("click", function () {
    html.classList.toggle("dark");

    icon.classList.add("rotate-180");

    setTimeout(() => {
      if (html.classList.contains("dark")) {
        icon.classList.replace("fa-moon", "fa-sun");
        localStorage.setItem("theme", "dark");

        document
          .querySelector('meta[name="theme-color"]')
          .setAttribute("content", "#000000");
      } else {
        icon.classList.replace("fa-sun", "fa-moon");
        localStorage.setItem("theme", "light");

        document
          .querySelector('meta[name="theme-color"]')
          .setAttribute("content", "#0070f3");
      }

      icon.classList.remove("rotate-180");
    }, 150);
  });

  // Mobile navigation toggle
  const menuToggle = document.getElementById("menuToggle");
  const closeMenu = document.getElementById("closeMenu");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuToggle && closeMenu && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      mobileMenu.classList.remove("translate-x-full");
      document.body.classList.add("overflow-hidden");
    });

    closeMenu.addEventListener("click", function () {
      mobileMenu.classList.add("translate-x-full");
      document.body.classList.remove("overflow-hidden");
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", function () {
        mobileMenu.classList.add("translate-x-full");
        document.body.classList.remove("overflow-hidden");
      });
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Add scroll events for header shadow and reveal animations
  const header = document.querySelector("header");
  const sections = document.querySelectorAll("section");

  function checkScroll() {
    // Header shadow
    if (window.scrollY > 0) {
      header.classList.add("shadow-md");
    } else {
      header.classList.remove("shadow-md");
    }

    // Reveal animations for sections
    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (sectionTop < windowHeight * 0.85) {
        section.classList.add("opacity-100", "translate-y-0");
        section.classList.remove("opacity-0", "translate-y-4");
      }
    });
  }

  window.addEventListener("scroll", checkScroll);
  // Run on page load
  checkScroll();

  // Add intersection observer for animations
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("opacity-100", "translate-y-0");
        entry.target.classList.remove("opacity-0", "translate-y-4");
        // Stop observing once the animation is triggered
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Terminal animation
  const terminalContainer = document.getElementById("terminal-container");
  const terminalContent = document.querySelector(".terminal-content");
  const commandSpan = document.querySelector(".command-text");

  if (terminalContainer && terminalContent && commandSpan) {
    const commandText =
      "git clone https://github.com/odlotowy/My-Portfolio.git";

    let i = 0;
    const typeCommand = () => {
      if (i < commandText.length) {
        commandSpan.textContent += commandText.charAt(i);
        i++;
        setTimeout(typeCommand, 50);
      } else {
        // Add blinking cursor after typing
        const cursor = document.createElement("span");
        cursor.className =
          "inline-block w-2 h-5 bg-gray-900 dark:bg-white ml-1 animate-blink align-middle";
        terminalContent.appendChild(cursor);
      }
    };

    // Start typing after a delay
    setTimeout(typeCommand, 1000);
  } else {
    // Fallback for original terminal structure
    const terminal = document.querySelector(".terminal-body");
    if (terminal) {
      const commandText = terminal.querySelector(".command").textContent;
      terminal.querySelector(".command").textContent = "";

      let i = 0;
      const typeCommand = () => {
        if (i < commandText.length) {
          terminal.querySelector(".command").textContent +=
            commandText.charAt(i);
          i++;
          setTimeout(typeCommand, 50);
        } else {
          // Add blinking cursor after typing
          terminal
            .querySelector(".command")
            .insertAdjacentHTML(
              "afterend",
              '<span class="animate-blink">_</span>',
            );
        }
      };

      // Start typing after a delay
      setTimeout(typeCommand, 0);
    }
  }
});
