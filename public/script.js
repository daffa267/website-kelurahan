document.addEventListener("DOMContentLoaded", function() {
    // Inisialisasi Chart Penduduk (line chart)
    const canvas = document.getElementById("population-chart");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        new Chart(ctx, {
            type: "line",
            data: {
                labels: ["2020", "2021", "2022", "Semester 1 - 2023"],
                datasets: [{
                    label: "Jumlah Penduduk",
                    data: [5188, 5086, 4939, 4902],
                    borderColor: "#2989d8",
                    backgroundColor: "rgba(41, 137, 216, 0.1)",
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    pointBackgroundColor: "#2989d8",
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    clip: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 4900,
                        max: 5250,
                        ticks: {
                            stepSize: 50,
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        },
                        grid: {
                            color: "rgba(0, 0, 0, 0.05)",
                        }
                    },
                    x: {
                        grid: {
                            display: true,
                            color: "rgba(0, 0, 0, 0.05)",
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return "Jumlah Penduduk: " + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // Mobile menu toggle
    document.getElementById('mobile-menu-btn').addEventListener('click', function() {
        const mobileMenu = document.getElementById('mobile-menu');
        const icon = this.querySelector('i');
        
        mobileMenu.classList.toggle('hidden');
        
        if (mobileMenu.classList.contains('hidden')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    });

    // Desktop News Carousel - With Manual Navigation and Autoplay
    const desktopNewsWrapper = document.getElementById('desktop-news-wrapper');
    if (desktopNewsWrapper) {
        const container = document.getElementById('desktop-news-container');
        const prevBtn = document.getElementById('desktop-prev-slide');
        const nextBtn = document.getElementById('desktop-next-slide');
        
        const originalItems = Array.from(container.children);
        const totalOriginalItems = originalItems.length;
        const itemsPerView = 2; // Number of items visible at once

        if (totalOriginalItems <= itemsPerView) {
            // Not enough items to make a carousel, hide arrows
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            // Clone items for the infinite loop effect
            // Clone last `itemsPerView` items to the beginning
            for (let i = 0; i < itemsPerView; i++) {
                container.insertBefore(originalItems[totalOriginalItems - 1 - i].cloneNode(true), container.firstChild);
            }
            // Clone first `itemsPerView` items to the end
            for (let i = 0; i < itemsPerView; i++) {
                container.appendChild(originalItems[i].cloneNode(true));
            }

            let currentIndex = itemsPerView; // Start at the first real item
            let isTransitioning = false;
            let autoPlayInterval;

            const updateCarouselPosition = (withTransition = true) => {
                const itemWidth = container.children[0].offsetWidth;
                const gap = 16; // Corresponds to `gap-4` in Tailwind (1rem = 16px)
                const moveDistance = currentIndex * (itemWidth + gap);
                
                container.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
                container.style.transform = `translateX(-${moveDistance}px)`;
            };

            const moveTo = (newIndex) => {
                if (isTransitioning) return;
                isTransitioning = true;
                currentIndex = newIndex;
                updateCarouselPosition();
            };

            const handleTransitionEnd = () => {
                isTransitioning = false;
                // If we are at the first set of clones (at the end)
                if (currentIndex >= totalOriginalItems + itemsPerView) {
                    currentIndex = currentIndex - totalOriginalItems;
                    updateCarouselPosition(false);
                }
                // If we are at the last set of clones (at the beginning)
                if (currentIndex < itemsPerView) {
                    currentIndex = currentIndex + totalOriginalItems;
                    updateCarouselPosition(false);
                }
            };

            const stopAutoPlay = () => clearInterval(autoPlayInterval);
            const startAutoPlay = () => {
                stopAutoPlay();
                autoPlayInterval = setInterval(() => {
                    moveTo(currentIndex + 1);
                }, 5000); // Autoplay every 5 seconds
            };

            container.addEventListener('transitionend', handleTransitionEnd);

            nextBtn.addEventListener('click', () => {
                moveTo(currentIndex + 1);
                startAutoPlay(); // Reset timer on manual click
            });

            prevBtn.addEventListener('click', () => {
                moveTo(currentIndex - 1);
                startAutoPlay(); // Reset timer on manual click
            });

            desktopNewsWrapper.addEventListener('mouseenter', stopAutoPlay);
            desktopNewsWrapper.addEventListener('mouseleave', startAutoPlay);

            // Initial setup
            updateCarouselPosition(false);
            startAutoPlay();
        }
    }

    // Main News Carousel on news.html - Fade Transition Version
    const mainNewsCarousel = document.getElementById('main-news-carousel');
    if (mainNewsCarousel) {
        const slides = Array.from(document.querySelectorAll('#main-news-slides > article'));
        const navContainer = document.getElementById('main-news-nav');
        const totalSlides = slides.length;

        if (totalSlides > 1) {
            let currentIndex = 0;
            let autoPlayInterval;

            // 1. Create navigation dots
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.dataset.slideTo = i;
                dot.textContent = i + 1;
                dot.className = 'w-6 h-6 text-xs font-bold rounded-md transition-colors duration-300';
                navContainer.appendChild(dot);
            }
            const navDots = Array.from(navContainer.children);

            // 2. Function to show a specific slide by toggling opacity
            function showSlide(index) {
                // Hide all slides
                slides.forEach((slide) => {
                    slide.classList.remove('opacity-100');
                    slide.classList.add('opacity-0');
                    slide.classList.add('pointer-events-none');
                });

                // Show the target slide
                slides[index].classList.remove('opacity-0');
                slides[index].classList.add('opacity-100');
                slides[index].classList.remove('pointer-events-none');

                // Update navigation dots
                navDots.forEach((dot, i) => {
                    dot.classList.toggle('bg-white', i === index);
                    dot.classList.toggle('text-black', i === index);
                    dot.classList.toggle('bg-white/30', i !== index);
                    dot.classList.toggle('text-white', i !== index);
                });

                currentIndex = index;
            }

            // 3. Autoplay functionality
            const startAutoPlay = () => {
                stopAutoPlay(); // Clear existing interval
                autoPlayInterval = setInterval(() => {
                    const nextIndex = (currentIndex + 1) % totalSlides;
                    showSlide(nextIndex);
                }, 5000);
            };
            const stopAutoPlay = () => clearInterval(autoPlayInterval);

            // 4. Event listeners
            navDots.forEach(dot => {
                dot.addEventListener('click', () => {
                    showSlide(parseInt(dot.dataset.slideTo));
                    startAutoPlay(); // Restart timer on manual navigation
                });
            });

            mainNewsCarousel.addEventListener('mouseenter', stopAutoPlay);
            mainNewsCarousel.addEventListener('mouseleave', startAutoPlay);

            // 5. Initialize
            showSlide(0);
            startAutoPlay();
        }
    }

    // Mobile News Carousel
    const mobileCarousel = document.getElementById('mobile-news-carousel');
    if (mobileCarousel) {
        const slides = Array.from(mobileCarousel.children);
        const dots = document.querySelectorAll('#mobile-news-carousel + div button[data-slide]');
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');
        
        // Hitung jumlah slide asli (tanpa clone)
        const realSlideCount = slides.length - 2; // Karena ada 2 clone (awal dan akhir)
        let currentIndex = 1; // Mulai dari slide pertama yang asli
        let autoPlayInterval;
        let isDragging = false;
        let startPos = 0;
        
        // Inisialisasi posisi awal (slide pertama yang asli)
        mobileCarousel.style.scrollBehavior = 'unset';
        mobileCarousel.scrollLeft = mobileCarousel.offsetWidth;
        
        // Geser ke slide tertentu dengan handling loop
        function goToSlide(index) {
            currentIndex = index;
            
            // Update dot navigasi (hanya untuk slide asli)
            const dotIndex = (index - 1 + realSlideCount) % realSlideCount;
            dots.forEach((dot, i) => {
                dot.classList.toggle('opacity-100', i === dotIndex);
                dot.classList.toggle('opacity-30', i !== dotIndex);
            });
            
            // Scroll ke posisi yang sesuai
            mobileCarousel.style.scrollBehavior = 'smooth';
            mobileCarousel.scrollLeft = index * mobileCarousel.offsetWidth;
        }
        
        // Geser ke slide berikutnya dengan handling loop
        function nextSlide() {
            const nextIndex = currentIndex + 1;
            goToSlide(nextIndex);
            
            // Jika mencapai clone terakhir, langsung loncat ke slide asli pertama tanpa animasi
            if (nextIndex === slides.length - 1) {
                setTimeout(() => {
                    mobileCarousel.style.scrollBehavior = 'unset';
                    currentIndex = 1;
                    mobileCarousel.scrollLeft = currentIndex * mobileCarousel.offsetWidth;
                }, 500);
            }
        }
        
        // Geser ke slide sebelumnya dengan handling loop
        function prevSlide() {
            const prevIndex = currentIndex - 1;
            goToSlide(prevIndex);
            
            // Jika mencapai clone pertama, langsung loncat ke slide asli terakhir tanpa animasi
            if (prevIndex === 0) {
                setTimeout(() => {
                    mobileCarousel.style.scrollBehavior = 'unset';
                    currentIndex = slides.length - 2;
                    mobileCarousel.scrollLeft = currentIndex * mobileCarousel.offsetWidth;
                }, 500);
            }
        }
        
        // Auto play
        function startAutoPlay() {
            stopAutoPlay();
            autoPlayInterval = setInterval(nextSlide, 5000);
        }
        
        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }
        
        // Handle event saat scroll selesai
        mobileCarousel.addEventListener('scrollend', () => {
            // Jika di clone pertama (index 0), loncat ke slide asli terakhir
            if (Math.round(mobileCarousel.scrollLeft / mobileCarousel.offsetWidth) === 0) {
                currentIndex = slides.length - 2;
                mobileCarousel.style.scrollBehavior = 'unset';
                mobileCarousel.scrollLeft = currentIndex * mobileCarousel.offsetWidth;
            }
            // Jika di clone terakhir (index slides.length-1), loncat ke slide asli pertama
            else if (Math.round(mobileCarousel.scrollLeft / mobileCarousel.offsetWidth) === slides.length - 1) {
                currentIndex = 1;
                mobileCarousel.style.scrollBehavior = 'unset';
                mobileCarousel.scrollLeft = currentIndex * mobileCarousel.offsetWidth;
            }
        });
        
        // Event listeners untuk tombol
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoPlay();
        });
        
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoPlay();
        });
        
        // Event listeners untuk dot navigasi
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                goToSlide(i + 1); // +1 karena index 0 adalah clone
                startAutoPlay();
            });
        });
        
        // Deteksi swipe untuk touch devices
        mobileCarousel.addEventListener('touchstart', (e) => {
            isDragging = true;
            startPos = e.touches[0].clientX;
            stopAutoPlay();
        });
        
        mobileCarousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const currentPosition = e.touches[0].clientX;
            const diff = currentPosition - startPos;
            
            // Geser sementara selama drag
            mobileCarousel.style.scrollBehavior = 'unset';
            mobileCarousel.scrollLeft = (currentIndex * mobileCarousel.offsetWidth) - diff;
        });
        
        mobileCarousel.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const endPos = e.changedTouches[0].clientX;
            const diff = endPos - startPos;
            
            // Jika swipe cukup besar, geser ke slide berikutnya/sebelumnya
            if (diff < -50) nextSlide();
            else if (diff > 50) prevSlide();
            else goToSlide(currentIndex); // Kembali ke slide saat ini jika swipe kecil
            
            startAutoPlay();
        });
        
        // Inisialisasi
        startAutoPlay();
    }

    // Click effect for navigation links
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', function(e) {
            // Add a visual feedback effect on click
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Album Gallery Carousel on gallery.html
    const albumCarousel = document.getElementById('album-gallery-carousel');
    if (albumCarousel) {
        const slides = Array.from(document.querySelectorAll('#album-gallery-slides > article'));
        const prevBtn = document.getElementById('album-prev-slide');
        const nextBtn = document.getElementById('album-next-slide');
        const indicatorsContainer = document.getElementById('album-gallery-indicators');
        const totalSlides = slides.length;
        let currentIndex = 0;
        let autoPlayInterval;

        if (totalSlides > 1) {
            // 1. Create indicators
            for (let i = 0; i < totalSlides; i++) {
                const indicator = document.createElement('button');
                indicator.dataset.slideTo = i;
                indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
                indicator.className = 'w-8 h-1 bg-white/50 rounded-full transition-colors duration-300';
                indicatorsContainer.appendChild(indicator);
            }
            const indicators = Array.from(indicatorsContainer.children);

            // 2. Function to show a slide
            function showSlide(index) {
                // Loop around
                currentIndex = (index + totalSlides) % totalSlides;

                slides.forEach((slide, i) => {
                    slide.classList.toggle('opacity-100', i === currentIndex);
                    slide.classList.toggle('opacity-0', i !== currentIndex);
                });

                indicators.forEach((indicator, i) => {
                    indicator.classList.toggle('bg-white', i === currentIndex);
                    indicator.classList.toggle('bg-white/50', i !== currentIndex);
                });
            }

            // 3. Autoplay
            const startAutoPlay = () => {
                stopAutoPlay();
                autoPlayInterval = setInterval(() => {
                    showSlide(currentIndex + 1);
                }, 5000); // Change slide every 5 seconds
            };
            const stopAutoPlay = () => clearInterval(autoPlayInterval);

            // 4. Event Listeners
            prevBtn.addEventListener('click', () => { showSlide(currentIndex - 1); startAutoPlay(); });
            nextBtn.addEventListener('click', () => { showSlide(currentIndex + 1); startAutoPlay(); });
            indicators.forEach(indicator => {
                indicator.addEventListener('click', (e) => { showSlide(parseInt(e.target.dataset.slideTo)); startAutoPlay(); });
            });
            albumCarousel.addEventListener('mouseenter', stopAutoPlay);
            albumCarousel.addEventListener('mouseleave', startAutoPlay);

            // 5. Initialize
            showSlide(0);
            startAutoPlay();
        }
    }
});