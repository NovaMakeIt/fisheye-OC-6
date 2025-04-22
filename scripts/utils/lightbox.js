// Fonction pour créer et gérer la lightbox
function initLightbox(media) {
    // Créer la structure HTML de la lightbox
    const lightboxHTML = `
        <div id="lightbox" class="lightbox">
            <div class="lightbox-content">
                <button class="lightbox-close"><img src="assets/icons/close2.svg" alt="Close dialog"></button>
                <button class="lightbox-prev"><img src="assets/icons/left.svg" alt="Previous image"></button>
                <button class="lightbox-next"><img src="assets/icons/right.svg" alt="Next image"></button>
                <div class="lightbox-media-container"></div>
                <div class="lightbox-caption"></div>
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
            mediaElement.alt = currentMedia.title;
        } else if (currentMedia.video) {
            mediaElement = document.createElement('video');
            mediaElement.src = `assets/images/${currentMedia.video}`;
            mediaElement.controls = true;
            mediaElement.autoplay = true;
        }
        
        // Ajouter le média au conteneur
        mediaContainer.appendChild(mediaElement);
        
        // Mettre à jour la légende
        caption.textContent = currentMedia.title;
    }
    
    // Fonction pour ouvrir la lightbox avec un média spécifique
    function openLightbox(index) {
        showMedia(index);
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Empêcher le défilement du body
        
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