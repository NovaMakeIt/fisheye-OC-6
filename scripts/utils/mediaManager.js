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
    portfolioSection.setAttribute('role', 'region');
    portfolioSection.setAttribute('aria-label', 'Portfolio du photographe');
    
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
        mediaContainer.setAttribute('tabindex', '0');
        mediaContainer.setAttribute('role', 'button');
        mediaContainer.setAttribute('aria-label', `Voir ${item.title} en plein écran`);
        
        // Créer l'élément média (image ou vidéo)
        let mediaElement;
        if (item.image) {
            mediaElement = document.createElement('img');
            mediaElement.src = `assets/images/${item.image}`;
            mediaElement.alt = item.title || 'Image du photographe';
        } else if (item.video) {
            mediaElement = document.createElement('video');
            mediaElement.src = `assets/images/${item.video}`;
            mediaElement.setAttribute('controls', '');
            mediaElement.setAttribute('preload', 'metadata');
            mediaElement.setAttribute('aria-label', item.title || 'Vidéo du photographe');
        }
        
        // Ajouter l'écouteur d'événement pour ouvrir la lightbox
        mediaContainer.addEventListener('click', () => {
            lightbox.open(index);
        });
        
        // Ajouter la gestion du clavier pour l'accessibilité
        mediaContainer.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                lightbox.open(index);
            }
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
        likes.setAttribute('role', 'group');
        likes.setAttribute('aria-label', 'Likes');
        
        const likesCount = document.createElement('span');
        likesCount.textContent = item.likes;
        likesCount.setAttribute('aria-label', `${item.likes} likes`);
        
        const heartIcon = document.createElement('button');
        heartIcon.classList.add('heart-icon');
        // Créer l'élément image pour le cœur
        const heartImg = document.createElement('img');
        heartImg.src = 'assets/icons/likes.svg'; // Chemin vers votre image PNG
        heartImg.alt = '';
        heartImg.setAttribute('aria-hidden', 'true');
        // Ajouter l'image au bouton
        heartIcon.appendChild(heartImg);
        heartIcon.setAttribute('aria-label', 'Ajouter un like');
        heartIcon.setAttribute('title', 'Ajouter un like');

        // Stocker un indicateur pour savoir si l'utilisateur a déjà liké cette image
        let hasLiked = false;
        
        // Ajouter la fonctionnalité d'ajout de like
        heartIcon.addEventListener('click', () => {
            if (!hasLiked) {
                // Si l'utilisateur n'a pas encore aimé ce média
                item.likes++;
                likesCount.textContent = item.likes;
                likesCount.setAttribute('aria-label', `${item.likes} likes`);
                // Mettre à jour le total des likes
                updateTotalLikes();
                
                // Marquer comme déjà liké
                hasLiked = true;
                
                // Mettre à jour l'annonce pour les lecteurs d'écran
                heartIcon.setAttribute('aria-label', `Vous avez aimé. Total: ${item.likes} likes`);
                heartIcon.setAttribute('title', 'Déjà aimé');
            }
        });
        
        // Ajouter la gestion du clavier pour le bouton like
        heartIcon.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !hasLiked) {
                e.preventDefault();
                item.likes++;
                likesCount.textContent = item.likes;
                likesCount.setAttribute('aria-label', `${item.likes} likes`);
                updateTotalLikes();
                
                // Marquer comme déjà liké
                hasLiked = true;
                
                // Mettre à jour l'annonce pour les lecteurs d'écran
                heartIcon.setAttribute('aria-label', `Vous avez aimé. Total: ${item.likes} likes`);
                heartIcon.setAttribute('title', 'Déjà aimé');
            }
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