let burger = document.getElementById('hamburger');
let logo = document.getElementById('logo');
let sidebarBottom = document.getElementById('sidebar-bottom');
let sidebarWidth = document.querySelector(':root');
let history = document.querySelector('.score-history');

burger.addEventListener('click', () => {
    if (burger.classList.contains('is-active')) {
        burger.classList.remove('is-active');
        logo.classList.add('hide');
        sidebarBottom.classList.add('hide');
        history.classList.add('hide');

        sidebarWidth.style.setProperty('--sidebar-width', '70px');

    } else {
        burger.classList.add('is-active');
        logo.classList.remove('hide');
        sidebarBottom.classList.remove('hide');
        history.classList.remove('hide');

        sidebarWidth.style.setProperty('--sidebar-width', '300px');
    }
});