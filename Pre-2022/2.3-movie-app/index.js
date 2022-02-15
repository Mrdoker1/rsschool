let url = "https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=all&page=1";
let page = 1;
let lastRequest;

let selectors = {
    search: document.querySelector('.search'),
    searchClear: document.getElementById('search-clear'),
    filmList: document.querySelector('.film-list'),
    chipsList: document.querySelector('.chips-list'),
    more: document.getElementById('more'),
}

selectors.search.focus();

let chips = ['Drama', 'Action', 'Horror', 'Documentary', 'Lovestory'];

selectors.search.addEventListener('keypress', (e) => {

    if (e.key == 'Enter') {
        search(selectors.search.value);
    }
})

selectors.search.addEventListener('input', (e) => {

    if (selectors.search.value == '') {
        selectors.searchClear.style.display = "none";
    } else {
        selectors.searchClear.style.display = "block";
    }
})

document.getElementById(`search-clear`).addEventListener('click', () => {
    selectors.search.value = '';
    selectors.searchClear.style.display = "none";
});

selectors.more.addEventListener('click', (e) => {
    page++;
    getData(lastRequest, page);
})

getData();
setChips(chips);

async function getData(request, page) {

    page ? page : page = 1;

    if (request == lastRequest && page > 1) {

    } else {
        clear();
    }

    lastRequest = request;


    if (request) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=${request}&page=${page}`;
    } else {
        url = `https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=all&page=${page}`;
    }

    let res = await fetch(url);
    let data = await res.json();

    // console.log(data);
    // console.log(url);

    showData(data);
    setRatingColor();

    console.log(page);
    // data ? console.log(data) : console.log("error receiving data");
}

function showData(data) {

    let i = 0;

    for (key in data.results) {

        let poster = data.results[i].poster_path;
        let title = data.results[i].title;
        let overview = data.results[i].overview;
        let rating = data.results[i].vote_average;

        selectors.filmList.append(card(rating, overview, title, poster));

        i++;

    }

    if (i == 0 && !document.contains(document.querySelector('.zero-search'))) {

        let element = document.createElement("div");
        element.className = "zero-search";
        element.innerHTML = `<p>Unfortunately, nothing was found :(</p>`
        selectors.filmList.append(element);
        selectors.more.style.display = 'none';
    } else if (i > 0 && document.contains(document.querySelector('.zero-search'))) {
        document.querySelector('.zero-search').remove();
        selectors.more.style.display = 'block';
    }
}

function image(title, poster) {
    let img = new Image();

    poster ? img.src = `https://image.tmdb.org/t/p/w1280${poster}` : img.src = `./assets/img/no-image.png`

    img.alt = title;
    return img;
}

function hover(title, rating, overview) {
    let hover = document.createElement("div");
    hover.className = "card-hover";
    hover.innerHTML = `<div class="card-info">` +
        `<div class = "title">${title}</div>` +
        `<div class = "overview">` +
        `<div class = "rating">Rating ${rating}</div>` +
        `<p>${overview}</p></div></div>`
    return hover;
}

function card(rating, overview, title, poster) {
    let card = document.createElement("div");
    card.className = "card";
    card.append(hover(title, rating, overview), image(title, poster));

    return card;
}

function search(request) {

    getData(request);
}

function clear() {

    document.querySelectorAll('.card').forEach(element => {
        element.remove();
    })
}

function setChips(chips) {

    chips.forEach((element, index) => {

        let chips = document.createElement("div");
        chips.className = "chips";
        chips.innerHTML = element;
        chips.id = `chips${index}`
        selectors.chipsList.append(chips);

        document.getElementById(`chips${index}`).addEventListener('click', () => {
            getData(element)
        });
    })
}

function setRatingColor() {
    let bad = `#e97474`;
    let middle = `#e9c674`;
    let good = `#73d76d`;

    document.querySelectorAll('.rating').forEach(element => {

        let rating = element.textContent.substring(7);

        if (rating < 5) {
            element.style.color = bad;
        } else if (rating < 7) {
            element.style.color = middle;
        } else {
            element.style.color = good;
        }
    })

}

console.log("Оценка 60 баллов. Требования к заданию выполнены в полном объеме");