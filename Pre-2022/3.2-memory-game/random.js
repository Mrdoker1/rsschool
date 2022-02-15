function getRandomGradient() {
    let colorOne = getRandomColor();
    let colorTwo = getRandomColor();
    let angle = Math.floor(Math.random() * 360);
    let value = `background: linear-gradient(${angle}deg, ${colorOne}, ${colorTwo});`;
    return `linear-gradient(${angle}deg, ${colorOne}, ${colorTwo})`;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}