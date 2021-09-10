var score = 0;

var catchables = [
  {
    name    : 'Claim Promo Token',
    desc    : '',
    src     : 'assets/Burningmoon_icon_claim_promo_token.png',
    factor  : 1.2,
    points  : 1,
    good    : true,
    probability: 0.15
  },
  {
    name    : 'Compund rewards',
    desc    : '',
    src     : 'assets/Burningmoon_icon_compund.png',
    factor  : 1.4,
    points  : 1,
    good    : true,
    probability: 0.15
  },
  {
    name    : 'Sacrifice token',
    desc    : '',
    src     : 'assets/Burningmoon_icon_sacrifice,png',
    factor  : 2,
    points  : 1,
    good    : true,
    probability: 0.1
  },
  {
    name    : 'Burningmoon Token',
    desc    : '',
    src     : 'assets/Burningmoon_icon.png',
    factor  : 1,
    points  : 1,
    good    : true,
    probability: '*'
  },


  {
    name    : 'Ask w(h)en Lambo',
    desc    : 'Loose 25% of your points',
    src     : 'assets/aerger_icon_LAMBO.png',
    factor  : 0.75,
    points  : -5,
    good    : false,
    probability: 0.2
  },
  {
    name    : 'Ask w(h)en Marketing',
    desc    : 'Loose 20% of your points',
    src     : 'assets/aerger_icon_MARKETING.png',
    factor  : 0.8,
    points  : -5,
    good    : false,
    probability: 0.2
  },
  {
    name    : 'Sell Burningmoon',
    desc    : 'Your points drop to zero, you\'ve got to start with nothing.',
    src     : 'assets/aerger_icon_SELL.png',
    factor  : 0,
    points  : 0,
    good    : false,
    probability: 0.2
  },
  {
    name    : 'Ask w(h)en Moon',
    desc    : 'Loose only one point, but its kinda ok',
    src     : 'assets/aerger_icon_MOON.png',
    factor  : 1,
    points  : -1,
    good    : false,
    probability: 0.1
  },
  {
    name    : 'FUD',
    desc    : 'No FUD! Loose 50% of your points',
    src     : 'assets/aerger_icon_FUD.png',
    factor  : 0.5,
    points  : -1,
    good    : false,
    probability: '*'
  }
]

function getGoodOnes() {
  return catchables.filter(function(obj) {
    return obj.good;
  })
}

function getBadOnes() {
  return catchables.filter(function(obj) {
    return !obj.good;
  })
}

function random(min,max){
 	return Math.round(Math.random() * (max-min) + min);
}

function randomizer(values) {
  console.log('values', values)
    var i, pickedValue,
            randomNr = Math.random(),
            threshold = 0;

    console.log('i', i)
    console.log('pickedValue', pickedValue)
    console.log('randomNr', randomNr)
    console.log('threshold', threshold)

    for (i = 0; i < values.length; i++) {
        if (values[i].probability === '*') {
            console.log('continue *')
            continue;
        }

        threshold += values[i].probability;
        console.log('threshold', threshold)
        if (threshold > randomNr) {
            pickedValue = values[i];
            console.log('pickedValue', pickedValue)
            break;
        }

        if (!pickedValue) {
            //nothing found based on probability value, so pick element marked with wildcard
            pickedValue = values.filter((value) => value.probability === '*');
                console.log('!pickedValue', pickedValue)
        }
    }

    return pickedValue;
}

function dropBox(){
  var length = random(100, ($(".game").width() - 100));
  var velocity = random(850, 10000);
  var size = random(50, 150);
  var thisBox = $("<div/>", {
    class: "box",
    style:  "width:" +size+ "px; height:"+size+"px; left:" + length+  "px; transition: transform " +velocity+ "ms linear;"
  });

  //set data and bg based on data
  thisBox.data("test", Math.round(Math.random()));
  if(thisBox.data("test")){
    var goodOnes = getGoodOnes();
    console.log('goodOnes', goodOnes)
    var catchable = randomizer(goodOnes);
    console.log('catchable', catchable)
    //var catchable = goodOnes[Math.floor(Math.random()*goodOnes.length)];


    thisBox.css({"background": "url('" + catchable.src + "')", "background-size":"contain"});
  } else {
    var badOnes = getBadOnes();
    console.log('badOnes', badOnes)
    var catchable = randomizer(badOnes);
    console.log('catchable', catchable)
    //var catchable = badOnes[Math.floor(Math.random()*badOnes.length)];

    thisBox.css({"background": "url('" + catchable.src + "')", "background-size":"contain"});
  }

  //insert gift element
  $(".game").append(thisBox);

  //random start for animation
  setTimeout(function(){
    thisBox.addClass("move");
  }, random(0, 5000) );

  //remove this object when animation is over
  thisBox.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function(event) {
    $(this).remove();
  });
}

for (i = 0; i < 10; i++) {
  dropBox();
}

$(document).on('click', '.box', function(){
  if($(this).data("test")){
    score += 1;
  } else {
    score -= 1;
  }

  $(".score").html(score);
  $(this).remove();
});

var runGame = setInterval(function(){
  for (i = 0; i < 10; i++) {
    dropBox();
  }
}, 5000);

function countdown() {
	var seconds = 60;
  function tick() {
    var counter = document.getElementById("counter");
    seconds--;
    counter.innerHTML = (seconds < 10 ? "0" : "")  + String(seconds) + "S";
    if( seconds > 0 ) {
      setTimeout(tick, 1000);
      //draw();
      //update();
    } else {
      alert("Game over");
      clearInterval(runGame);
    }
  }
	tick();
}

countdown();
