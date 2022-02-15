let lang = getLocalStorage('lang') || 'en';
let theme = getLocalStorage('theme') || 'dark';

const header = document.querySelector('header');
const menu = document.querySelector('.menu');
const hamburger = document.querySelector('.hamburger');
const themeElements = [
    document.querySelector(":root"),
    document.getElementById("hero-container"),
    document.getElementById("contacts-container"),
    document.getElementById("hireMe"),
    document.getElementById("submitForm"),
    ...document.querySelectorAll(".price-item .primary-button"),
    ...document.querySelectorAll(".secondary-button"),
    document.querySelector(".theme-switcher-icon"),
    ...document.querySelectorAll(".section-title"),
]

const gallery = {
    'winter': [],
    'spring': [],
    'summer': [],
    'autumn': []
};

setTheme(theme);
translatePage(lang, document.querySelector(`[data-language-key="${lang}"]`));
galleryLoader();

for (let img of document.body.querySelectorAll('img')) {
    img.setAttribute("draggable", "false");
}

function languageSwitcherHandler() {
    translatePage(this.dataset.languageKey, this);
}

function setTheme(newTheme) {
    let method = (newTheme == "dark" ? "remove" : "add");
    theme = newTheme;
    themeElements.forEach(e => e.classList[method]("light"));
    setLocaleStorage('theme', theme);
}

function themeSwitcherHandler(event) {
    if (theme == "dark") {
        setTheme("light");
    } else {
        setTheme("dark");
    }
}

function setLocaleStorage(key, value) {
    localStorage.setItem(key, value);
}

function getLocalStorage(key) {
    return localStorage.getItem(key);
}

window.onscroll = () => {
    if (window.pageYOffset > 90) {
        header.classList.add('sticky-header');
    } else {
        header.classList.remove('sticky-header');
    }
};

function menuHandler() {
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        document.body.style.overflow = "hidden";
        hamburger.classList.add('is-active');
    } else {
        menu.classList.add('hidden');
        document.body.style.overflow = "visible";
        hamburger.classList.remove('is-active');
    }
}

function galleryLoader() {
    for (let key in gallery) {
        for (let i = 1; i <= 6; i++) {
            let img = new Image();
            img.src = `./assets/img/${ key }/${i}.jpg`;
            img.classList.add("portfolio-image");
            img.setAttribute("alt", `portfolio-img-${i}`);
            img.setAttribute("filter", key);
            img.setAttribute("draggable", false);
            gallery[key].push(img);
        }
    }
}

function gallerySwitcherHandler() {
    gallerySwitcher(this.dataset.i18);
    document.querySelector(".secondary-button.checked").classList.remove('checked');
    this.classList.add('checked');
}

function gallerySwitcher(tabKey) {
    if (tabKey in gallery) {

        gallery[tabKey].forEach(image => {
            document.querySelector('.gallery').append(image);
        })

        document.querySelectorAll('.portfolio-image').forEach(element => {
            if (element.getAttribute('filter') != tabKey) {
                element.remove();
            }
        });
    }
}

function translatePage(language, element) {

    document.querySelector(`[data-language-key="${lang}"]`).classList.remove('checked');
    element.classList.add('checked');

    lang = language;
    setLocaleStorage('lang', lang);

    document.querySelectorAll('[data-i18]').forEach(
        element => {

            let text = i18Obj[language][element.dataset.i18];

            if (text) {
                if (element.placeholder) {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }

            }
        }
    )
}

document.querySelector("#hamburger").addEventListener("click", menuHandler);

document.querySelector("#close-menu").addEventListener("click", menuHandler);

document.querySelector(".menu-list").addEventListener("click", menuHandler);

document.querySelector("#theme-switcher").addEventListener("click", themeSwitcherHandler);

document.querySelectorAll("[data-language-key]").forEach(element => {
    element.addEventListener("click", languageSwitcherHandler);
})

document.querySelectorAll(".secondary-button").forEach(element => {
    if (element.closest(".tabs")) {
        element.addEventListener("click", gallerySwitcherHandler);
    }
})

console.log("Оценка 75 баллов. Требования к заданию выполнены в полном объеме");