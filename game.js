(function()
{
    window.addEventListener("keydown",onKeyDown,false);
    window.addEventListener("keyup", onKeyUp, false);
    level = 1;
    starttime = performance.now();
    let win = null;
    let wallpositions = [];
    let doors=[]
    let dorbut=[]
    let clones = [];
    let recording = [];
    var moneys = 0;
    const maxLives = 5;
    let lives = maxLives;
    let frame = 0;  
    const cv = document.getElementById("c");
    const ctx = cv.getContext("2d");
    let but = ""
    let freaze = false 
    let bullet = null
    let bulletused = false
    let xclone = 50;
    let showgun = false
    let bonuse= 0
    let yclone = 80;
    let speedupg = false
    let defence = false
    let boughtspeed = false
    let boughtchaleng = false
    let boughtgun = false
    let boughtarmor = false
    let startTime = performance.now();
    const levelCount = 5;
    let randomLevels = false;
    const enemiesByLevel = {
        3: [{x:0, y:200, h:40, w:40}],
        5: [{x:0, y:200, h:40, w:40}]
    };
    let player = {x: 50,y: 80,}
    let gunp ={x:player.x+30 , y:player.y+10}
    var key = {
        d: false,
        a: false,
        w: false,
        s: false
    };
    var playeritems = {
        speedbelt : false , handgun:false,arrmor:false,chaleng_belt:false
    }
    var shopitems=[{name:"speed belt" , description:"it gives you 15 % boost in speed ", price:15}
        ,{name:"hand gun" , description:"alouse the player to shoote one bullet for a level", price:60},
        {name:"armor" , description:"alouse the player to take one poit of dameg before dyeing",price:35},
        {name:"chaleng belt" , description:"more money",price:40}
    ]
    var itemcount = shopitems.length
    let item_1st = Math.floor(Math.random() * itemcount); 
    let item_2st = Math.floor(Math.random() * itemcount); 
    while (item_2st == item_1st){
        item_2st = Math.floor(Math.random() * itemcount); 
    }
    let item_3st = Math.floor(Math.random() * itemcount); 
    while (item_3st == item_1st || item_3st == item_2st){
        item_3st = Math.floor(Math.random() * itemcount); 
    }
    let item_4st = Math.floor(Math.random() * itemcount); 
    while (item_4st == item_3st || item_4st == item_2st || item_4st == item_1st){
        item_4st = Math.floor(Math.random() * itemcount); 
    }

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
            case 69:
                startClone();
                break;
            case 81:
                clearclones();
                break
            case 70:
                shote();
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
    function packeys(k){
        return(k.d ? 1 : 0) + (k.a ? 2 : 0) + (k.w ? 4 : 0) + (k.s ? 8 : 0);
    }
    function unpackeys(n)
    {
        return {d: (n & 1) > 0, a: (n & 2) > 0, w: (n & 4) > 0, s: (n & 8) > 0};
    }
    function clearclones()
    {
        recording = [];
        clones = [];
    }
    function updateLives()
    {
        document.getElementById("lives").textContent = lives;
    }
    function resetRun()
    {
        level = 1;
        randomLevels = false;
        moneys = 0;
        bonuse = 0;
        speedupg = false;
        defence = false;
        showgun = false;
        bullet = null;
        bulletused = false;
        freaze = false;
        freazeenemy = false;
        boughtspeed = false;
        boughtchaleng = false;
        boughtgun = false;
        boughtarmor = false;
        playeritems = {speedbelt: false, handgun: false, arrmor: false, chaleng_belt: false};
        enemiesByLevel[3] = [{x:0, y:200, h:40, w:40}];
        enemiesByLevel[5] = [{x:0, y:200, h:40, w:40}];
        doors = [];
        dorbut = [];
        lives = maxLives;
        player.x = 50;
        player.y = 80;
        clearclones();
        startTime = performance.now();
        updateLives();
    }
    function loseLife()
    {
        lives--;
        player.x = 50;
        player.y = 80;
        bullet = null;
        clearclones();
        startTime = performance.now();

        if (lives <= 0) {
            resetRun();
            alert("You ran out of lives. The game has been reset.");
            return;
        }

        updateLives();

    }
    function gun(){
        ctx.fillStyle = "black";
        ctx.fillRect(gunp.x, gunp.y ,20, 20);
    }
    function guncheck(){
        let e = currentEnemies()[0];
        if (!e) return;
        let dx = e.x - player.x;
        let dy = e.y - player.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            gunp = { x: dx > 0 ? player.x + 40 : player.x - 20, y: player.y + 10 };
        } 
        else {
            gunp = { x: player.x + 10, y: dy > 0 ? player.y + 40 : player.y - 20 };
        }
    }
    function money()
    {
        document.getElementById("money").innerHTML = moneys;
    }
    function timer()
    {
        time = 60
        document.getElementById("timer").innerHTML = time;
        if (!document.getElementById("shop").hidden) return;
        time = 60 - Math.floor((performance.now() - startTime) / 1000);
        document.getElementById("timer").innerHTML = time;
        if (time <= 0)
        {
            loseLife();
        }
    }
    function drawClones()
    {
        ctx.fillStyle = "blue";
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < clones.length; i++)
        {
            ctx.fillRect(clones[i].pos.x, clones[i].pos.y, 40, 40);
        }
        ctx.globalAlpha = 1;
    }
    function draw() {
        ctx.clearRect(0, 0, cv.width, cv.height);
        if (win)
        {
            ctx.fillStyle = "green";
            ctx.fillRect(win.x, win.y, win.w, win.h);
        }
        drawClones();
        ctx.fillStyle = "brown";
        ctx.fillRect(player.x, player.y, 40, 40);
        for (const buttons of dorbut){
            ctx.fillStyle = buttons.presed ? "#2f7d32" : "#a32a1c";
            ctx.fillRect(buttons.x,buttons.y,buttons.w,buttons.h)
        }
        for(const door of doors){
            ctx.globalAlpha = door.open ? 0.2 : 1;
            ctx.fillStyle = "#6a5d49";
            ctx.fillRect(door.x, door.y, door.w, door.h);
            ctx.globalAlpha = 1;
        }
    }
    function enemys(enemyse){
        ctx.fillStyle = "blue";
        let taggedEnemy = null;
        let speedenemy = 0.40
        if(freazeenemy){
            speedenemy = 0
        }
        for (e of enemyse){
            if(clones.length < 1){
                if (player.x>e.x){
                    e.x= e.x + speedenemy
                }
                if(player.x<e.x){
                    e.x=e.x - speedenemy
                }   
                if (player.y>e.y){
                    e.y= e.y + speedenemy
                }
                if(player.y<e.y){
                    e.y=e.y - speedenemy
                }
                if(overlap(player,e) && defence === false){
                    taggedEnemy = e;
                }
                if(overlap(player,e) && defence){
                    defence = false
                    e.x = 0
                    e.y = 200
                }
            }
            if(clones.length > 0){
                for(c of clones){
                    if (c.pos.x>e.x){
                        e.x= e.x + speedenemy
                    }
                    if(c.pos.x<e.x){
                        e.x=e.x - speedenemy
                    }   
                    if (c.pos.y>e.y){
                        e.y= e.y + speedenemy
                    }
                    if(c.pos.y<e.y){
                        e.y=e.y - speedenemy
                    }
                }
            }
            ctx.fillRect(e.x, e.y, e.h, e.w);
        }
        if (taggedEnemy){
            taggedEnemy.x = 0;
            taggedEnemy.y = 200;
            loseLife();
        }

    }
    function move(c, keys)
    {
        let speed = 1.5
        if (speedupg){
            speed=(3*0.3)+speed
        }
        if(freaze){
            speed = 0
        }
        let oldx = c.x;
        if (keys.d) c.x += speed;
        if (keys.a) c.x -= speed;
        if (hitWall(c)) c.x = oldx;

        let oldy = c.y;
        if (keys.w) c.y -= speed;
        if (keys.s) c.y += speed;
        if (hitWall(c)) c.y = oldy;
    }
    function Openshop(){
        const shopEl = document.getElementById("shop");
        moneys = Math.round(moneys * 100) / 100;
        document.getElementById("shopMoney").textContent = "$" + moneys;
        document.getElementById("shop").hidden = false;

        document.getElementById("shopDone").addEventListener("click", () => {shopEl.hidden = true;startTime = performance.now();freaze=false;freazeenemy=false,recording=[]});
        freaze=true
        freazeenemy=true
    }
    function hitWall(c)
    {
        for (let i = 0; i < wallpositions.length; i++)
        {
            const wall = wallpositions[i];
            if (c.x < wall.x + wall.w && c.x + 40 > wall.x &&c.y < wall.y + wall.h && c.y + 40 > wall.y)
            {
                return true;
            }
        }
        for(const door of doors){
            if (!door.open && overlap(c, door)) return true;
        }
        return false;
    }
    function startClone()
    {
        clones.push({pos: {x: 50, y: 80}, run: recording});
        recording = [];
        frame = 0;
        player.x = 50;
        player.y = 80;
        for (let i = 0; i < clones.length; i++)
        {
            clones[i].pos.x = 50;
            clones[i].pos.y = 80;
        }
        startTime = performance.now();
    }
    function shopItem()
    {
        item1 = document.getElementById(`itemname1`)
        item2 = document.getElementById(`itemname2`)
        item3 = document.getElementById(`itemname3`)
        item4 = document.getElementById(`itemname4`)
        itemprice1 = document.getElementById("itemprice1")
        itemprice2 = document.getElementById("itemprice2")
        itemprice3 = document.getElementById("itemprice3")
        itemprice4 = document.getElementById("itemprice4")
        itemdesc1 = document.getElementById("itemdesc1")
        itemdesc2 = document.getElementById("itemdesc2")
        itemdesc3 = document.getElementById("itemdesc3")
        itemdesc4h = document.getElementById("itemdesc4")

        item1.innerHTML = `${shopitems[item_1st].name}`
        itemprice1.innerHTML = `${shopitems[item_1st].price}`
        itemdesc1.innerHTML = `${shopitems[item_1st].description}`

        item2.innerHTML = `${shopitems[item_2st].name}`
        itemprice2.innerHTML = `${shopitems[item_2st].price}`
        itemdesc2.innerHTML = `${shopitems[item_2st].description}`
        
        item3.innerHTML = `${shopitems[item_3st].name}`
        itemprice3.innerHTML = `${shopitems[item_3st].price}`
        itemdesc3.innerHTML = `${shopitems[item_3st].description}`
        
        item4.innerHTML = `${shopitems[item_4st].name}`
        itemprice4.innerHTML = `${shopitems[item_4st].price}`
        itemdesc4h.innerHTML = `${shopitems[item_4st].description}`
        const slotItems = [item_1st, item_2st, item_3st, item_4st];

        for(let i = 1  ; i <= 4;i++)
        {
            document.getElementById(`shopitem${i}`).addEventListener("click", () => {
                const item = shopitems[slotItems[i - 1]];

                if (item.name === "speed belt" && moneys >= shopitems[0].price && boughtspeed==false) {
                    playeritems.speedbelt = true
                    moneys = moneys-shopitems[0].price
                    boughtspeed = true
                }
                else if (item.name === "hand gun"&& moneys >= shopitems[1].price && boughtgun==false) {    
                    playeritems.handgun = true
                    moneys = moneys-shopitems[1].price
                    boughtgun=true
                }
                else if (item.name == "armor" && moneys >= shopitems[2].price && boughtarmor == false){
                    playeritems.arrmor = true
                    moneys = moneys-shopitems[2].price
                    boughtarmor = true
                }
                else if(item.name == "chaleng belt" && moneys >= shopitems[3].price && boughtchaleng == false){
                    playeritems.chaleng_belt = true
                    moneys = moneys-shopitems[3].price
                    boughtchaleng = true
                }
            });

        }
    }
    function itemefects(){
        if (playeritems.chaleng_belt){
            console.log("chaleng belt")
            playeritems.chaleng_belt = false
            bonuse= 20
        }
        else if(playeritems.arrmor){
            console.log("arrmor")
            playeritems.arrmor = false
            defence = true
        }
        else if(playeritems.handgun)
        {
            console.log("gun")
            showgun = true
            playeritems.handgun = false
        }
        else if(playeritems.speedbelt){
            console.log("speed belt")
            playeritems.speedbelt = false
            speedupg = true
        }
    }
    function overlap(c,r){
            return c.x < r.x + r.w && c.x + 40 > r.x && c.y < r.y + r.h && c.y + 40 > r.y;
    }
    function currentEnemies(){
        return enemiesByLevel[level] || [];
    }
    function updatedoor(){
        for(const door of doors) 
        {
            door.open = false;
        }

        for(const button of dorbut ){
            let presed= overlap(player,button)
            for (const clons of clones)
            {
                if (overlap(clons.pos,button))
                {
                    presed = true
                }
            
            }
            button.presed = presed;
                if(presed)
                {
                    for(const door of doors)
                    {
                        if(door.id == button.door)
                        {
                            door.open = true
                        }
                    }
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
        function clearall(){
            doors=[]
            dorbut=[]
        }
        
        function level1() {
            wallpositions = [
                {x: 0, y: 0, w: 800, h: 10},
                {x: 0, y: 470, w: 800, h: 10},
                {x: 0, y: 0, w: 10, h: 470},
                {x: 790, y: 0, w: 10, h: 470},

                {x: 100, y: 100, w: 50, h: 500},
                {x: 200, y: 0, w: 50, h: 300},
                {x: 300, y: 200, w: 50, h: 600},
                {x: 400, y: 0, w: 50, h: 300},
                {x: 500, y: 100, w: 50, h: 600},
                {x: 600, y: 0, w: 50, h: 300},
            ];
            win={x: 700, y: 400, w: 50, h: 50};
            drawWalls();
        }
        function level2() {
            wallpositions = [
                {x: 0, y: 0, w: 800, h: 10},
                {x: 0, y: 470, w: 800, h: 10},
                {x: 0, y: 0, w: 10, h: 470},
                {x: 790, y: 0, w: 10, h: 470},
            ];
            win={x: 700, y: 400, w: 50, h: 50};
            doors = [{id:1 , x:400, y:10,w:20,h:460,open:false}];
            dorbut =[{door:1 , x:100,y:200,w:50,h:50}]
            drawWalls();
        }
        function level3(){
            wallpositions = [
                {x: 0, y: 0, w: 800, h: 10},
                {x: 0, y: 470, w: 800, h: 10},
                {x: 0, y: 0, w: 10, h: 470},
                {x: 790, y: 0, w: 10, h: 470},

                {x: 100, y: 100, w: 50, h: 500},
                {x: 200, y: 0, w: 50, h: 300},
                {x: 300, y: 200, w: 50, h: 600},
                {x: 400, y: 0, w: 50, h: 300},
                
                {x: 500, y: 0, w: 50, h: 350},
            ];
            drawWalls();
            win={x: 700, y: 400, w: 50, h: 50};
            enemys(currentEnemies());
        }
        function level4(){
            wallpositions = [
                {x: 0, y: 0, w: 800, h: 10},
                {x: 0, y: 470, w: 800, h: 10},
                {x: 0, y: 0, w: 10, h: 470},
                {x: 790, y: 0, w: 10, h: 470},
            ];
            drawWalls();
            win={x: 700, y: 400, w: 50, h: 50};

            doors = [{id:1 , x:400, y:10,w:20,h:460,open:false},{id:2 , x:400, y:10,w:20,h:460,open:false}];
            dorbut =[{door:1 , x:300,y:200,w:50,h:50},{door:2 , x:200,y:300,w:50,h:50}]

        }
        function level5(){
            wallpositions = [
                {x: 0, y: 0, w: 800, h: 10},
                {x: 0, y: 470, w: 800, h: 10},
                {x: 0, y: 0, w: 10, h: 470},
                {x: 790, y: 0, w: 10, h: 470},
            ];
            drawWalls();
            win={x: 700, y: 400, w: 50, h: 50};

            doors = [{id:1 , x:550, y:10,w:20,h:460,open:false},{id:2 , x:550, y:10,w:20,h:460,open:false}];
            dorbut =[{door:1 , x:400,y:300,w:50,h:50},{door:2 , x:500,y:350,w:50,h:50}]
            enemys(currentEnemies());
        }
        if (level === 1) {
            level1();
            timer();
        }
        if (level === 2) {
            level2();
        }
        if (level === 3){
            clearall();
            level3();
        }
        if (level === 4){
            clearall();
            level4();
        }
        if(level == 5){
            clearall();
            level5();
        }
    }
    function shote(){
        const enemies = currentEnemies();
        if (!showgun || bulletused || bullet || freaze || !enemies[0]) 
        {
            return;
        }

        let e = enemies[0];
        let dx = (e.x + 20) - (gunp.x + 10);
        let dy = (e.y + 20) - (gunp.y + 10);
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist === 0)
        {
            return;
        } 

        bullet = {
            x: gunp.x + 5,
            y: gunp.y + 5,
            vx: dx / dist * 6,
            vy: dy / dist * 6
        };
        bulletused = true;
    }
    function updatebullet(){
        if (!bullet) 
        {
            return;
        }

        bullet.x += bullet.vx;
        bullet.y += bullet.vy;

        ctx.fillStyle = "orange";
        ctx.fillRect(bullet.x, bullet.y, 10, 10);

    // hit the enemy
        const enemies = currentEnemies();
        let e = enemies[0];
        if (!e) {
            bullet = null;
            return;
        }
        if (bullet.x < e.x + e.w && bullet.x + 10 > e.x &&
            bullet.y < e.y + e.h && bullet.y + 10 > e.y) {
            enemies.splice(0, 1);
            bullet = null;
            return;
        }

    // hit a wall
        for (const wall of wallpositions) {
            if (bullet.x < wall.x + wall.w && bullet.x + 10 > wall.x &&
                bullet.y < wall.y + wall.h && bullet.y + 10 > wall.y) {
                bullet = null;
                return;
            }
        }

    // hit a closed door
        for (const door of doors) {
            if (!door.open &&
                bullet.x < door.x + door.w && bullet.x + 10 > door.x &&
                bullet.y < door.y + door.h && bullet.y + 10 > door.y) {
                bullet = null;
                return;
            }
        }

    // left the canvas
        if (bullet.x < 0 || bullet.x > 800 || bullet.y < 0 || bullet.y > 480) {
            bullet = null;
        }
    }
    function gameLoop() {
        draw();
        move(player, key);
        
        if (win && player.x < win.x + win.w && player.x + 40 > win.x && player.y < win.y + win.h && player.y + 40 > win.y)
        {
            moneys += time/3 + level * 2.5 +bonuse
            Openshop();
            clearclones();
            if (randomLevels) {
                doors=[]
                dorbut=[]
                level = Math.floor(Math.random() * levelCount) + 1;
            } else if (level < levelCount) {
                level++;
            } else {
                doors=[]
                dorbut=[]
                randomLevels = true;
                level = Math.floor(Math.random() * levelCount) + 1;
            }
            bullet = null;
            bulletused = false;
            startTime = performance.now();
            player.x = 50;
            player.y = 80;
            freaze=true
        }
        recording.push(packeys(key));

        for (let i = 0; i < clones.length; i++)
        {
            let n = clones[i].run[frame] || 0;
            move(clones[i].pos, unpackeys(n));
        }
        frame++;
        requestAnimationFrame(gameLoop);
        loadlevel(level);
        timer();
        moneys = Math.round(moneys * 100) / 100;
        money();
        shopItem();
        itemefects();
        updatedoor();
        updatebullet();
        if(showgun && currentEnemies().length > 0){
            gun();
            guncheck();
        }
        updateLives();
    }

    loadlevel(level);
    gameLoop(); 

})();


// when adding a new item first add it to the list named shop items name , description , price 
//after this add it to the list named playeritems there create a tag so we know if the player got the item
//go in the function named ShopItem in there finde the eventlisener and insed it add the logic if the name == new item make his tag in playeritems true
//and after this go to the function named itemefects to add what the item is going to do

// for a new level go to load level and create a new function in there give the position for every wall and waht ever you want