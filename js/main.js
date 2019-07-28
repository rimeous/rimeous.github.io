var getYfromX = (x) => Math.sqrt(x*x - 100);


// move('.car')
//   .translate(10*Math.cos(0), 10*Math.sin(0))
//   .translate(10*Math.cos(0.1), 10*Math.sin(0.1))
//   .translate(10*Math.cos(0.2), 10*Math.sin(0.2))
//   .translate(10*Math.cos(0.3), 10*Math.sin(0.3))
//   .translate(10*Math.cos(0.4), 10*Math.sin(0.4))
//   .translate(10*Math.cos(0.5), 10*Math.sin(0.5))
//   // .rotate(-45)
//   .duration('1s')
//   .ease('linear')
//   .then()
//   // .to(100*Math.cos(Math.PI/2), 100*Math.sin(Math.PI/2))
//   // // .rotate(-45)
//   // .duration('2s')
//   // .ease('linear')
//   .pop()
//   .end();


// for (let i = 0; i <= Math.PI*2; i += Math.PI/10) {
//  // document.body.insertAdjacentHTML("beforeend", `
//  //    <div
//  //      style="position: absolute; width: 1px; height: 1px; top: 100px; left: 100px; background-color: red; transform: translate(${50*Math.cos(i)}px, ${50*Math.sin(i)}px)">
//  //
//  //    </div>`);
//
//   setTimeout(() => {
//     document.querySelector('.car').style.transform = `translate(${-50*Math.cos(i)+50}px, ${50*Math.sin(i)}px) rotate(${i}rad)`;
//   }, 1000*(i+1));
//
//   // move('.car')
//   //   .then(function () {
//   //     console.log('then');
//   //   })
//   //   .delay(1000)
//   //   .x(50*Math.cos(i))
//   //   .y(50*Math.sin(i))
//   //   .end();
// }

function isInteger(num) {
  return (num ^ 0) === num;
}

const step = Math.PI/10;
const lstep = 50;
const R = 100;
const as = 600;
const cx = (i) => Math.cos(i);
const cy = (i) => Math.sin(i);

let movement = 'turnleft';

let i = 0;
let li = 0;

const carPosition = {
  ".car1": {
    x: 0,
    y: 0,
    r: 0,
  },
  ".car2": {
    x: 0,
    y: 0,
    r: 0,
  },
};

const setCarPosition = (selector, x, y, r) => {

  if (r) carPosition[selector].r = r;
  if (x) carPosition[selector].x = x;
  if (y) carPosition[selector].y = y;

  console.log(selector, carPosition[selector].x);

  document.querySelector(selector).style.transform = `translate(${carPosition[selector].x}px, ${carPosition[selector].y}px) rotate(${carPosition[selector].r}rad)`;


  if (Math.abs(carPosition[selector].r) === 2*Math.PI) {
    carPosition[selector].r = 0;
    setTimeout(() => {
      document.querySelector(selector).style.transition = 'all 0ms';

      document.querySelector(selector).style.transform = `translate(${carPosition[selector].x}px, ${carPosition[selector].y}px) rotate(${carPosition[selector].r}rad)`;

      setTimeout(() => document.querySelector(selector).style.transition = '', 18)
    }, as)
  }
};

const turnLeft = (selector) => {
  const controlR = carPosition[selector].r || 0;
  const controlX = carPosition[selector].x || 0;
  const controlY = carPosition[selector].y || 0;
  let r = controlR;

  console.log(controlR/Math.PI);

  const deltaX = controlR/Math.PI === 0 ? (controlX - R)
    : controlR/Math.PI === -1 ? (controlX + R)
      : controlR/Math.PI === -0.5 ? (controlX)
        : controlR/Math.PI === -1.5 ? (controlX)
          : 0
  ;

  const deltaY = controlR/Math.PI === 0 ? (controlY)
    : controlR/Math.PI === -1 ? (controlY)
      : controlR/Math.PI === -0.5 ? (controlY + R)
        : controlR/Math.PI === -1.5 ? (controlY - R)
          : 0
  ;

  const int = setInterval(() => {
    r -= step;

    setCarPosition(selector, deltaX + R*cx(r), deltaY + R*cy(r), r);

    if ((Math.abs(r) - Math.abs(controlR)) >= Math.PI/2) {
      clearInterval(int);
    }
  }, as);

};

