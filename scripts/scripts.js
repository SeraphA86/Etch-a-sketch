function gridCreator(size, element, canvas)
{
    canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    canvas.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    let container = '';

    for(let i = 0; i < size * size; i++)
    {
       container += element;
    }
    
    canvas.innerHTML += container;
}

const canvas = document.querySelector('.canvas');
let element = `<div class='pixel'></div>`;

gridCreator(16, element, canvas);