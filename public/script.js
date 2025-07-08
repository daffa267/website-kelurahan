document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-in-out',
    offset: 100
  });

  // Mobile menu toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  mobileMenuButton.addEventListener('click', function() {
    mobileMenu.classList.toggle('hidden');
  });

  // Back to top button
  const backToTopButton = document.getElementById('back-to-top');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTopButton.classList.remove('opacity-0', 'invisible');
      backToTopButton.classList.add('opacity-100', 'visible');
    } else {
      backToTopButton.classList.remove('opacity-100', 'visible');
      backToTopButton.classList.add('opacity-0', 'invisible');
    }
  });

  backToTopButton.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Initialize map
  const map = L.map('mapid').setView([0.9187, 104.4547], 15);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  // Marker for office location
  L.marker([0.9187, 104.4547])
    .addTo(map)
    .bindPopup('Kantor Kelurahan Tanjungpinang Kota')
    .openPopup();

  // Initialize chart
  const ctx = document.getElementById('population-chart').getContext('2d');
  const populationChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['2020', '2021', '2022', 'Semester 1 - 2023'],
      datasets: [{
        label: 'Jumlah Penduduk',
        data: [5200, 5100, 5000, 4950],
        borderColor: '#2989d8',
        backgroundColor: 'rgba(41, 137, 216, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#2989d8',
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return 'Jumlah Penduduk: ' + context.parsed.y.toLocaleString();
            }
          }
        }
      },
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
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });

  // Custom cursor effect
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', function(e) {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(1.1)`;
  });

  document.addEventListener('mousedown', function() {
    cursor.style.transform += ' scale(0.8)';
  });

  document.addEventListener('mouseup', function() {
    cursor.style.transform = cursor.style.transform.replace(' scale(0.8)', '');
  });

  // Add hover effect to all links
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('mouseenter', function() {
      cursor.style.transform += ' scale(1.5)';
      cursor.style.backgroundColor = 'rgba(41,137,216,0.5)';
    });
    link.addEventListener('mouseleave', function() {
      cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
      cursor.style.backgroundColor = 'rgba(41,137,216,0.25)';
    });
  });

  // Add hover effect to buttons
  const buttons = document.querySelectorAll('button, .btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      cursor.style.transform += ' scale(1.3)';
      cursor.style.backgroundColor = 'rgba(41,137,216,0.7)';
    });
    button.addEventListener('mouseleave', function() {
      cursor.style.transform = cursor.style.transform.replace(' scale(1.3)', '');
      cursor.style.backgroundColor = 'rgba(41,137,216,0.25)';
    });
  });
});