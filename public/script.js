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

    // News Carousel Functionality - Corrected Infinite Loop Version
    const newsWrapper = document.querySelector('.p-4.overflow-x-hidden');
    const newsContainer = newsWrapper?.querySelector('.flex.flex-col.md\\:flex-row.gap-4');

    if (newsContainer && newsContainer.children.length > 0) {
        const originalItems = Array.from(newsContainer.children);
        const totalOriginalItems = originalItems.length;
        let isPaused = false;
        let carouselInterval;

        // 1. Clone semua item asli dan tambahkan ke akhir container.
        // Ini menciptakan strip [1, 2, 3, 1(klon), 2(klon), 3(klon)] untuk loop yang mulus.
        originalItems.forEach(item => {
            newsContainer.appendChild(item.cloneNode(true));
        });

        let currentIndex = 0;

        function slideNews() {
            if (isPaused) return;

            currentIndex++;
            
            // Ambil lebar item secara dinamis untuk menangani perubahan ukuran window.
            const itemWidth = originalItems[0].offsetWidth + 16; // 16px dari `gap-4` di Tailwind

            newsContainer.style.transition = 'transform 0.5s ease-in-out';
            newsContainer.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        }

        // 2. Fungsi ini menangani "keajaiban" dari loop yang mulus.
        function handleTransitionEnd() {
            // Saat transisi selesai, cek apakah kita sudah berada di klon pertama.
            if (currentIndex >= totalOriginalItems) {
                // Jika ya, lompat kembali ke awal secara diam-diam (tanpa animasi).
                newsContainer.style.transition = 'none';
                currentIndex = 0;
                newsContainer.style.transform = 'translateX(0)';

                // Trik untuk mengaktifkan kembali transisi setelah browser menerapkan transform tanpa transisi.
                // Ini untuk mencegah kedipan (flicker).
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        newsContainer.style.transition = 'transform 0.5s ease-in-out';
                    });
                });
            }
        }

        function startCarousel() {
            clearInterval(carouselInterval); // Hapus interval sebelumnya
            carouselInterval = setInterval(slideNews, 3000);
        }

        // 3. Dengarkan event 'transitionend' untuk mereset posisi carousel.
        newsContainer.addEventListener('transitionend', handleTransitionEnd);

        // Pause saat kursor di atas
        newsWrapper.addEventListener('mouseenter', () => isPaused = true);

        // Lanjutkan saat kursor pergi
        newsWrapper.addEventListener('mouseleave', () => {
            isPaused = false;
            startCarousel();
        });

        // Mulai carousel
        startCarousel();
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
                });

                // Show the target slide
                slides[index].classList.remove('opacity-0');
                slides[index].classList.add('opacity-100');

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
});