// Unity Housing Website - Main JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // NAVIGATION & HAMBURGER MENU
  // ==========================================
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!e.target.closest("nav") && !e.target.closest(".hamburger")) {
      if (navMenu && navMenu.classList.contains("active")) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      }
    }
  });

  // ==========================================
  // ABOUT CAROUSEL - No arrows, slides 1 image at a time
  // ==========================================
  const aboutCarousel = document.querySelector(".about-carousel");
  const aboutCarouselSlides = document.getElementById("aboutCarouselSlides");
  const aboutSlides = aboutCarousel
    ? aboutCarousel.querySelectorAll(".carousel-slide")
    : [];

  if (aboutCarousel && aboutCarouselSlides && aboutSlides.length > 0) {
    let aboutCurrentIndex = 0;
    let aboutSlidesToShow = getAboutSlidesToShow();
    let aboutIsTransitioning = false;
    let aboutAutoAdvanceInterval;

    // Clone slides for infinite loop
    function setupAboutInfiniteLoop() {
      const existingClones = aboutCarouselSlides.querySelectorAll(".clone");
      existingClones.forEach((clone) => clone.remove());

      // Clone first set of slides and append to end
      for (let i = 0; i < aboutSlidesToShow; i++) {
        const clone = aboutSlides[i].cloneNode(true);
        clone.classList.add("clone");
        aboutCarouselSlides.appendChild(clone);
      }

      // Clone last set of slides and prepend to beginning
      for (
        let i = aboutSlides.length - aboutSlidesToShow;
        i < aboutSlides.length;
        i++
      ) {
        const clone = aboutSlides[i].cloneNode(true);
        clone.classList.add("clone");
        aboutCarouselSlides.insertBefore(clone, aboutCarouselSlides.firstChild);
      }

      aboutCurrentIndex = aboutSlidesToShow;
      updateAboutCarouselPosition(false);
    }

    // Determine how many slides to show
    function getAboutSlidesToShow() {
      if (window.innerWidth <= 460) {
        return 1;
      } else {
        return 5;
      }
    }

    // Update carousel position
    function updateAboutCarouselPosition(animate = true) {
      const slideWidth = 100 / aboutSlidesToShow;
      const offset = -aboutCurrentIndex * slideWidth;

      if (animate) {
        aboutCarouselSlides.style.transition = "transform 1s ease-in-out";
      } else {
        aboutCarouselSlides.style.transition = "none";
      }

      aboutCarouselSlides.style.transform = `translateX(${offset}%)`;
    }

    // Move to next slide
    function aboutNextSlide() {
      if (aboutIsTransitioning) return;

      aboutIsTransitioning = true;
      aboutCurrentIndex++;
      updateAboutCarouselPosition(true);

      setTimeout(() => {
        if (aboutCurrentIndex >= aboutSlides.length + aboutSlidesToShow) {
          aboutCurrentIndex = aboutSlidesToShow;
          updateAboutCarouselPosition(false);
        }
        aboutIsTransitioning = false;
      }, 1000);
    }

    // Handle window resize
    let aboutResizeTimeout;
    window.addEventListener("resize", function () {
      clearTimeout(aboutResizeTimeout);
      aboutResizeTimeout = setTimeout(() => {
        const newSlidesToShow = getAboutSlidesToShow();
        if (newSlidesToShow !== aboutSlidesToShow) {
          aboutSlidesToShow = newSlidesToShow;
          setupAboutInfiniteLoop();
        }
      }, 250);
    });

    // Initialize
    setupAboutInfiniteLoop();

    // Start auto-advance (NO arrows for about carousel)
    aboutAutoAdvanceInterval = setInterval(aboutNextSlide, 1000);
  }

  // ==========================================
  // PROJECTS CAROUSEL - Arrows, slides 1.5 images, pause on hover
  // ==========================================
  const projectsCarousel = document.querySelector(".projects-carousel");
  const projectsCarouselSlides = document.getElementById(
    "projectsCarouselSlides"
  );
  const projectsSlides = projectsCarousel
    ? projectsCarousel.querySelectorAll(".carousel-slide")
    : [];

  if (projectsCarousel && projectsCarouselSlides && projectsSlides.length > 0) {
    let projectsCurrentIndex = 0;
    let projectsSlidesToShow = getProjectsSlidesToShow();
    let projectsIsTransitioning = false;
    let projectsAutoAdvanceInterval;
    let projectsIsPaused = false;

    // Clone slides for infinite loop
    function setupProjectsInfiniteLoop() {
      const existingClones = projectsCarouselSlides.querySelectorAll(".clone");
      existingClones.forEach((clone) => clone.remove());

      // For 1.5 slides, we need more clones to make the loop smooth
      const cloneCount = Math.ceil(projectsSlidesToShow * 2);

      // Clone first set of slides and append to end
      for (let i = 0; i < cloneCount; i++) {
        const clone = projectsSlides[i % projectsSlides.length].cloneNode(true);
        clone.classList.add("clone");
        projectsCarouselSlides.appendChild(clone);
      }

      // Clone last set of slides and prepend to beginning
      for (
        let i = projectsSlides.length - cloneCount;
        i < projectsSlides.length;
        i++
      ) {
        const actualIndex = (i + projectsSlides.length) % projectsSlides.length;
        const clone = projectsSlides[actualIndex].cloneNode(true);
        clone.classList.add("clone");
        projectsCarouselSlides.insertBefore(
          clone,
          projectsCarouselSlides.firstChild
        );
      }

      projectsCurrentIndex = cloneCount;
      updateProjectsCarouselPosition(false);
    }

    // Determine how many slides to show
    function getProjectsSlidesToShow() {
      if (window.innerWidth <= 460) {
        return 1;
      } else {
        return 4; // Still show 4 on desktop, but will move by 1.5
      }
    }

    // Update carousel position
    function updateProjectsCarouselPosition(animate = true) {
      const slideWidth = 100 / projectsSlidesToShow;
      const offset = -projectsCurrentIndex * slideWidth;

      if (animate) {
        projectsCarouselSlides.style.transition = "transform 1s ease-in-out";
      } else {
        projectsCarouselSlides.style.transition = "none";
      }

      projectsCarouselSlides.style.transform = `translateX(${offset}%)`;
    }

    // Move by 1 slide on both desktop and mobile
    function projectsNextSlide() {
      if (projectsIsTransitioning || projectsIsPaused) return;

      projectsIsTransitioning = true;
      // Move by 1 slide
      projectsCurrentIndex += 1;
      updateProjectsCarouselPosition(true);

      setTimeout(() => {
        // Check if we've gone past the real slides
        if (
          projectsCurrentIndex >=
          projectsSlides.length + Math.ceil(projectsSlidesToShow * 2)
        ) {
          projectsCurrentIndex = Math.ceil(projectsSlidesToShow * 2);
          updateProjectsCarouselPosition(false);
        }
        projectsIsTransitioning = false;
      }, 1000);
    }

    function projectsPrevSlide() {
      if (projectsIsTransitioning || projectsIsPaused) return;

      projectsIsTransitioning = true;
      // Move by 1 slide
      projectsCurrentIndex -= 1;
      updateProjectsCarouselPosition(true);

      setTimeout(() => {
        if (projectsCurrentIndex < Math.ceil(projectsSlidesToShow * 2)) {
          projectsCurrentIndex = projectsSlides.length;
          updateProjectsCarouselPosition(false);
        }
        projectsIsTransitioning = false;
      }, 1000);
    }

    // Reset auto-advance interval
    function resetProjectsAutoAdvance() {
      clearInterval(projectsAutoAdvanceInterval);
      projectsAutoAdvanceInterval = setInterval(projectsNextSlide, 5000);
    }

    // Handle window resize
    let projectsResizeTimeout;
    window.addEventListener("resize", function () {
      clearTimeout(projectsResizeTimeout);
      projectsResizeTimeout = setTimeout(() => {
        const newSlidesToShow = getProjectsSlidesToShow();
        if (newSlidesToShow !== projectsSlidesToShow) {
          projectsSlidesToShow = newSlidesToShow;
          setupProjectsInfiniteLoop();
        }
      }, 250);
    });

    // Initialize
    setupProjectsInfiniteLoop();

    // Create navigation arrows
    const prevArrow = document.createElement("button");
    prevArrow.className = "carousel-arrow prev";
    prevArrow.innerHTML = "&#8249;";
    prevArrow.setAttribute("aria-label", "Previous slide");

    const nextArrow = document.createElement("button");
    nextArrow.className = "carousel-arrow next";
    nextArrow.innerHTML = "&#8250;";
    nextArrow.setAttribute("aria-label", "Next slide");

    projectsCarousel.appendChild(prevArrow);
    projectsCarousel.appendChild(nextArrow);

    // Arrow click handlers
    prevArrow.addEventListener("click", function () {
      projectsIsPaused = false; // Temporarily unpause
      projectsPrevSlide();
      resetProjectsAutoAdvance();
      projectsIsPaused = true; // Re-pause since we're still hovering
    });

    nextArrow.addEventListener("click", function () {
      projectsIsPaused = false; // Temporarily unpause
      projectsNextSlide();
      resetProjectsAutoAdvance();
      projectsIsPaused = true; // Re-pause since we're still hovering
    });

    // Pause on hover - for the entire carousel
    projectsCarousel.addEventListener("mouseenter", function () {
      projectsIsPaused = true;
      clearInterval(projectsAutoAdvanceInterval);
    });

    projectsCarousel.addEventListener("mouseleave", function () {
      projectsIsPaused = false;
      resetProjectsAutoAdvance();
    });

    // Start auto-advance
    projectsAutoAdvanceInterval = setInterval(projectsNextSlide, 5000);
  }
});
