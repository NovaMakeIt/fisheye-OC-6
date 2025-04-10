// Fonction pour récupérer les données du photographe
async function fetchPhotographerData() {
    try {
        const response = await fetch('./data/photographers.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        return null;
    }
}

// Fonction pour afficher le nom du photographe dans le formulaire
async function displayPhotographerName() {
    // Récupérer l'ID du photographe depuis l'URL
    const params = new URLSearchParams(window.location.search);
    const photographerId = parseInt(params.get('id'));

    if (photographerId) {
        // Récupérer les données
        const data = await fetchPhotographerData();
        if (data) {
            const photographers = data.photographers;
            // Trouver le photographe correspondant à l'ID
            const photographer = photographers.find(p => p.id === photographerId);

            if (photographer) {
                // Afficher le nom du photographe dans le h2
                const photographerNameElement = document.getElementById('photographer-name');
                if (photographerNameElement) {
                    photographerNameElement.textContent = photographer.name;
                }
            }
        }
    }
}

function displayModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}

// Ajouter un écouteur d'événement pour la soumission du formulaire
document.addEventListener('DOMContentLoaded', function() {
    // Appeler la fonction pour afficher le nom du photographe
    displayPhotographerName();
    
    // Récupérer le formulaire
    const contactForm = document.querySelector('#contact_modal form');
    
    // Ajouter un écouteur d'événement pour la soumission du formulaire
    contactForm.addEventListener('submit', function(event) {
        // Empêcher la soumission standard du formulaire
        event.preventDefault();
        
        // Récupérer les valeurs des champs
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Afficher les données dans la console
        console.log('Prénom :', firstName);
        console.log('Nom :', lastName);
        console.log('Email :', email);
        console.log('Message :', message);
        
        // Afficher un message de confirmation
        alert('Merci pour votre message ! Vos informations ont été envoyées.');
        
        // Fermer le modal
        closeModal();
        
        // Réinitialiser le formulaire
        contactForm.reset();
    });
});