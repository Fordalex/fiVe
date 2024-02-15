class Person {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.direction = direction;
        this.people = people;
        this.health = 100;
        this.state = 'walking';
        this.createPerson();
        this.people.push(this);
    }
    
    createPerson() {
        var person = document.createElement('div');
        person.style.position = 'absolute';
        person.style.left = `${this.x}px`;
        person.classList.add(`person-walking-${this.direction}`);
        document.body.appendChild(person);
        this.person = person;
    }

    update() {
        if (this.canMove()) {
            this.state = 'walking';
        } else {
            this.state = 'attacking';
        }

        if (this.state === 'walking') {
            this.moveForward();
        } else if (this.state === 'attacking') {
            this.attack();
        }
    }
    
    moveForward() {
        this.x += this.walkingSpeed();
        this.person.style.left = `${this.x}px`;
    }

    attack() {
        this.person.classList.remove(`person-walking-${this.direction}`);
        this.person.classList.add(`person-attacking-${this.direction}`);
    }
    
    walkingSpeed() {
        return this.direction === 'left' ? -15 : 15;
    }

    canMove() {
        for (let otherPerson of this.people) {
            if (otherPerson !== this) {
                // Assuming a simple rule where they stop if they are less than 20px apart
                if (Math.abs(this.x - otherPerson.x) <= this.width - 45) {
                    return false; // Too close to another person, cannot move
                }
            }
        }
        return true; // No one is close, can move
    }
}

var people = [];

var person = new Person(0, 0, 'right', people);
var person2 = new Person(400, 0, 'left', people);

setInterval(function () {
    people.forEach(person => {
        person.update();
    });
}, 200);
