/*import { getPhotographersData } from "../api/api.js";*/

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
        
        // afficher un message de confirmation
        alert('Merci pour votre message ! Vos informations ont été envoyées.');
        
        // Fermer le modal
        closeModal();
        
        // Réinitialiser le formulaire
        contactForm.reset();
    });
});