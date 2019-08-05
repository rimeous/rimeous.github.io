const step = 15;
const lstep = 50;
const as = 200;
const cx = (i) => Math.cos(i * Math.PI/180);
const cy = (i) => Math.sin(i * Math.PI/180);

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

    if (r !== false) carPosition.r = r;
    if (x !== false) carPosition.x = Math.round(x);
    if (y !== false) carPosition.y = Math.round(y);

    document.querySelector(selector).style.transform = `translate(${carPosition.x}px, ${carPosition.y}px) rotate(${carPosition.r}deg)`;
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

    const direction = controlR % 360 === 0 ? 'decrease Y'
      : controlR % 360 === -90 ? 'decrease X'
        : controlR % 360 === -180 ? 'increase Y'
          : controlR % 360 === -270 ? 'increase X'
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

    const deltaX = controlR % 360 === 0 ? (controlX - this.R)
      : controlR % 360 === -90 ? (controlX)
        : controlR % 360 === -180 ? (controlX + this.R)
          : controlR % 360 === -270 ? (controlX)
            : 0
    ;

    const deltaY = controlR % 360 === 0 ? (controlY)
      : controlR % 360 === -90 ? (controlY + this.R)
        : controlR % 360 === -180 ? (controlY)
          : controlR % 360 === -270 ? (controlY - this.R)
            : 0
    ;

    const int = setInterval(() => {
      r -= step;

      this.setCarPosition(deltaX + this.R*cx(r), deltaY + this.R*cy(r), r);

      if ((Math.abs(r) - Math.abs(controlR)) >= 90) {
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
  ['Москва', [0,0,0], ['moscow', 'big', 1210,  320]],
  ['Тверь', [-198,-195,-90], ['tver', 'small', 889, 40]],
  ['Бологое', [-398, -195,-90], ['bologoe', 'small', 689, 40]],
  ['Великий Новгород', [-598,-195,-90], ['novgorod', 'small', 489, 40]],
  ['Санкт-Петербург', [-795,0,180], ['saintPetersburg', 'big', 100, 320]],
  ['Великий Новгород', [-598,195,90], ['novgorod', 'small', 467, 720]],
  ['Бологое', [-398,195,90],['bologoe', 'small', 667, 720]],
  ['Тверь', [-198,195,90], ['tver', 'small', 867, 720]],
];

stopArr.forEach((v) => {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="stopName" style="top: ${v[2][3]}px; left: ${v[2][2]}px">
      <div class="citySign ${v[2][0]} ${v[2][1]}" ></div>
<!--      <div>${v[0]}</div>-->
    </div>
    
    <div class="stop" style="transform: translate(${v[1][0]}px, ${v[1][1]}px) rotate(${v[1][2]}deg)">
      
      <div class="stantion stantion1"></div>
      <div class="stantion stantion2"></div>
      <div class="stantion stantion3"></div>
    </div>
  `);
});


let ii = 1;
for (let i = 1; i <= 24; i += 1) {
  document.body.insertAdjacentHTML("beforeend", `<div class="car car${i}" style="left: ${1000 + (ii * 50)}px"></div>`);

  const car = new Start(`.car${i}`, 100 + (ii * 50))
    .delay(i)
    .turnLeft().delay(2)
    .moveForward(4).delay(2)
    .moveForward(4).delay(2)
    .turnLeft().delay(2)
    .turnLeft().delay(2)
    .moveForward(4).delay(2)
    .moveForward(4).delay(2)
    .turnLeft().delay(2)
    .turnLeft().delay(2)
    .moveForward(4).delay(2)
    .moveForward(4).delay(2)
    .turnLeft().delay(2)
    .turnLeft().delay(2)
    .moveForward(4).delay(2)
    .moveForward(4).delay(2)
    .turnLeft()
  ;
  // //
  // console.log(car);

  if (ii === 3) {
    ii = 1;
  } else {
    ii += 1;
  }
}
