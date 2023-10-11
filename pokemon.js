const searchInput = document.getElementById('search');
const searchButton = document.getElementById('searchButton');
const pokemonList = document.getElementById('pokemonList');
const pagination = document.getElementById('pagination');
let currentPage = 1;
const pokemonsPerPage = 8;

let allPokemons = []; // Almacenar todos los Pokémon
let filteredPokemons = []; // Almacenar Pokémon filtrados por búsqueda

function fetchAllPokemons() {
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151'; // Obtener todos los Pokémon

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            allPokemons = data.results; // Almacenar todos los Pokémon
            fetchPokemons(currentPage); // Cargar la página actual
            updatePagination();
        });
}

function fetchPokemons(page) {
    const offset = (page - 1) * pokemonsPerPage;
    const apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=${pokemonsPerPage}&offset=${offset}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            pokemonList.innerHTML = '';
            data.results.forEach(pokemon => {
                fetchPokemonDetails(pokemon.url);
            });
        });
}

function fetchPokemonDetails(url) {
    fetch(url)
        .then(response => response.json())
        .then(pokemonData => {
            const name = pokemonData.name;
            const abilities = pokemonData.abilities.map(ability => ability.ability.name).join(', ');
            const description = '¡Este es un Pokémon genial!';
            const imageUrl = pokemonData.sprites.front_default;

            const card = document.createElement('div');
            card.className = 'pokemon-card';
            card.innerHTML = `
                <h2>${name}</h2>
                <img src="${imageUrl}" alt="${name}">
                <p><strong>Poderes:</strong> ${abilities}</p>
                <p><strong>Descripción:</strong> ${description}</p>
            `;
            allPokemons.push({ name, abilities, description });
            pokemonList.appendChild(card);
        });
}

function updatePagination() {
    const totalPages = Math.ceil(151 / pokemonsPerPage);

    pagination.innerHTML = `
        <button onclick="prevPage()" ${currentPage === 1 ? 'disabled' : ''}>Anterior</button>
        <span>Página ${currentPage}</span>
        <button onclick="nextPage()" ${currentPage === totalPages ? 'disabled' : ''}>Siguiente</button>
    `;
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchPokemons(currentPage);
    }
}

function nextPage() {
    const totalPages = Math.ceil(151 / pokemonsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        fetchPokemons(currentPage);
    }
}

function performSearch() {
    const searchValue = searchInput.value.toLowerCase();
    filteredPokemons = allPokemons.filter(pokemon => pokemon.name.includes(searchValue));
    currentPage = 1;
    displaySearchResults(filteredPokemons);
    updatePagination();
}

function displaySearchResults(results) {
    pokemonList.innerHTML = '';
    results.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.innerHTML = `
            <h2>${pokemon.name}</h2>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(pokemon.url)}.png" alt="${pokemon.name}">
            <p><strong>Poderes:</strong> ${pokemon.abilities}</p>
            <p><strong>Descripción:</strong> ${pokemon.description}</p>
        `;
        pokemonList.appendChild(card);
    });
}

function getPokemonId(url) {
    const parts = url.split('/');
    return parts[parts.length - 2];
}

searchButton.addEventListener('click', () => {
    performSearch();
});

searchInput.addEventListener('input', () => {
    performSearch();
});

fetchAllPokemons();
