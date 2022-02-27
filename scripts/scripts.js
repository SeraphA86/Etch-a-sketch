/* The function uses CSS Grid to create a grid in the selected element.
The function accepts: 
    -size(the size of the grid (AxA)),
    -element(the element that will be embedded in the grid),
    -canvas(the element in which the grid is created).*/
function gridCreator(size, element, canvas)
{
    canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;/*Creating fixed-width columns.*/
    canvas.style.gridTemplateRows = `repeat(${size}, 1fr)`;/*Creating fixed-height rows.*/

    let container = '';/*A container string that will contain all the created grid elements (all elements are added to the string
                        , and then inserted into the desired HTML element using innerHTML in order to improve performance)*/

    for(let i = 0; i < size * size; i++)
    {
       container += element;
    }
    
    canvas.innerHTML += container;
}


/*In the document, the <div id="indicator" data-down=X></div> 
element acts as an indicator of pressing and releasing the mouse button.
X=0 - the button is released.
X=1 - the button is pressed.
While the mouse button is pressed and not released,
the grid fields are filled in with the selected color.*/

/*The function of changing the color of the grid field when 
the cursor moves when the mouse button is pressed and not released.*/
function changeColor(color, elements)
{
    let down = document.querySelector('#indicator');

    down.style.backgroundColor = color;/*Changes the background color of the indicator so that when you pressed,
                                        you can also paint the grid in the desired color.*/
    elements.forEach((button)=>
    {    button.addEventListener('mouseover', ()=>
        {
            if(down.dataset.down == '1')
            {
                button.style.backgroundColor = color;
            }
        });
    });
}

const canvas = document.querySelector('.canvas');/*The element in which the grid will be created.*/
let gridElement = `<div class='pixel'></div>`;/*A single element of the grid.*/

/*Initial initialization of the grid.*/
gridCreator(8, gridElement, canvas);
changeColor('black', document.querySelectorAll('.pixel'));

const gridElementsContainer = document.querySelectorAll('.pixel');/*NodeList containing all grid elements.*/
const body = document.querySelector('body');

/*Changing the value of the indicator when the mouse button is released.*/
body.addEventListener('mouseup', ()=>
{
    document.querySelector('#indicator').dataset.down = '0';
});

/*Changing the indicator when pressing on grid elements.*/
gridElementsContainer.forEach((button)=>
{   
    let down = document.querySelector('#indicator');
    button.addEventListener('mousedown', ()=>
    {
        down.dataset.down = '1';
        button.style.backgroundColor = down.style.backgroundColor;/*The color of the grid element when pressed.*/
    });

});