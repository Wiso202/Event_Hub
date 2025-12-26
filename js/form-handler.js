// js/form-handler.js
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw0f6ule6d8AmcVumjfom1Z2Mj_RMZ9fUDjGltbJ9_1NXGV2wtgfqK34qtyyF8VEgbx/exec";

document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = this.querySelector('button[type="submit"]');
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (!file) {
        alert("Veuillez sélectionner une image.");
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Envoi en cours...';

    const reader = new FileReader();
    reader.onload = function() {
        // Préparation des données
        const base64Data = reader.result.split(',')[1];
        
        const payload = {
            nom: document.getElementById('nomEvent').value,
            pays: document.getElementById('countrySelect').value,
            ville: document.getElementById('citySelect').value,
            categorie: document.getElementById('catSelect').value,
            infoURL: document.getElementById('infoURL').value,
            date: document.getElementById('dateEvent').value,
            imageFile: {
                base64: base64Data,
                mimeType: file.type
            }
        };

        // Envoi vers Apps Script
        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Très important pour éviter les erreurs de sécurité (CORS)
            body: JSON.stringify(payload)
        })
        .then(() => {
            alert("Événement publié avec succès !");
            window.location.href = "evenements.html";
        })
        .catch(err => {
            console.error(err);
            alert("Erreur lors de la publication.");
            btn.disabled = false;
            btn.innerText = "Publier l'événement";
        });
    };
    reader.readAsDataURL(file);
});
