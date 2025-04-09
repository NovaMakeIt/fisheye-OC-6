// Fonction pour trier les médias selon l'option choisie
function sortMedia(media, sortBy) {
    const mediaCopy = [...media]; // Créer une copie pour ne pas modifier l'original
    
    switch(sortBy) {
        case 'popularity':
            return mediaCopy.sort((a, b) => b.likes - a.likes);
        case 'date':
            return mediaCopy.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'title':
            return mediaCopy.sort((a, b) => a.title.localeCompare(b.title));
        default:
            return mediaCopy;
    }
}

// Fonction pour mettre à jour le total des likes lorsqu'un utilisateur ajoute un like
function updateTotalLikes() {
    const likesCountElements = document.querySelectorAll('.media-likes span:first-child');
    let totalLikes = 0;
    
    // Additionner tous les likes affichés
    likesCountElements.forEach(element => {
        totalLikes += parseInt(element.textContent);
    });
    
    // Mettre à jour l'affichage
    const totalLikesElement = document.querySelector('.likes-count');
    if (totalLikesElement) {
        totalLikesElement.textContent = `${totalLikes} ❤`;
    }
}

// Fonction pour afficher les médias
function displayMedia(media, sortBy, lightboxModule) {
    const portfolioSection = document.querySelector('.photograph-portfolio');
    portfolioSection.innerHTML = ''; // Nettoyer le contenu existant
    
    // Trier les médias
    const sortedMedia = sortMedia(media, sortBy);
    
    // Initialiser la lightbox
    const lightbox = lightboxModule.initLightbox(sortedMedia);
    
    // Créer et ajouter chaque carte média
    sortedMedia.forEach((item, index) => {
        const mediaCard = document.createElement('article');
        mediaCard.classList.add('media-card');
        
        const mediaContainer = document.createElement('div');
        mediaContainer.classList.add('media-container');
        
        // Créer l'élément média (image ou vidéo)
        let mediaElement;
        if (item.image) {
            mediaElement = document.createElement('img');
            mediaElement.src = `assets/images/${item.image}`;
            mediaElement.alt = item.title;
        } else if (item.video) {
            mediaElement = document.createElement('video');
            mediaElement.src = `assets/images/${item.video}`;
            mediaElement.setAttribute('controls', '');
            mediaElement.setAttribute('preload', 'metadata');
        }
        
        // Ajouter l'écouteur d'événement pour ouvrir la lightbox
        mediaContainer.addEventListener('click', () => {
            lightbox.open(index);
        });
        
        mediaContainer.appendChild(mediaElement);
        
        // Créer le conteneur d'informations
        const mediaInfo = document.createElement('div');
        mediaInfo.classList.add('media-info');
        
        // Ajouter le titre
        const title = document.createElement('h3');
        title.classList.add('media-title');
        title.textContent = item.title;
        
        // Ajouter les likes
        const likes = document.createElement('div');
        likes.classList.add('media-likes');
        
        const likesCount = document.createElement('span');
        likesCount.textContent = item.likes;
        
        const heartIcon = document.createElement('span');
        heartIcon.classList.add('heart-icon');
        heartIcon.innerHTML = '❤'; // Icône cœur simple
        
        // Ajouter la fonctionnalité d'ajout de like
        heartIcon.addEventListener('click', () => {
            item.likes++;
            likesCount.textContent = item.likes;
            // Mettre à jour le total des likes
            updateTotalLikes();
        });
        
        likes.appendChild(likesCount);
        likes.appendChild(heartIcon);
        
        // Assembler le tout
        mediaInfo.appendChild(title);
        mediaInfo.appendChild(likes);
        
        mediaCard.appendChild(mediaContainer);
        mediaCard.appendChild(mediaInfo);
        
        portfolioSection.appendChild(mediaCard);
    });
}

export { sortMedia, updateTotalLikes, displayMedia };