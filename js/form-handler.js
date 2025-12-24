// form-handler.js
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwvpCBufsXlcl8g38PgiT9B1Lne6b_xHeEbaqBC0P5oZCIzTyu9YxQQn6v7ItGQjDolIw/exec";

document.getElementById('eventForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerText = "Publication en cours...";

    const formData = {
        nom: this.elements[0].value,
        pays: document.getElementById('countrySelect').value,
        ville: document.getElementById('citySelect').value,
        categorie: this.elements[3].value,
        imageURL: this.elements[4].value,
        infoURL: this.elements[5].value,
        date: this.elements[6].value
    };

    fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
        alert("Événement publié avec succès !");
        window.location.href = "evenements.html";
    })
    .catch(err => {
        console.error(err);
        alert("Erreur lors de la publication.");
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerText = "Publier l'événement";
    });

});
