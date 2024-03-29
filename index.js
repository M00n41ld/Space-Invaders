const state = {
    numCell: (600 / 40) * (600 / 40),
    cells: [],
    shipPosition: 217,
    alienPosition: [
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      48,
      49,
      50,
      51,
      52,
      53,
      54,
      55,
      56
    ],
    gameOver: false,
    score: 0
  };
  
  const setupGame = (element) => {
    state.element = element;
  
    drawGrid();
  
    drawShip();
  
    drawAliens();

    drawScoreBoard()
  };
  
  const drawGrid = () => {
    const grid = document.createElement("div");
    grid.classList.add("grid");
    state.element.append(grid);
    for (let i = 0; i < state.numCell; i++) {
      const cell = document.createElement("div");

      state.cells.push(cell);
      grid.append(cell);
  
    }
  };
  
  const drawShip = () => {
    state.cells[state.shipPosition].classList.add("spaceship");
  };
  
  const controlShip = (event) => {
    if (state.gameOver) return

    if (event.code === "ArrowLeft") {
      moveShip("left");
    } else if (event.code === "ArrowRight") {
      moveShip("right");
    } else if (event.code === "Space") {
      fire();
    }
  };
  
  const moveShip = (direction) => {
    state.cells[state.shipPosition].classList.remove("spaceship");
    if (direction === "left" && state.shipPosition % 15 !== 0) {
      state.shipPosition--;
    } else if (direction === "right" && state.shipPosition % 15 !== 14) {
      state.shipPosition++;
    }
    state.cells[state.shipPosition].classList.add("spaceship");
  };
  
  const fire = () => {
    let interval;
  
    let laserPosition = state.shipPosition;

    interval = setInterval(() => {
      state.cells[laserPosition].classList.remove("laser");
  
      laserPosition-=15;
  
      if (laserPosition < 0) {
        clearInterval(interval);
        return;
      }
  
      if (state.alienPosition.includes(laserPosition)) {
        clearInterval(interval);
        state.alienPosition.splice(state.alienPosition.indexOf(laserPosition), 1)
        state.cells[laserPosition].classList.remove("aliens");
        state.cells[laserPosition].classList.add("hit");
        state.score++
        state.scoreElement.innerText = state.score
        setTimeout(() => {
          state.cells[laserPosition].classList.remove("hit")
        }, 200)  
        return
      }
  
      state.cells[laserPosition].classList.add("laser");
    }, 100);
  };
  
  const drawAliens = () => {
    state.cells.forEach((cell, index) => {
      if (cell.classList.contains('aliens')) {
        cell.classList.remove("aliens");

      }

      if (state.alienPosition.includes(index)) {
        cell.classList.add('aliens')
      }
    })
  };
  
  const play = () => {

    let interval 

    let direction = 'right' 

    interval = setInterval(() => {


        let movement

        if (direction === 'right') {
            if (atEdge('right')) {
                movement = 15 - 1
                direction = 'left'
            }  else {
                movement = 1
            }
        } else if (direction === 'left') {
            if (atEdge('left')) {
                movement = 15 + 1
                direction = 'right'
            } else {
                movement = -1
            }
        }

        state.alienPosition = state.alienPosition.map(position => position + movement)
        drawAliens()

        checkGameState(interval)
    }, 300)

    window.addEventListener("keydown", controlShip);
  };
  
const atEdge = (side) => { 
    if (side === 'left') {
        return state.alienPosition.some(position => position % 15 === 0)
    } else if (side === 'right') {
        return state.alienPosition.some(position => position % 15 === 14)
    }
}


const checkGameState = (interval) => {
   if (state.alienPosition.length === 0) {
    clearInterval(interval)

    state.gameOver = true
    drawMessage('Human wins!')

   } else if (state.alienPosition.some(position => position >= state.shipPosition)) {

    clearInterval(interval)

    state.gameOver = true

    state.cells[state.shipPosition].classList.remove('spaceship')
    state.cells[state.shipPosition].classList.add('hit')

    drawMessage('You are DEAD!')
   }
}

const drawMessage = (message) => {

    const messageElement = document.createElement('div')
    messageElement.classList.add('message')

    const h1 = document.createElement('h1')
    h1.innerText = message
    messageElement.append(h1)

    state.element.append(messageElement)  
}


const drawScoreBoard = () => {
    const heading = document.createElement('h1')
    heading.innerText = 'Space invaders'
    
    const parag1 = document.createElement("p")
    parag1.innerText = 'Press SPACE to shoot.'

    const parag2 = document.createElement("p")
    parag2.innerText = 'Press ← and → to move'

    const scoreBoard = document.createElement('div')
    scoreBoard.classList.add('scoreboard') 

    const scoreElement = document.createElement('span')
    scoreElement.innerText = state.score 

    const heading3 = document.createElement('h3')
    heading3.innerText = 'Score:'
    heading3.append(scoreElement)
    scoreBoard.append(heading, parag1, parag2, heading3)

    state.scoreElement = scoreElement 
    state.element.append(scoreBoard)
}

  const appElement = document.querySelector(".app");
    
  setupGame(appElement);
  
  play();
  