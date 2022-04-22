function randomizer(min, max)/*Selecting a random number in the range [min, max).*/
{
    return Math.floor(Math.random() * (max - min)) + min;
}
function rgbDataset(element,r,g,b)/*Writes the transmitted rgb values to the data-attributes of the DOM element.*/
{
    element.dataset.red = r;
    element.dataset.green = g;
    element.dataset.blue = b;
}

function colorGenerator(element)/*Generates random rgb values, then changes the color of the DOM element with them 
                                  and writes them to the data-attributes of the DOM element.*/
{
    let r,g,b, color;
    r = randomizer(0, 256);
    g = randomizer(0, 256);
    b = randomizer(0, 256);
    element.dataset.red = r;
    element.dataset.green = g;
    element.dataset.blue = b;
    element.style.backgroundColor = `rgb(${r}, ${g} ,${b})`;
    return color;
}

function checkBoundaries(element)/*Checks if the rgb values have gone beyond the boundaries of [0, 255].*/
{
    if(element < 0)
    {
        return 0;
    }
    else if(element > 255)
    {
        return 255;
    }

    else
    {
        return element;
    }
}

function changingLighting(mode, element)/*Illuminates or darkens the element (adding or subtracting 10 from the values of r, g, b)
                                          depending on the mode and writes the resulting rgb values to the element's attribute-data.*/
{
    let r,g,b;
    r = Number(element.dataset.red);
    g = Number(element.dataset.green);
    b = Number(element.dataset.blue);
    if(mode == 'lightening')
    {
        r += 10;
        g += 10;
        b += 10;
        
    }

    if(mode == 'shadow')
    {
        r -= 10;
        g -= 10;
        b -= 10;
    }

    r = checkBoundaries(r);
    g = checkBoundaries(g);
    b = checkBoundaries(b);

    rgbDataset(element, r, g, b)

    element.style.backgroundColor = `rgb(${r}, ${g} ,${b})`;
}

function checkInput(input)
{
    console.log(input == input, input);
    if(typeof(input) === 'number' && !isNaN(input))
    {
        if(input > 100)
        {
            return 100;
        }
        if(input < 1)
        {
            return 8;
        }
        else
        {
            return input;
        }
    }
    else
    {
        console.log(1);
        return 8;
    }
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
                        , and then inserted into the desired HTML element using innerHTML in order to improve performance).*/

    for(let i = 0; i < size * size; i++)
    {
       container += element;
    }
    
    canvas.innerHTML += container;
}

/*Changing the indicator when pressing on grid elements.*/
function pressing(elements)
{
    elements.forEach((button)=>
    {
        let down = document.querySelector('#indicator');
        button.addEventListener('mousedown', ()=>
        {
            down.dataset.down = '1';
            if(down.dataset.illumination == 'none')/*Determines whether at least one of the lighting change buttons has been pressed.*/
            {
                if(down.dataset.randomColor != '1')/*Determines whether the 'Draw with random color' button has been pressed.*/
                {
                    button.style.backgroundColor = down.style.backgroundColor;/*The color of the grid element when pressed.*/
                }
                else
                {
                    colorGenerator(button);
                }
            }
        });
    });
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
 
            if(down.dataset.down == '1')/*Determines whether the mouse button is being held down.*/
            {
                if(down.dataset.illumination != 'none')/*Determines whether at least one of the lighting change buttons has been pressed.*/
                {
                    if(down.dataset.illumination == 'lightening')
                    {
                        changingLighting('lightening', button);
                    }
                    else
                    {
                        changingLighting('shadow', button);
                    }
                }
                else
                {
                    if(down.dataset.randomColor != '1')/*Determines whether the 'Draw with random color' button has been pressed.*/
                    {
                        button.style.backgroundColor = down.style.backgroundColor;
                        rgbDataset(button,down.dataset.red, down.dataset.green, down.dataset.blue)
                    }
                    else
                    {
                        colorGenerator(button);/*With each pass of the mouse, it changes the color of the grid element 
                                                                        to a completely random RGB value.*/
                    }
                }
            }
        });
    });
}

