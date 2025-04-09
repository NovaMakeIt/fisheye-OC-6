// Fonction pour récupérer les données des photographes
async function getPhotographersData() {
    try {
        const response = await fetch('./data/photographers.json');
        if (!response.ok) {
            throw new Error('Erreur lors du chargement du fichier JSON');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur:', error);
        return { photographers: [], media: [] };
    }
}

export { getPhotographersData };