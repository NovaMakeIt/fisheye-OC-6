function photographerTemplate(data) {
    const { id, name, portrait, city, country, tagline, price } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const link = document.createElement('a');
        link.setAttribute('href', `/photographer.html?id=${id}`);
        const article = document.createElement('article');
        const img = document.createElement('img');
        img.setAttribute("src", picture)
        img.setAttribute("alt", name);
        const h2 = document.createElement('h2');
        h2.textContent = name;
        const h3 = document.createElement('h3');
        h3.textContent = `${city}, ${country}`;
        const p = document.createElement('p');
        p.textContent = tagline;
        const money = document.createElement('p');
        money.textContent = `${price}€/jour`;
        money.classList.add("money");
        link.appendChild(article);
        article.appendChild(img);
        article.appendChild(h2);
        article.appendChild(h3);
        article.appendChild(p);
        article.appendChild(money);

        return (link);
    }
    
    return { name, picture, getUserCardDOM }
}