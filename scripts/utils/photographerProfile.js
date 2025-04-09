// Fonction pour afficher les informations du photographe
function displayPhotographerInfo(photographer) {
    // Sélectionner l'en-tête du photographe
    const photographHeader = document.querySelector('.photograph-header');
    
    // Créer un conteneur pour les informations textuelles
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('photographer-info');

    // Créer les éléments pour les informations du photographe
    const nameElement = document.createElement('h1');
    nameElement.textContent = photographer.name;

    const locationElement = document.createElement('h2');
    locationElement.textContent = `${photographer.city}, ${photographer.country}`;

    const taglineElement = document.createElement('p');
    taglineElement.textContent = photographer.tagline;

    // Ajouter les éléments textuels au conteneur
    infoContainer.appendChild(nameElement);
    infoContainer.appendChild(locationElement);
    infoContainer.appendChild(taglineElement);

    // Créer la photo de profil
    const profileImg = document.createElement('img');
    profileImg.src = `assets/photographers/${photographer.portrait}`;
    profileImg.alt = photographer.name;
    profileImg.classList.add('photographer-profile-img');

    // Créer le bouton de contact
    const contactButton = document.createElement('button');
    contactButton.textContent = 'Contactez-moi';
    contactButton.classList.add('contact_button');
    contactButton.addEventListener('click', displayModal);

    // Réorganiser les éléments dans l'en-tête
    photographHeader.innerHTML = ''; // Nettoyer le contenu existant
    photographHeader.appendChild(infoContainer);
    photographHeader.appendChild(contactButton);
    photographHeader.appendChild(profileImg);
}

// Nouvelle fonction pour afficher le total des likes et le prix du photographe
function displayLikesAndPrice(media, photographer) {
    const rectangleLikes = document.querySelector('.rectangle-likes');
    
    // Calculer le total des likes
    const totalLikes = media.reduce((sum, item) => sum + item.likes, 0);
    
    // Créer le contenu du rectangle
    rectangleLikes.innerHTML = `
        <div class="likes-count">${totalLikes} ❤</div>
        <div class="photographer-price">${photographer.price}€ / jour</div>
    `;
}

export { displayPhotographerInfo, displayLikesAndPrice };