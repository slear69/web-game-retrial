(function()
{
    window.addEventListener("keydown",onKeyDown,false);
    window.addEventListener("keyup", onKeyUp, false);
    var key = {
        d: false,
        a: false,
        w: false,
        s: false
    };

    var playerx=50;
    var playery=80;
    
    function onKeyDown(event)
    {
        var keyPressed = event.keyCode;
        switch(keyPressed)
        {
            case 68:
                key.d=true;
                break;
            case 65:
                key.a=true;
                break;
            case 87:
                key.w=true;
                break;
            case 83:
                key.s=true;
                break;
        }
    }
    function onKeyUp(event)
    {
        switch(event.keyCode)
        {
            case 68:
                key.d=false;
                break;
            case 65:
                key.a=false;
                break;
            case 87:
                key.w=false;
                break;
            case 83:
                key.s=false;
                break;
        }
    }
    const cv = document.getElementById("c");
    const ctx = cv.getContext("2d");

    let x = 50;
    let y = 80;

    function draw() {
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = "light-brown";
        ctx.fillRect(x, y, 40, 40);         
    }
    function playerMovement()
    {
        tempx = x; 
        tempy = y;
        if(key.d)
        {
            
            x+=1;
            if (wallcheck() == true){
                x = tempx;
            }
        }
        if(key.a)
        {
            x-=1;
            if (wallcheck() == true){
                x = tempx;
            }
        }
        if(key.w)
        {
            y-=1;
            if (wallcheck() == true){
                y = tempy;
            }
        }
        if(key.s)
        {
            y+=1;
            if (wallcheck() == true){
                y = tempy;
            }
        }
        
    }
    
    draw();
    function wallcheck() {
            ctx.fillStyle = "green";
            ctx.fillRect(win.x, win.y, win.w, win.h);
            for (let i = 0; i < wallpositions.length; i++) {
                const wall = wallpositions[i];
                if (x < wall.x + wall.w &&x + 40 > wall.x && y < wall.y + wall.h && y + 40 > wall.y )
                {
                    return true;
                }
                else
                if (x < win.x + win.w && x + 40 > win.x && y < win.y + win.h && y + 40 > win.y)
                {
                    alert("You win!");
                    x = 50;
                    y = 80;
                }
            }
        }
    
    function loadlevel(level) {

        function drawWalls() {
            ctx.fillStyle = "black";
            for (let i = 0; i < wallpositions.length; i++) {
                const wall = wallpositions[i];
                ctx.fillStyle = "black";
                ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
            }
        }
        
        function level1() {
            wallpositions = [
                {x: 0, y: 0, w: 800, h: 10},
                {x: 0, y: 470, w: 800, h: 10},
                {x: 0, y: 0, w: 10, h: 470},
                {x: 790, y: 0, w: 10, h: 470},
                {x: 100, y: 100, w: 50, h: 200},
                {x: 200, y: 0, w: 50, h: 300},
                {x: 300, y: 200, w: 50, h: 200},
                {x: 400, y: 0, w: 50, h: 300},
                {x: 500, y: 100, w: 50, h: 200},
                {x: 600, y: 0, w: 50, h: 300},
            ];
            win={x: 700, y: 400, w: 50, h: 50};
            drawWalls();
            wallcheck();
        }

        
        if (level === 1) {
            level1();
        }
    }
    function gameLoop() {
        draw();
        playerMovement();
        requestAnimationFrame(gameLoop);
        loadlevel(1);
    }
    gameLoop();
})();