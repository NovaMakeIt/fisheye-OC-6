// Fonction pour créer et gérer la lightbox
function initLightbox(media) {
    // Créer la structure HTML de la lightbox avec des attributs ARIA
    const lightboxHTML = `
        <div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="Image en plein écran">
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Fermer la lightbox"><img src="assets/icons/close2.svg" alt="Fermer"></button>
                <button class="lightbox-prev" aria-label="Image précédente"><img src="assets/icons/left.svg" alt="Précédent"></button>
                <button class="lightbox-next" aria-label="Image suivante"><img src="assets/icons/right.svg" alt="Suivant"></button>
                <div class="lightbox-media-container" role="img" aria-labelledby="lightbox-caption"></div>
                <div id="lightbox-caption" class="lightbox-caption"></div>
            </div>
        </div>
    `;
    
    // Ajouter la lightbox au body
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    
    // Récupérer les éléments de la lightbox
    const lightbox = document.getElementById('lightbox');
    const mediaContainer = lightbox.querySelector('.lightbox-media-container');
    const caption = lightbox.querySelector('.lightbox-caption');
    
    // Ajouter les écouteurs d'événements pour les boutons
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    // Index du média actuel dans la lightbox
    let currentIndex = 0;
    
    // Fonction pour afficher un média spécifique dans la lightbox
    function showMedia(index) {
        // Mettre à jour l'index courant
        currentIndex = index;
        
        // Récupérer le média à afficher
        const currentMedia = media[index];
        
        // Vider le conteneur
        mediaContainer.innerHTML = '';
        
        // Créer l'élément média (image ou vidéo)
        let mediaElement;
        if (currentMedia.image) {
            mediaElement = document.createElement('img');
            mediaElement.src = `assets/images/${currentMedia.image}`;
            mediaElement.alt = currentMedia.title || 'Image du photographe';
        } else if (currentMedia.video) {
            mediaElement = document.createElement('video');
            mediaElement.src = `assets/images/${currentMedia.video}`;
            mediaElement.controls = true;
            mediaElement.autoplay = true;
            mediaElement.setAttribute('aria-label', currentMedia.title || 'Vidéo du photographe');
        }
        
        // Ajouter le média au conteneur
        mediaContainer.appendChild(mediaElement);
        
        // Mettre à jour la légende
        caption.textContent = currentMedia.title;
        mediaContainer.setAttribute('aria-label', currentMedia.title || 'Média du photographe');
        
        // Annoncer le changement pour les lecteurs d'écran
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `Image ${index + 1} sur ${media.length}: ${currentMedia.title}`;
        lightbox.appendChild(announcement);
        
        // Supprimer l'annonce après qu'elle ait été lue
        setTimeout(() => {
            lightbox.removeChild(announcement);
        }, 1000);
    }
    
    // Fonction pour ouvrir la lightbox avec un média spécifique
    function openLightbox(index) {
        showMedia(index);
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Empêcher le défilement du body
        
        // Focus sur le premier élément interactif
        closeBtn.focus();
        
        // Ajouter une gestion du clavier pour la navigation
        document.addEventListener('keydown', handleKeyboard);
    }
    
    // Fonction pour fermer la lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = ''; // Réactiver le défilement du body
        
        // Si une vidéo est en cours de lecture, l'arrêter
        const video = mediaContainer.querySelector('video');
        if (video) {
            video.pause();
        }
        
        // Supprimer l'écouteur d'événements du clavier
        document.removeEventListener('keydown', handleKeyboard);
        
        // Remettre le focus sur l'élément qui avait ouvert la lightbox
        const mediaCards = document.querySelectorAll('.media-container');
        if (mediaCards[currentIndex]) {
            mediaCards[currentIndex].focus();
        }
    }
    
    // Fonction pour passer au média précédent
    function showPrevMedia() {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) {
            newIndex = media.length - 1; // Boucler à la fin
        }
        showMedia(newIndex);
    }
    
    // Fonction pour passer au média suivant
    function showNextMedia() {
        let newIndex = currentIndex + 1;
        if (newIndex >= media.length) {
            newIndex = 0; // Boucler au début
        }
        showMedia(newIndex);
    }
    
    // Fonction pour gérer les touches du clavier
    function handleKeyboard(e) {
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevMedia();
                break;
            case 'ArrowRight':
                showNextMedia();
                break;
            case 'Tab':
                // Garder le focus dans la lightbox
                const focusableElements = lightbox.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
                break;
        }
    }
    
    // Ajouter les écouteurs d'événements aux boutons
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevMedia);
    nextBtn.addEventListener('click', showNextMedia);
    
    // Ajouter un écouteur d'événement pour fermer en cliquant à l'extérieur
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Retourner un objet avec les fonctions nécessaires
    return {
        open: openLightbox
    };
}

export { initLightbox };