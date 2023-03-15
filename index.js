const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let images = ["rock.png", "paper.png", "scissor.png"]

let sth = {
    x: 150,
    y: 0,
    vx: 0.06,
    vy: 0.06,
    type: "rock",
    img: new Image(),
}
let sth1 = {
    x: 255,
    y: 200,
    vx: 0.06,
    vy: 0.06,
    type: "paper",
    img: new Image(),
}
let sth2 = {
    x: 521,
    y: 200,
    vx: 0.06,
    vy: 0.06,
    type: "scissor",
    img: new Image(),
}

sth.img.src = images[0]
sth1.img.src = images[1]
sth2.img.src = images[2]

let objs = [sth, sth1, sth2];

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    objs.forEach(function (obj) {
        ctx.beginPath()
        ctx.drawImage(obj.img, obj.x, obj.y, 30, 30)
    })
}

let last = performance.now()

function update(dt) {
    objs.forEach(function (obj) {
        obj.y += obj.vy * dt
        obj.x += obj.vx * dt
        if (Math.random() < 0.05) {
            obj.vx = -obj.vx;
        }

        if (Math.random() < 0.05) {
            obj.vy = -obj.vy;
        }

        if (obj.y > canvas.height) {
            obj.y = canvas.height
            obj.vy *= -1
        }
        if (obj.x > canvas.width) {
            obj.x = canvas.width
            obj.vx *= -1
        }
        if (obj.y < 0) {
            obj.y = 0
            obj.vy *= -1
        }
        if (obj.x < 0) {
            obj.x = 0
            obj.vx *= -1
        }

    })
    for (let i = 0; i < objs.length; i++) {
        for (let j = 0; j < objs.length; j++) {
            if(i !== j && isCollision(objs[i],objs[j]))
            {
                if(objs[i].type ==="scissor" && objs[j].type ==="paper")
                {
                    objs[j].img.src = "scissor.png"
                    objs[j].type = "scissor"
                }
                else if(objs[i].type ==="scissor" && objs[j].type ==="rock")
                {
                    objs[i].img.src = "rock.png"
                    objs[i].type = "rock"
                }
                else if(objs[i].type ==="rock" && objs[j].type ==="paper")
                {
                    objs[i].img.src = "paper.png"
                    objs[i].type = "paper"
                }
                
                else if(objs[j].type ==="scissor" && objs[i].type ==="paper")
                {
                    objs[i].img.src = "scissor.png"
                    objs[i].type = "scissor"
                }
                else if(objs[j].type ==="scissor" && objs[i].type ==="rock")
                {
                    objs[j].img.src = "rock.png"
                    objs[j].type = "rock"
                }
                else if(objs[j].type ==="rock" && objs[i].type ==="paper")
                {
                    objs[j].img.src = "paper.png"
                    objs[j].type = "paper"
                }
            }
        }
    }
}

function gameLoop() {
    render()
    let now = performance.now()
    let dt = now - last
    last = now
    update(dt)
    let tt = checkWinner();
    if( tt !== "none") 
    {
        render()
        document.querySelector('#winner').innerHTML = tt + " won";
        document.querySelector('#winner').hidden = false;
        cancelAnimationFrame(gameLoop)
        return;
    }
    requestAnimationFrame(gameLoop)
}

gameLoop()

canvas.addEventListener('click', function (e) {
    let sth = {
        x: e.offsetX,
        y: e.offsetY,
        vx: 0.06,
        vy: 0.06,
        type: document.querySelector('#rps').value,
        img: new Image()
    }
    sth.img.src = document.querySelector('#rps').value + ".png"
    objs.push(sth)
})

function isCollision(obj1, obj2) {
    return (
        ((obj1.y <= obj2.y && obj1.y + 30 >= obj2.y) &&
        (obj1.x <= obj2.x && obj1.x + 30 >= obj2.x)) ||
        ((obj2.y <= obj1.y && obj2.y + 30 >= obj1.y) &&
        (obj2.x <= obj1.x && obj2.x + 30 >= obj1.x)) ||
        ((obj2.y <= obj1.y + 30 && obj2.y >= obj1.y) &&
        (obj2.x <= obj1.x && obj2.x + 30 >= obj1.x)) ||
        ((obj2.x <= obj1.x + 30 && obj2.x >= obj1.x) &&
        (obj2.y <= obj1.y && obj2.y + 30 >= obj1.y))
    );
}

function checkWinner()
{
    let rockWon = true;
    let paperWon = true;
    let scissorWon = true;

    for(let a of objs)
    {
        if(a.type !=="rock") rockWon = false;
    }
    for(let a of objs)
    {
        if(a.type !=="paper") paperWon = false;
    }
    for(let a of objs)
    {
        if(a.type !=="scissor") scissorWon = false;
    }

    if(rockWon) return "rock";
    if(paperWon) return "paper";
    if(scissorWon) return "scissor";

    return "none";
}