let burger = document.getElementById('hamburger');
let logo = document.getElementById('logo');
let searchForm = document.getElementById('search-form');
let chipsList = document.getElementById('chips-list');
let sidebarBottom = document.getElementById('sidebar-bottom');
let sidebarWidth = document.querySelector(':root');

burger.addEventListener('click', () => {
    if (burger.classList.contains('is-active')) {
        burger.classList.remove('is-active');
        logo.classList.add('hide');
        searchForm.classList.add('hide');
        chipsList.classList.add('hide');
        sidebarBottom.classList.add('hide');

        sidebarWidth.style.setProperty('--sidebar-width', '70px');

    } else {
        burger.classList.add('is-active');
        logo.classList.remove('hide');
        searchForm.classList.remove('hide');
        sidebarBottom.classList.remove('hide');
        chipsList.classList.remove('hide');

        sidebarWidth.style.setProperty('--sidebar-width', '300px');
    }
});