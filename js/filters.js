// filters.js
document.getElementById('searchInput')?.addEventListener('input', function(e) {
    const term = e.target.value.toLowerCase();
    const filtered = allEvents.filter(event => 
        event.Nom.toLowerCase().includes(term) || 
        event.Ville.toLowerCase().includes(term)
    );
    renderEvents(filtered);
});

function showLegal(type) {
    const title = type === 'terms' ? "Conditions Générales d'Utilisation" : "Politique de Confidentialité";
    const content = type === 'terms' ? 
        "En utilisant EventHub, vous acceptez de publier des informations véridiques sur vos événements. Flexitech se réserve le droit de supprimer tout contenu inapproprié ou frauduleux. L'utilisation du service est gratuite pour les utilisateurs, mais la responsabilité des événements organisés incombe exclusivement aux organisateurs déclarés." :
        "Vos données (email, nom) sont collectées uniquement pour le bon fonctionnement d'EventHub et pour vous envoyer notre newsletter si vous y avez souscrit. Flexitech s'engage à ne jamais vendre vos données à des tiers. Conformément aux lois en vigueur, vous disposez d'un droit d'accès et de suppression de vos informations sur simple demande par mail.";

    alert(title + "\n\n" + content); // Version simple. Vous pouvez aussi créer un Modal Bootstrap pour un rendu plus pro.
}

// --- Code pour la Newsletter (à ajouter à la fin de filters.js) ---
document.addEventListener('DOMContentLoaded', () => {
    const newsBtn = document.querySelector('footer .btn-primary');
    const newsInput = document.querySelector('footer input[type="text"]');

    if (newsBtn && newsInput) {
        newsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = newsInput.value.trim();
            
            if (email && email.includes('@')) {
                // Animation de succès
                this.innerHTML = '<i class="fa fa-check"></i>';
                this.classList.replace('btn-primary', 'btn-success');
                this.disabled = true;
                newsInput.disabled = true;
                
                alert("Félicitations ! Flexitech vous enverra les prochains événements de l'EventHub.");
                console.log("Inscription Newsletter pour :", email);
            } else {
                alert("Oups ! Veuillez entrer une adresse email valide.");
                newsInput.focus();
            }
        });
    }
});





