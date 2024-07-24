//every time you get a wrong match, speed increases?

//center of webpage
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;

// generate 4 pairs of random numbers
let randomNumbers1 = generateUniqueRandomNumbers(8);
let randomNumbers2 = generateUniqueRandomNumbers(8);
const board = { id: 'board', angle: 0};
let objs = [
    { id: 'one',number: randomNumbers1[0]},
    { id: 'two', number: randomNumbers2[0] },
    { id: 'three', number: randomNumbers1[1] },
    { id: 'four', number: randomNumbers2[1] },
    { id: 'five', number: randomNumbers1[2] },
    { id: 'six', number: randomNumbers2[2] },
    { id: 'seven', number: randomNumbers1[3] },
    { id: 'eight', number: randomNumbers2[3] },
    { id: 'nine', number: randomNumbers1[4] },
    { id: 'ten', number: randomNumbers2[4] },
    { id: 'eleven', number: randomNumbers1[5] },
    { id: 'twelve', number: randomNumbers2[5] },
    { id: 'thirteen', number: randomNumbers1[6] },
    { id: 'fourteen', number: randomNumbers2[6] },
    { id: 'fifteen', number: randomNumbers1[7] },
    { id: 'sixteen', number: randomNumbers2[7] }
]

let matched=[];

let numFlip = 0;
let candidate1;
let candidate2;
let score=0;
let swap=1;
let flipTime=2000;

//reset
document.getElementById('resetButton').addEventListener('click', function reset() {
  //clear all matches
  matched=[];
  //rerun RNGs
  randomNumbers1=generateUniqueRandomNumbers(8);
  randomNumbers2=generateUniqueRandomNumbers(8);
  //reset score & board angle
  score=0;
  document.getElementById('ScoreTracker').innerHTML = 0;
  board.angle=0;

  

  //reset difficulty
  rotationSpeed=0.0005;
  document.getElementById("difficulty").selectedIndex = 0;
  flipTime=2000;


  //reassign RNGs to card faces
  let i=0;
  objs.forEach((obj) => {
    styleBack(obj);
    if (i<8){
    obj.number=randomNumbers1[i];
    }
    else {
      obj.number=randomNumbers2[i-8];
    }
    i++;
  })
});

  document.getElementById('win').style.display = 'none'; //temporary
  objs.forEach((obj) => {

    // pause click event listener until flipped card logic is dealt with
    if (numFlip <= 0) {
    
      document.getElementById(obj.id).addEventListener('click', function flip() {

        // first card
        if (numFlip == 0 && !matched.includes(obj)) {
          numFlip++;

          matched.push(obj);

          candidate1 = obj;
          styleFace(obj);
        }

        // 2nd card not match
        if (numFlip == 1 && candidate1.number!=obj.number && !matched.includes(obj)) {
          numFlip++;

          matched.pop(candidate1);

          candidate2 = obj;
          styleFace(obj);

          setTimeout(noMatch, flipTime);

          setTimeout(resetNumFlips,flipTime+100); //slight delay
          document.getElementById('ScoreTracker').innerHTML = --score;
        }

        // 2nd card match
        else if (numFlip == 1 && candidate1.number==obj.number && !matched.includes(obj)) {
          numFlip++;
          
          candidate2=obj;


          swap *= -1; //"unfair mode"
          
          matched.push(candidate2);
          styleFace(obj);

          numFlip=0;
          document.getElementById('ScoreTracker').innerHTML = ++score;

        }
      })
    }
  });

if (matched.length == objs.length) {
  document.getElementById('win').innerHTML = "Congratulations! You've Won!";
}

function resetNumFlips() {
  numFlip=0;
}

function noMatch() {
  styleBack(candidate1);
  styleBack(candidate2);
}

function styleFace(obj) {
  document.getElementById(obj.id).style.backgroundColor="white";
  document.getElementById(obj.id).innerHTML = obj.number;
}

function styleBack(obj) {
  document.getElementById(obj.id).style.backgroundColor="red";
  document.getElementById(obj.id).innerHTML = "";
}


function generateUniqueRandomNumbers(count) {
  let numbers = [];
  while (numbers.length < count) {
    let randomNumber = Math.floor(Math.random() * 8) + 1;
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }
  return numbers;
}

let rotationSpeed = parseFloat(document.getElementById('difficulty').value);

//set both flip-back speed and rotation speed on difficulty toggle
document.getElementById('difficulty').addEventListener('change', function() {
  rotationSpeed = parseFloat(this.value);

  switch(parseFloat(document.getElementById('difficulty').value)) {
    case 0.0005:
      flipTime=2000;
      break;
    case 0.001:
      flipTime=1500;
      break;
    case 0.0045:
      flipTime=1000;
      break;
    case 0.009:
      flipTime=400;
      break;
  }
});

function animate() {
        const rotationAngle = board.angle * (180 / Math.PI)+90; // Convert to degrees and adjust by 90
        
        const element = document.getElementById('board');
        
        element.style.left = `${centerX-300}px`;
        element.style.top = `${centerY-300}px`;
        element.style.transform = `rotate(${rotationAngle}deg)`;

        // Update the angle each frame
        board.angle += rotationSpeed * swap;

    // next frame
    requestAnimationFrame(animate);
}

animate();


  