//Mettre le code JavaScript lié à la page photographer.html
async function getPhotographers() {
    try {
        const response = await fetch('./data/photographers.json');
        if (!response.ok) {
            throw new Error('Erreur lors du chargement du fichier JSON');
        }
        const data = await response.json();
        return data.photographers;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
}

async function displayPhotographerDetails() {
    // Récupérer l'ID du photographe depuis l'URL
    const params = new URLSearchParams(window.location.search);
    const photographerId = parseInt(params.get('id'));

    // Récupérer tous les photographes
    const photographers = await getPhotographers();

    // Trouver le photographe correspondant à l'ID
    const photographer = photographers.find(p => p.id === photographerId);

    if (photographer) {
        // Mettre à jour l'en-tête du photographe
        const photographHeader = document.querySelector('.photograph-header');
        
        // Créer un élément pour la photo de profil
        const profileImg = document.createElement('img');
        profileImg.src = `assets/photographers/${photographer.portrait}`;
        profileImg.alt = photographer.name;
        profileImg.classList.add('photographer-profile-img');

        // Créer un élément pour le nom du photographe
        const nameElement = document.createElement('h1');
        nameElement.textContent = photographer.name;

        // Ajouter les éléments à l'en-tête
        photographHeader.insertBefore(nameElement, photographHeader.firstChild);
        photographHeader.insertBefore(profileImg, nameElement);
    } else {
        console.error('Photographe non trouvé');
    }
}

// Appeler la fonction quand la page est chargée
document.addEventListener('DOMContentLoaded', displayPhotographerDetails);