document.addEventListener('DOMContentLoaded', () => {
  
  // --- BUS FLEET FILTERS ---
  const searchFleetInput = document.getElementById('searchFleet');
  const filterFleetSelect = document.getElementById('filterFleetType');
  const fleetCards = document.querySelectorAll('.fleet-card-item');

  if (fleetCards.length > 0) {
    const filterFleet = () => {
      const query = searchFleetInput ? searchFleetInput.value.toLowerCase().trim() : '';
      const filterType = filterFleetSelect ? filterFleetSelect.value : 'all';

      fleetCards.forEach(card => {
        const title = card.querySelector('.card-title').innerText.toLowerCase();
        const type = card.getAttribute('data-bus-type'); // sleeper, volvo, scania, mini, traveller, seater
        
        const matchesSearch = title.includes(query);
        const matchesCategory = filterType === 'all' || type === filterType;

        if (matchesSearch && matchesCategory) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    };

    if (searchFleetInput) searchFleetInput.addEventListener('input', filterFleet);
    if (filterFleetSelect) filterFleetSelect.addEventListener('change', filterFleet);
  }

  // --- TOUR PACKAGES FILTERS ---
  const searchPackageInput = document.getElementById('searchPackage');
  const filterPackageSelect = document.getElementById('filterPackageCategory');
  const sortPriceSelect = document.getElementById('sortPrice');
  const packageContainer = document.getElementById('packagesContainer');
  const packageCards = document.querySelectorAll('.package-card-item');

  if (packageCards.length > 0) {
    const filterPackages = () => {
      const query = searchPackageInput ? searchPackageInput.value.toLowerCase().trim() : '';
      const filterCategory = filterPackageSelect ? filterPackageSelect.value : 'all';

      packageCards.forEach(card => {
        const title = card.querySelector('.card-title').innerText.toLowerCase();
        const text = card.querySelector('.card-text').innerText.toLowerCase();
        const category = card.getAttribute('data-package-category'); // adventure, pilgrimage, beach, family, weekend

        const matchesSearch = title.includes(query) || text.includes(query);
        const matchesCategory = filterCategory === 'all' || category === filterCategory;

        if (matchesSearch && matchesCategory) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    };

    // Sort function
    const sortPackages = () => {
      if (!sortPriceSelect || !packageContainer) return;
      const sortBy = sortPriceSelect.value;
      const cardsArr = Array.from(packageCards);

      if (sortBy === 'low-to-high') {
        cardsArr.sort((a, b) => {
          return parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price'));
        });
      } else if (sortBy === 'high-to-low') {
        cardsArr.sort((a, b) => {
          return parseInt(b.getAttribute('data-price')) - parseInt(a.getAttribute('data-price'));
        });
      } else {
        // Default sort (original order)
        cardsArr.sort((a, b) => {
          return parseInt(a.getAttribute('data-id')) - parseInt(b.getAttribute('data-id'));
        });
      }

      // Re-append sorted cards
      cardsArr.forEach(card => {
        packageContainer.appendChild(card);
      });
    };

    if (searchPackageInput) searchPackageInput.addEventListener('input', filterPackages);
    if (filterPackageSelect) filterPackageSelect.addEventListener('change', filterPackages);
    if (sortPriceSelect) sortPriceSelect.addEventListener('change', sortPackages);
  }
});
