var main = document.querySelector('main');

function render() {
    main.innerHTML = getHTMLCards(data);
}

window.addEventListener('load', render);
window.addEventListener('resize', render);