const moveForward = (selector, distantion  = 1) => {

  const controlR = carPosition[selector].r || 0;
  const controlX = carPosition[selector].x || 0;
  const controlY = carPosition[selector].y || 0;

  let y = controlY;
  let x = controlX;

  const direction = controlR/Math.PI === 0 ? 'decrease Y'
    : controlR/Math.PI === -1 ? 'increase Y'
      : controlR/Math.PI === -0.5 ? 'decrease X'
        : controlR/Math.PI === -1.5 ? 'increase X'
          : 0;

  console.log('direction', direction);

  const int = setInterval(() => {
    if (direction === 'decrease Y') {
      y -= lstep;
    } else if (direction === 'increase Y') {
      y += lstep;
    } else if (direction === 'decrease X') {
      x -= lstep;
    } else if (direction === 'increase X') {
      x += lstep;
    }

    setCarPosition(selector, x, y, false);

    if (
      (direction === 'decrease Y' && Math.abs(y - controlY) >= lstep*distantion)
      || (direction === 'increase Y' && Math.abs(y - controlY) >= lstep*distantion)
      || (direction === 'decrease X' && Math.abs(x - controlX) >= lstep*distantion)
      || (direction === 'increase X' && Math.abs(x - controlX) >= lstep*distantion)
    ) {
      clearInterval(int);
    }
  }, as);

};


class Start {
  constructor(selector, R = 100) {
    this.selector = selector;
    this.commands = [];
    this.processing = false;
    this.carPosition = {
      x: 0,
      y: 0,
      r: 0,
    };

    this.R = R;
  }

  setCarPosition = (x, y, r) => {
    const selector = this.selector;
    const carPosition = this.carPosition;

    if (r) carPosition.r = r;
    if (x) carPosition.x = x;
    if (y) carPosition.y = y;

    document.querySelector(selector).style.transform = `translate(${carPosition.x}px, ${carPosition.y}px) rotate(${carPosition.r}rad)`;


    // if (Math.abs(carPosition.r) === 2*Math.PI) {
    //   carPosition.r = 0;
    //   setTimeout(() => {
    //     document.querySelector(selector).style.transition = 'all 0ms';
    //
    //     document.querySelector(selector).style.transform = `translate(${carPosition.x}px, ${carPosition.y}px) rotate(${carPosition.r}rad)`;
    //
    //     setTimeout(() => {
    //       document.querySelector(selector).style.transition = ''
    //     }, 18);
    //   }, as)
    // }
  };

  nextCommand = () => {
    if (this.processing === true) {
      this.processing = false;

      if (this.commands.length) {
        const command = this.commands.shift();

        this[command[0]](...command[1]);
      }
    }
  };

  moveForward = (distantion  = 4) => {
    if (this.processing) {
      this.commands.push(['moveForward', [distantion]]);
      return this;
    } else {
      this.processing = true;
    }

    const controlR = this.carPosition.r;
    const controlX = this.carPosition.x;
    const controlY = this.carPosition.y;

    let y = controlY;
    let x = controlX;

    const direction = controlR/Math.PI === 0 ? 'decrease Y'
      : controlR/Math.PI === -1 ? 'increase Y'
        : controlR/Math.PI === -0.5 ? 'decrease X'
          : controlR/Math.PI === -1.5 ? 'increase X'
            : 0;

    const int = setInterval(() => {
      if (direction === 'decrease Y') {
        y -= lstep;
      } else if (direction === 'increase Y') {
        y += lstep;
      } else if (direction === 'decrease X') {
        x -= lstep;
      } else if (direction === 'increase X') {
        x += lstep;
      }

      this.setCarPosition(x, y, false);

      if (
        (direction === 'decrease Y' && Math.abs(y - controlY) >= lstep*distantion)
        || (direction === 'increase Y' && Math.abs(y - controlY) >= lstep*distantion)
        || (direction === 'decrease X' && Math.abs(x - controlX) >= lstep*distantion)
        || (direction === 'increase X' && Math.abs(x - controlX) >= lstep*distantion)
      ) {
        clearInterval(int);
        this.nextCommand();
      }
    }, as);

    return this;
  };

