var Cell = function (y, x, image) {
    this.x = x;
    this.y =  y;
    this.image = image;
    this.html = document.createElement('img');
    this.html.src = this.image;
    this.html.style.position = 'absolute';
    this.html.style.width = scale + 'px';
    document.body.appendChild(this.html);
    this.update = function () {
        this.html.style.left = this.x * scale + 'px';
        this.html.style.top = this.y * scale + 'px';
    };
    this.checkCollision = function (cell) {
        if (!cell){
            return false;
        }
        if(cell.x === this.x && cell.y === this.y && this != cell){
            return true;
        }
        return false;
    };

    this.die = function () {
    };

    this.update();
};

var Mario = function (y, x, image) {
    var mario = this;
    Cell.call(this, y, x, image); 
    this.falling = false;
    this.input = new Input(['ArrowLeft', 'ArrowRight', 'Space']);

    this.jump = {
        power: 0,
        interval: null
    };

    this.makeJump = function () {
        mario.y--;
        mario.jump.power--;
        if (map.checkCollision(mario) != undefined) {
            mario.y++; 
        }
        if(mario.jump.power === 0){
            clearInterval(mario.jump.interval);
            mario.jump.interval = null;
            mario.falling = true;
        }
    };
    this.fall = function () {
        var old_y = mario.y; 
        check = map.checkCollision(mario);
        if (mario.jump.power === 0) {
            mario.y++;
        }
        if (map.checkCollision(mario) != undefined) {
            mario.y--; 
            mario.y = old_y;
            mario.falling = false;   
            
        }
    };
    this.die = function () {
        clearInterval(mario.interval);
        map.delete(this);
        alert("Perdu!")
    };
    this.move = function () {
        var hold_x = mario.x;
        if(mario.input.keys.ArrowLeft.isPressed || mario.input.keys.ArrowLeft.pressed){
            mario.x--;
            mario.input.keys.ArrowLeft.pressed = false;
            if (typeof map.checkCollision(mario) !== "undefined") {
                mario.x++;
                return false;
            }
        }
        if(mario.input.keys.ArrowRight.isPressed || mario.input.keys.ArrowRight.pressed){
            mario.x++;
            mario.input.keys.ArrowRight.pressed = false;
            if (typeof map.checkCollision(mario) !== "undefined") {
                mario.x--;
                return false;
            }
        }

        if(mario.input.keys.Space.pressed || mario.input.keys.Space.isPressed ){ 
            if (mario.falling == false) {
                mario.jump.power = 3;
                mario.falling = true;
                mario.jump.interval = setInterval(mario.makeJump, 100);
            }
            if (typeof map.checkCollision(mario) !== "undefined") {
                mario.y--;
                return false;
            }

            mario.input.keys.Space.pressed = false;                
        }
    };
    this.interval = setInterval(function () {
        mario.fall();
        mario.move();
        mario.update();
    }, 100);
};

var Koopa = function (y, x, image) {
    var koopa = this;
    Cell.call(this, y, x, image);
    this.falling = false;

    this.fall = {
        power: 0, 
        interval: null
    };

    this.direction = 'left';

    this.die = function() {
       clearInterval(koopa.interval);
       map.delete(this);     
   };

   this.move = function () {
    var old_x_koopa = this.x;
    if (this.direction == "left") {
        koopa.x--;
    }
    else if (this.direction == "right"){
        koopa.x++;
    }
    var coli = map.checkCollision(koopa)
    if (coli) {
        koopa.x = old_x_koopa;
        if (this.direction == "left") {
            this.direction = "right";
        }
        else if(this.direction == "right"){
            this.direction = "left";
        }
    }

    check = map.checkCollision(this);
    if (coli instanceof Mario){
        coli.die();
    }
};


this.fall = function () {
    koopa.y++;
    if (map.checkCollision(koopa)) {
        koopa.y--;
    }
};

this.interval = setInterval(function () {
    koopa.fall();
    koopa.move();
    koopa.update();
}, 200);
}


var Peach = function (y, x, image) {
    var peach = this;
    Cell.call(this, y, x, image);
};


var Input = function (keys) {
    this.keys = {};
    for (var i = 0 ; i < keys.length; i++) {
        this.keys[keys[i]] = {};
        this.keys[keys[i]].isPressed = false;
        this.keys[keys[i]].pressed = false;
    }
    var input = this;
    window.addEventListener('keydown', function(e){
        e = e || window.event;
        if (typeof input.keys[e.code] !== "undefined") {
            input.keys[e.code].isPressed = true;
            input.keys[e.code].pressed = true;
        }
    });

    window.addEventListener('keyup', function(e){
        e = e || window.event;
        if (typeof input.keys[e.code] !== "undefined") {
            input.keys[e.code].isPressed = false;

        }
    });
}

var Map = function (model) {
    this.koopa_count = 0;
    this.map = [];
    this.generateMap = function () {
        for (var y = 0; y < model.length; y++) {
            for (var x = 0; x < model[y].length; x++) {
                var letter = model[y][x];
                if (letter === "w") {
                    this.map.push(new Cell(y, x, 'herb8.png'));
                }
                if (letter === "k") {
                    this.map.push(new Koopa(y, x, 'faceK.png'));
                    this.koopa_count++;
                }
                else if (letter === "m") {
                    this.map.push(new Mario(y, x, 'mario.png'));
                }
                else if (letter === "s") {
                    this.map.push(new Cell(y, x, 'herbstand.png'));
                }
                else if (letter === "q") {
                    this.map.push(new Cell(y, x, 'herbQ.png'));
                }
                else if (letter === "l") {
                    this.map.push(new Cell(y, x, 'herbL.png'));
                }
                else if (letter === "d") {
                    this.map.push(new Cell(y, x, 'herbD.png'));
                }
                else if (letter === "p") {
                    this.map.push(new Peach(y, x, 'peach.png'));
                }
                else if (letter === "a") {
                    this.map.push(new Cell(y, x, 'arbre.png'));
                }
            }
        }
    };
    this.checkCollision = function (cell) {
        console.log(cell.checkCollision(Peach));
        for (var i = 0; i < this.map.length; i++) {
            if(cell.checkCollision(this.map[i])){
                if (cell instanceof Mario && this.map[i] instanceof Koopa) {
                    if (cell.falling) {
                        cell.y--;
                        cell.y--;
                        cell.y--;
                        this.map[i].die();
                        this.koopa_count--;   
                    }
                    else if (!cell.falling)
                        cell.die();
                }

               
                if (this.koopa_count === 0) {
                    alert("GAGNE BG!");
                    this.map.splice(this.map.indexOf(cell),1);
                    document.body.removeChild(cell.html);
                    delete cell;
                    
                }
                return this.map[i];
            }

        }
    };
    this.delete = function (cell) {
        this.map.splice(this.map.indexOf(cell),1);
        document.body.removeChild(cell.html);
        delete cell;
    };
};

var schema = [
'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
'w                                      w',
'w      k                               w',
'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwl    w',
'w                                     ww',
'w                                      w',
'w                                 w    w',
'w                              w       w',
'w                          w           w',
'w     k        s        w              w',
'wwwwwwwwwwwwwwwwl                      w',
'w                   s           k     aw',
'w            qwwwl  dwwwwwwwwwwwwwwwwwww',
'w            w                         w',
'w           qw                         w',
'w          qww                         w',
'w         qwww                         w',
'wm       qwwwwk      sk               pw',
'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww'
];
var scale = 40;
var map = new Map(schema);
map.generateMap();