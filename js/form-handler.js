// Configuration des lieux (Pays et Villes)
const locations = {
    benin: [
        "Cotonou", "Porto-Novo", "Abomey-Calavi", "Ouidah", "Sèmè-Kpodji", "Allada", "Akpro-Missérété", "Avrankou", "Adjarra", "Bonou", "Dangbo", "Aguégués", "Toffo", "Zè", "Tori-Bossito", "Kpomassé", "Athiémé", "Grand-Popo", "Comè", "Houéyogbé", "Lokossa", "Bopa", "Possotomé",
        "Abomey", "Bohicon", "Dassa-Zoumé", "Savalou", "Savé", "Glazoué", "Bantè", "Ouèssè", "Agbangnizoun", "Djidja", "Zogbodomey", "Za-Kpota", "Zagnanado", "Covè", "Ouinhi", "Kétou", "Pobè", "Sakété", "Adja-Ouèrè", "Itou-Takite",
        "Parakou", "Djougou", "Natitingou", "Kandi", "Malanville", "Banikoara", "Nikki", "Bembèrèkè", "Tchaourou", "Bassila", "Copargo", "Ouaké", "Boukoumbé", "Tanguiéta", "Matéri", "Cobly", "Karimama", "Gogounou", "Segbana", "Sinendé", "Kalalé", "Péhunco", "Kérou", "Kouandé", "Birni", "Toucountouna"
    ],
    togo: [
        "Lomé", "Tsévié", "Aného", "Tabligbo", "Vogan", "Assahoun", "Atakpamé", "Kpalimé", "Notsé", "Badou", "Agou",
        "Sokodé", "Tchamba", "Sotouboua", "Kara", "Bafilo", "Bassar", "Niamtougou", "Dapaong", "Mango", "Mandouri"
    ],
    ivoire: [
        "Abidjan (Cocody)", "Plateau", "Abobo", "Yopougon", "Grand-Bassam", "San-Pédro", "Dabou", "Aboisso",
        "Yamoussoukro", "Bouaké", "Dimbokro", "Daoukro", "Man", "Daloa", "Gagnoa", "Soubré",
        "Korhogo", "Ferkessédougou", "Odienné", "Boundiali", "Katiola", "Abengourou", "Bondoukou"
    ],
    nigeria: [
        "Lagos", "Ibadan", "Abeokuta", "Akure", "Port Harcourt", "Benin City", "Calabar", "Warri",
        "Abuja", "Kano", "Kaduna", "Sokoto", "Ilorin", "Jos", "Maiduguri", "Zaria",
        "Enugu", "Onitsha", "Aba", "Owerri", "Minna", "Lokoja", "Makurdi"
    ]
};

// Gestion de la sélection dynamique des villes
const countrySelect = document.getElementById('countrySelect');
const citySelect = document.getElementById('citySelect');

countrySelect.addEventListener('change', function() {
    const selectedCountry = this.value;
    citySelect.innerHTML = '<option value="" selected disabled>Choisir la ville...</option>';
    
    if (selectedCountry) {
        citySelect.disabled = false;
        locations[selectedCountry].forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
});

// LOGIQUE D'ENVOI VERS GOOGLE SHEETS
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzWYHDVEVHkuc2x1XDHNxwJ9Y_yr_SbpWApNhFdf6CUkWgngv1PbKabwx4e-VtFwL0n/exec"; // Collez ici l'URL obtenue lors du déploiement

document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const msgDiv = document.getElementById('successMessage');
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];
    
    // Désactiver le bouton pendant l'envoi
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Envoi en cours...';

    const reader = new FileReader();
    reader.onload = function() {
        const base64Data = reader.result.split(',')[1];
        
        const payload = {
            nom: document.getElementById('eventName').value,
            pays: countrySelect.value,
            ville: citySelect.value,
            categorie: document.getElementById('categorySelect').value,
            infoUrl: document.getElementById('infoUrl').value,
            date: document.getElementById('eventDate').value,
            imageFile: base64Data,
            imageName: file.name,
            imageType: file.type
        };

        fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        .then(res => res.text())
        .then(response => {
            if(response === "Success") {
                // 1. Sélectionner la boîte de message
                const toast = document.getElementById('successToast');
                
                // 2. L'afficher avec une petite animation
                toast.style.display = 'block';
                toast.style.animation = 'fadeInDown 0.5s ease-out';

                // 3. Vider le formulaire
                e.target.reset();
                citySelect.disabled = true;

                // 4. La faire disparaître automatiquement après 5 secondes
                setTimeout(() => {
                    toast.style.animation = 'fadeOutUp 0.5s ease-in';
                    setTimeout(() => {
                        toast.style.display = 'none';
                    }, 500); // Temps de l'animation de sortie
                }, 5000); // Temps d'affichage (5000ms = 5s)
            } else {
                alert("Erreur: " + response);
            }
        })
        .catch(error => {
            console.error(error);
            alert("Une erreur est survenue lors de l'envoi.");
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerText = "Publier l'événement";
        });
    };
    
    reader.readAsDataURL(file);
});




