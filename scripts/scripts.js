function randomizer(min, max)/*Selecting a random number in the range [min, max)*/
{
    return Math.floor(Math.random() * (max - min)) + min;
}

function colorGenerator()
{
    let r,g,b, color;
    r = randomizer(0, 256);
    g = randomizer(0, 256);
    b = randomizer(0, 256);
    color = `rgb(${r}, ${g} ,${b})`;
    return color;
}

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


/*In the document <div id="indicator" data-down=X></div>
, the element acts as an indicator of pressing/releasing the mouse button,
as well as a color indicator for filling in the grid fields.
(Since functions have their own scopes,
to track and respond to press, movements, releasing the mouse button and changing the color palette.
(For which different functions are responsible),
a global object was needed with which functions could transfer data to each other).
X=0 - the button is released.
X=1 - the button is pressed.
While the mouse button is pressed and not released,
the grid fields are filled in with the selected color.*/

/*The function of changing the color of the grid field when 
the cursor moves when the mouse button is pressed and not released.*/
function changeColor(color, elements)
{
    let down = document.querySelector('#indicator');
    down.style.backgroundColor = color;/*The initial color that will be used to fill in the grid fields.*/
    elements.forEach((button)=>
    {    button.addEventListener('mouseover', ()=>
        {
 
            if(down.dataset.down == '1')
            {
                if(document.querySelector('#indicator').dataset.randomColor != '1')
                {
                    button.style.backgroundColor = document.querySelector('#indicator').style.backgroundColor;
                }
                else
                {
                    button.style.backgroundColor = colorGenerator();/*With each pass of the mouse, it changes the color of the grid element 
                                                                      to a completely random RGB value.*/
                }
            }
        });
    });
}

const canvas = document.querySelector('.canvas');/*The element in which the grid will be created.*/
const body = document.querySelector('body');
const pencil = document.querySelector('.pencil')
const eraser = document.querySelector('.eraser');
const rainbow = document.querySelector('.rainbow');
let gridElement = `<div class='pixel'></div>`;/*A single element of the grid.*/

/*Initial initialization of the grid.*/
gridCreator(8, gridElement, canvas);
changeColor('black', document.querySelectorAll('.pixel'));

const gridElementsContainer = document.querySelectorAll('.pixel');/*NodeList containing all grid elements.*/

/*In order not to add a lot of repetitive listening to grid elements, events
that change the color of the drawing change the color of the global indicator,
which is then referenced by the color-changing function.*/

/*An event that changes the color of the drawing.
Instructs the color change function to use random colors.*/
rainbow.addEventListener('click', ()=>
{
    document.querySelector('#indicator').dataset.randomColor = '1';
});

/*An event that changes the color of the drawing.Changes the fill color of the grid element.
Specifies the color change function not to use random colors.*/
pencil.addEventListener('click', ()=>
{
    document.querySelector('#indicator').dataset.randomColor = '0';
    document.querySelector('#indicator').style.backgroundColor = 'black';
});
/*An event that changes the color of the drawing.
Changes the fill color of the grid element to the color of the canvas.
Specifies the color change function not to use random colors.*/
eraser.addEventListener('click', ()=>
{
    document.querySelector('#indicator').dataset.randomColor = '0';
    document.querySelector('#indicator').style.backgroundColor = 'white';
});

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