  turnLeft = () => {
    if (this.processing) {
      this.commands.push(['turnLeft', []]);
      return this;
    } else {
      this.processing = true;
    }

    const carPosition = this.carPosition;

    const controlR = carPosition.r || 0;
    const controlX = carPosition.x || 0;
    const controlY = carPosition.y || 0;
    let r = controlR;

    const deltaX = controlR/Math.PI === 0 ? (controlX - this.R)
      : controlR/Math.PI === -1 ? (controlX + this.R)
        : controlR/Math.PI === -0.5 ? (controlX)
          : controlR/Math.PI === -1.5 ? (controlX)
            : 0
    ;

    const deltaY = controlR/Math.PI === 0 ? (controlY)
      : controlR/Math.PI === -1 ? (controlY)
        : controlR/Math.PI === -0.5 ? (controlY + this.R)
          : controlR/Math.PI === -1.5 ? (controlY - this.R)
            : 0
    ;

    const int = setInterval(() => {
      r -= step;

      // r = r.toFixed(2);

      // console.log(r);

      this.setCarPosition(deltaX + this.R*cx(r), deltaY + this.R*cy(r), r);

      if ((Math.abs(r) - Math.abs(controlR)) >= Math.PI/2) {
        clearInterval(int);
        this.nextCommand();
      }
    }, as);

    return this;
  };

  delay = (timeout = 1) => {
    if (this.processing) {
      this.commands.push(['delay', [timeout]]);
    } else {
      this.processing = true;

      setTimeout(() => {
          this.nextCommand();
      }, timeout * 1000);
    }

    return this;
  }
}

const stopArr = [
  ['Москва', [0,0,0]],
  ['Тверь', [-159,-155,-90]],
  ['Бологое', [-359,-155,-90]],
  ['Великий Новгород', [-559,-155,-90]],
  ['Санкт-Петербург', [-559 - 159 ,0,0]],
  ['Великий Новгород', [-559,155,90]],
  ['Бологое', [-359,155,90]],
  ['Тверь', [-159,155,90]],
];

stopArr.forEach((v) => {
  document.body.insertAdjacentHTML("beforeend", `<div class="stop" style="transform: translate(${v[1][0]}px, ${v[1][1]}px) rotate(${v[1][2]}deg)">${v[0]}</div>`);
});


let ii = 1;
for (let i = 1; i <= 24; i += 1) {
  document.body.insertAdjacentHTML("beforeend", `<div class="car car${i}" style="left: ${1000 + (ii * 31)}px"></div>`);
  const car = new Start(`.car${i}`, 100 + (ii * 31))
    .delay(i*1.5)
    .turnLeft().delay(2)
    .moveForward(4).delay(2)
    .moveForward(4).delay(2)
    .turnLeft().delay(2)
    .turnLeft().delay(2)
    .moveForward(4).delay(2)
    .moveForward(4).delay(2)
    .turnLeft()
  ;

  console.log(car);

  if (ii === 3) {
    ii = 1;
  } else {
    ii += 1;
  }
}

// const car2 = new Start('.car2').delay(2).moveForward().turnLeft().moveForward().turnLeft().moveForward().turnLeft().moveForward().turnLeft();
// const car3 = new Start('.car3').delay(3).moveForward().turnLeft().moveForward().turnLeft().moveForward().turnLeft().moveForward().turnLeft();
// const car4 = new Start('.car4').delay(4).moveForward().turnLeft().moveForward().turnLeft().moveForward().turnLeft().moveForward().turnLeft();
// const car5 = new Start('.car5').delay(5).moveForward().turnLeft().moveForward().turnLeft().moveForward().turnLeft().moveForward().turnLeft();
// const car6 = new Start('.car6').delay(6).moveForward().turnLeft().moveForward().turnLeft().moveForward().turnLeft().moveForward().turnLeft();


// moveForward('.car2');
// turnLeft();



// setInterval(() => {
//
//   if (movement === 'turnleft') {
//     setCarPosition(R * cx(i) - 50 - li, - R * cy(i), -i);
//
//     if (i < Math.PI/2) {
//       i += step;
//     } else {
//       movement = 'moveleft';
//     }
//   }
//
//
//   if (movement === 'moveleft') {
//     if (li <= 200) {
//       setCarPosition(R*cx(i) - 50 - li, false, false);
//
//       li += lstep;
//     } else {
//       movement = 'turnleft';
//     }
//
//   }
//
// }, 200);
