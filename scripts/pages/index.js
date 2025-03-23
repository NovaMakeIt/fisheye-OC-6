    async function getPhotographers() {
        // Ceci est un exemple de données pour avoir un affichage de photographes de test dès le démarrage du projet, 
        // mais il sera à remplacer avec une requête sur le fichier JSON en utilisant "fetch".
        try {
            // Utiliser fetch pour récupérer le fichier JSON
            const response = await fetch('./data/photographers.json');
            
            // Vérifier si la réponse est correcte
            if (!response.ok) {
                throw new Error('Erreur lors du chargement du fichier JSON');
            }
            
            // Convertir la réponse en JSON
            const data = await response.json();
            
            // Retourner les données des photographes
            return { photographers: data.photographers };
        } catch (error) {
            console.error('Erreur:', error);
            // En cas d'erreur, retourner un tableau vide
            return { photographers: [] };
        }
    }

    async function displayData(photographers) {
        const photographersSection = document.querySelector(".photographer_section");

        photographers.forEach((photographer) => {
            const photographerModel = photographerTemplate(photographer);
            const userCardDOM = photographerModel.getUserCardDOM();
            photographersSection.appendChild(userCardDOM);
        });
    }

    async function init() {
        // Récupère les datas des photographes
        const { photographers } = await getPhotographers();
        displayData(photographers);
    }
    
    init();
    
