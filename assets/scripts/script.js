document.addEventListener('DOMContentLoaded', () => {
    const createButtons = document.querySelectorAll('[data-create]');
    const gameContainer = document.getElementById('gameContainer');
    const leftStats = {
        health: 100,
        person: {
            damage: 10,
        }
    }
    const rightStats = {
        health: 100,
        person: {
            damage: 10,
        }
    }

    createButtons.forEach(button => {
        button.addEventListener('click', () => {
            var direction = button.dataset.direction;
            var damage = eval(`${direction}Stats.person.damage`);
            var weapon = button.dataset.weapon;
            new Person(direction, damage, weapon);
        });
    });

    function updateStats() {
        document.getElementById('leftHealth').innerText = `Health: ${leftStats.health}`;
        document.getElementById('rightHealth').innerText = `Health: ${rightStats.health}`
        document.getElementById('leftPersonStats').innerText = `Damage: ${leftStats.person.damage}`;
        document.getElementById('rightPersonStats').innerText = `Damage: ${rightStats.person.damage}`;
    }

    updateStats();

    class Person {
        constructor(direction, damage, weapon) {
            this.x = null;
            this.y = 0; // This doesn't do anything.
            this.width = 100;
            this.height = 100;
            this.damage = damage;
            this.weapon = weapon;

            this.direction = direction;
            this.people = people;
            this.state = 'walking';

            this.health = 100;
            this.healthBar = null;
            
            this.createPerson();
            this.createHealthBar();
            this.people.push(this);
        }
        
        createPerson() {
            this.x = this.direction === 'left' ? 1000 : 0;

            var person = document.createElement('div');
            person.style.position = 'absolute';
            person.style.left = `${this.x}px`;
            person.classList.add(`person-walking-${this.direction}`);
            gameContainer.appendChild(person);
            this.person = person;
            this.personInFrontOfYou = null;
        }

        createHealthBar() {
            var healthBar = document.createElement('div');
            healthBar.style.width = `${this.health}px`;
            healthBar.style.top = `${this.height + 10}px`;
            healthBar.style.left = `${this.x}px`;
            healthBar.classList.add('health-bar');
            gameContainer.appendChild(healthBar);
            this.healthBar = healthBar;
        }

        update() {
            if (this.canMove()) {
                this.state = 'walking';
            } else {
                this.state = 'attacking';
            }

            this.setCurrentAnimation();

            if (this.state === 'walking') {
                this.moveForward();
            } else if (this.state === 'attacking') {
                this.attack();
            }
        }

        setCurrentAnimation() {
            this.person.classList.remove(`person-walking-${this.direction}`);
            this.person.classList.remove(`person-${this.weapon}-${this.direction}`);

            if (this.state === 'walking') {
                this.person.classList.add(`person-walking-${this.direction}`);
            }

            if (this.state === 'attacking') {
                this.person.classList.add(`person-${this.weapon}-${this.direction}`);
            }
        }
        
        moveForward() {
            this.x += this.walkingSpeed();
            this.person.style.left = `${this.x}px`;
            this.healthBar.style.left = `${this.x}px`;
        }

        attack() {
            if (this.personInFrontOfYou) {
                this.personInFrontOfYou.attacked(this.damage);
            }
        }

        attacked(damage) {
            this.health -= damage;
            this.healthBar.style.width = `${this.health}px`;

            if (this.health <= 0) {
                this.die();
            }
        }
        
        walkingSpeed() {
            return this.direction === 'left' ? -15 : 15;
        }

        die() {
            this.person.remove();
            this.healthBar.remove();
            this.people.splice(this.people.indexOf(this), 1);
        }

        canMove() {
            for (let otherPerson of this.people) {
                if (otherPerson !== this && otherPerson.direction !== this.direction) {
                    if (Math.abs(this.x - otherPerson.x) <= this.width - 45) {
                        this.personInFrontOfYou = otherPerson;
                        return false;
                    }
                }
            }
            return true; // No one is close, can move
        }
    }

    var people = [];

    setInterval(function () {
        people.forEach(person => {
            person.update();
        });
    }, 200);
});