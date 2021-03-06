const { of, from } = require('rxjs');
const { mergeMap, map } = require('rxjs/operators');

async function square(x){
  let result = await x * x;
  return result;
}

function minusOne(x){
  return new Promise(resolve => {
    setTimeout(resolve, 150, x - 1);
  });
}

function plusFive(x){
  return x + 5;
}


function applySequence(sequence, firstNumber){

  let obs$ = [of(firstNumber)];

  let fromPromiseOrNumber = (n) => typeof n === "number"? of(n) : from(n);

  sequence.map((fn, i) => {
    let prevSource$ = obs$[i];
    let newObs$ = prevSource$.pipe(
      map(n => fn(n)),
      mergeMap(n => fromPromiseOrNumber(n))
    );

    obs$.push(newObs$);
  });

  return obs$[obs$.length - 1];

}


let sequence = [
  square,
  minusOne,
  plusFive,
  minusOne,
  square,
  minusOne,
  square
];

let results$ = applySequence(sequence, 10);

results$.subscribe(
  console.log
);