const canvas = document.querySelector('.canvas');/*The element in which the grid will be created.*/
const body = document.querySelector('body');
const pencil = document.querySelector('.pencil')
const eraser = document.querySelector('.eraser');
const lightening = document.querySelector('.lightening');
const shadow = document.querySelector('.shadow');
const rainbow = document.querySelector('.rainbow');
const gridBorder = document.querySelector('.grid');
const gridSize = document.querySelector('.gridSize');
const gridForm = document.querySelector('.gridForm');
const text = document.querySelector("input");
let size = 8;
let gridElement = `<div class='pixel' data-red="255" data-green="255" data-blue="255" '></div>`;/*A single element of the grid.*/

/*Initial initialization of the grid.*/
gridCreator(size, gridElement, canvas);
changeColor(`rgb(0, 0 ,0)`, document.querySelectorAll('.pixel'));

const gridElementsContainer = document.querySelectorAll('.pixel');/*NodeList containing all grid elements.*/

/*In order not to add a lot of repetitive listening to grid elements, events
that change the color of the drawing change the color of the global indicator,
which is then referenced by the color-changing function.*/

/*An event that changes the color of the drawing.
Instructs the color change function to use random colors.*/
rainbow.addEventListener('click', ()=>
{
    document.querySelector('#indicator').dataset.illumination = 'none';
    document.querySelector('#indicator').dataset.randomColor = '1';
});

/*An event that changes the color of the drawing.
Changes the fill color of the grid element.
Indicates the color-change function not to use random colors.
Sets the rgb values in the data-attribute of the indicator for the subsequent possible lightening/darkening of the grid element.*/
pencil.addEventListener('click', ()=>
{
    rgbDataset(document.querySelector('#indicator'), '0', '0', '0');
    document.querySelector('#indicator').dataset.illumination = 'none';
    document.querySelector('#indicator').dataset.randomColor = '0';
    document.querySelector('#indicator').style.backgroundColor = 'rgb(0, 0, 0)';
});
/*An event that changes the color of the drawing.
Changes the fill color of the grid element to the color of the canvas.
Indicates the color-change function not to use random colors.
Sets the rgb values in the data-attribute of the indicator for the subsequent possible lightening/darkening of the grid element.*/
eraser.addEventListener('click', ()=>
{
    rgbDataset(document.querySelector('#indicator'), '255', '255', '255');
    document.querySelector('#indicator').dataset.illumination = 'none';
    document.querySelector('#indicator').dataset.randomColor = '0';
    document.querySelector('#indicator').style.backgroundColor = 'rgb(255, 255, 255)';
});

/*Changes the data-attribute illumination to 'lightening',
that specifies the color-changing functions to 'lighten' the element by adding to rgb 10.*/
lightening.addEventListener('click', ()=>
{
    document.querySelector('#indicator').dataset.illumination = 'lightening';
});

/*Changes the data-attribute illumination to 'shadow',
that specifies the color-changing functions to 'dimming' the element by subtractions from rgb 10.*/
shadow.addEventListener('click', ()=>
{
    document.querySelector('#indicator').dataset.illumination = 'shadow';
});

/*Disables/enables the display of the canvas grid
by changing the 'background-color' and 'gap' values of the  DOM element 'canvas'.*/
gridBorder.addEventListener('click', ()=>
{
    if(canvas.style.backgroundColor == 'black')
    {
        canvas.style.backgroundColor = 'white';
        canvas.style.gap = '0px';    
    }
    else
    {
        canvas.style.backgroundColor = 'black';
        canvas.style.gap = '2px'; 
    }
});

/*Changing the value of the indicator when the mouse button is released.*/
body.addEventListener('mouseup', ()=>
{
    text.value = `${size}x${size}`;
    document.querySelector('#indicator').dataset.down = '0';
});

pressing(gridElementsContainer);

gridSize.addEventListener('click',()=>
{
    text.value = '';
});

text.addEventListener('keydown', (e)=>
{
    console.log(e.code);
    if(e.code == 'Enter')
    {
        e.preventDefault();
        size = checkInput(Number(text.value));
        text.value = `${size}x${size}`;
        canvas.innerHTML = '';
        gridCreator(size, gridElement, canvas);
        console.log(document.querySelectorAll('.pixel'));
        changeColor(`rgb(0, 0 ,0)`, document.querySelectorAll('.pixel'));
        pressing(document.querySelectorAll('.pixel'));
    }
});
