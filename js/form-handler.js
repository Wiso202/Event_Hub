// js/form-handler.js
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw0f6ule6d8AmcVumjfom1Z2Mj_RMZ9fUDjGltbJ9_1NXGV2wtgfqK34qtyyF8VEgbx/exec";

document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const fileInput = document.getElementById('imageInput'); // L'ID de votre <input type="file">
    const file = fileInput.files[0];

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Envoi de la photo...';

    const reader = new FileReader();
    reader.onload = function() {
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

        fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(res => {
            alert("Événement publié !");
            window.location.href = "evenements.html";
        })
        .catch(err => alert("Erreur lors de l'envoi"));
    };
    reader.readAsDataURL(file);
});
