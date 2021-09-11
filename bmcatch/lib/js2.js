var BurningmoonCatch = {
  game: {
    running: false,
    repeater: {
      handle: null,
      interval: 5000
    },
    runtime: 30,
    width: 0,
    height: 0,
    spawnTime: {
      min: 0,
      max: 5000
    },
    accelerations: {
      speed: {
        increase: true,
        base: {
          min: 1000,
          max: 10000
        },
        secsLeftPercent: [
          {
            min: 0,
            max: 25,
            multiplierMin: 5,
            multiplierMax: 2,
            difficultyLevel: 4
          },
          {
            min: 26,
            max: 50,
            multiplierMin: 3,
            multiplierMax: 1.3,
            difficultyLevel: 3
          },
          {
            min: 51,
            max: 75,
            multiplierMin: 2,
            multiplierMax: 1.1,
            difficultyLevel: 2
          },
          {
            min: 76,
            max: 100,
            multiplierMin: 1,
            multiplierMax: 1,
            difficultyLevel: 1
          }
        ]
      }
    }
  },

  state: {
    handles: {
      game: null,
      score: null,
      timer: null,
      catchable: null,
      introductionModal: null,
      gameoverModal: null,
      lastlog: null,
      difficultylog: null
    },
    screen: {
      width: 0,
      height: 0
    }
  },

  user: {
    score: {
      points: 0
    },
    time: {
      passed: 0,
      left: 0
    },
    log: {
      last: '',
      full: []
    }
  },
  probabilities : [
    {
      good    : true,
      probability: 0.8
    },
    {
      good    : false,
      probability: '*'
    }
  ],

  catchables: {
    good: [
      {
        key     : 'BurningmoonToken',
        name    : 'Burningmoon Token',
        desc    : '',
        src     : 'assets/Burningmoon_icon.png',
        factor  : 1,
        points  : 1,
        good    : true,
        probability: '*',
        eventClassName: 'animated bounce'
      },
      {
        key     : 'ClaimPromoToken',
        name    : 'Claim Promo Token',
        desc    : '',
        src     : 'assets/Burningmoon_icon_claim_promo_token.png',
        factor  : 1,
        points  : 4,
        good    : true,
        probability: 0.1,
        eventClassName: 'animated pulse'
      },
      {
        key     : 'CompundRewards',
        name    : 'Compund rewards',
        desc    : '',
        src     : 'assets/Burningmoon_icon_compund.png',
        factor  : 1,
        points  : 6,
        good    : true,
        probability: 0.1,
        eventClassName: 'animated tada'
      },
      {
        key     : 'SacrificeToken',
        name    : 'SacrificeToken',
        desc    : '',
        src     : 'assets/Burningmoon_icon_sacrifice.png',
        factor  : 1.25,
        points  : 1,
        good    : true,
        probability: 0.1,
        eventClassName: 'animated flip'
      }
    ],

    bad: [
      {
        key     : 'WenLambo',
        name    : 'Ask w(h)en Lambo',
        desc    : '',
        src     : 'assets/aerger_icon_LAMBO.png',
        factor  : 1,
        points  : -3,
        good    : false,
        probability: 0.15,
        eventClassName: 'animated flash'
      },
      {
        key     : 'WenMarketing',
        name    : 'Ask w(h)en Marketing',
        desc    : '',
        src     : 'assets/aerger_icon_MARKETING.png',
        factor  : 0.8,
        points  : 0,
        good    : false,
        probability: 0.15,
        eventClassName: 'animated flash'
      },
      {
        key     : 'WenMoon',
        name    : 'Ask w(h)en Moon',
        desc    : '',
        src     : 'assets/aerger_icon_MOON.png',
        factor  : 1,
        points  : -3,
        good    : false,
        probability: 0.15,
        eventClassName: 'animated flash'
      },
      {
        key     : 'SellBurningmoon',
        name    : 'Sell Burningmoon',
        desc    : 'Drop to zero points',
        src     : 'assets/aerger_icon_SELL.png',
        factor  : 0,
        points  : 0,
        good    : false,
        probability: 0.05,
        eventClassName: 'animated hinge'
      },
      {
        key     : 'FUD',
        name    : 'FUD',
        desc    : '',
        src     : 'assets/aerger_icon_FUD.png',
        factor  : 0.8,
        points  : -1,
        good    : false,
        probability: '*',
        eventClassName: 'animated flash'
      }
    ]
  },

  initialize(initializeWith) {
    var initializeWith = initializeWith || {}
    this.state.handles.game = initializeWith.gameHandle ? $(initializeWith.gameHandle) : $('#fail')
    this.state.handles.score = initializeWith.scoreHandle ? $(initializeWith.scoreHandle) : $('#fail')
    this.state.handles.timer = initializeWith.timerHandle ? $(initializeWith.timerHandle) : $('#fail')
    this.state.handles.catchable = initializeWith.catchableHandle ? $(initializeWith.catchableHandle) : $('#fail')
    this.state.handles.catchableHandleName = initializeWith.catchableHandle
    this.state.handles.lastlog = initializeWith.lastlogHandle ? $(initializeWith.lastlogHandle) : $('#fail')
    this.state.handles.difficultylog = initializeWith.difficultyHandle ? $(initializeWith.difficultyHandle) : $('#fail')
    this.state.handles.introductionModal = initializeWith.introductionModalHandle ? $(initializeWith.introductionModalHandle) : $('#fail')
    this.state.handles.gameoverModal = initializeWith.gamoverModalHandle ? $(initializeWith.gamoverModalHandle) : $('#fail')

    this.state.screen.width = $(window).width();
    this.state.screen.height = $(window).height();

    this.game.width = this.state.handles.game.width();
    this.game.height = this.state.handles.game.height();

    $(window).resize(function() {
      BurningmoonCatch.state.screen.width = $(window).width();
      BurningmoonCatch.state.screen.height = $(window).height();

      BurningmoonCatch.game.width = BurningmoonCatch.state.handles.game.width();
      BurningmoonCatch.game.height = BurningmoonCatch.state.handles.game.height();
    });

    this.startListener()

    return this;
  },

  setDefaults() {
    console.log('setDefaults', BurningmoonCatch)
    this.state.handles.score.html('')
    this.state.handles.timer.html('')

    $(BurningmoonCatch.state.handles.catchableHandleName).remove();

    console.log('BurningmoonCatch.game.spawnTime.max', BurningmoonCatch.game.spawnTime.max)
    BurningmoonCatch.game.spawnTime.max = Math.floor((BurningmoonCatch.game.runtime/12) * 1000)
    console.log('BurningmoonCatch.game.spawnTime.max', BurningmoonCatch.game.spawnTime.max)

    this.game.running = false;
    this.user.score.points = 0;
    this.user.time.passed = 0;
    this.user.time.left = false;
    this.user.log.last = '';
    this.user.log.full = [];

    this.user.time.left = this.game.runtime;
    this.user.time.passed = 0;

    this.setTimer();
    this.setScore();
    console.log('setDefaults', BurningmoonCatch)

    return this;
  },

  introduce() {
    console.log('introduce')

    $.each(BurningmoonCatch.catchables.good, function(i, v) {
      var str = '<div>';
        str += '<img src="' + v.src + '" style="width:60px;float:left; margin-right:10px;" />';
        str += '<strong>' + v.name + '</strong>';

        if(v.points != 0 || v.points) {
          str += '<br /><small>';

          if(v.points != 0) {
            str += v.points + ' point' + ((v.points != 1 && v.points != -1) ? 's' : '');
          }

          if(v.points != 0 && v.factor != 1) {
            str += ' | ';
          }

          if(v.factor != 1) {
            str += 'Bag multiplier x' + v.factor;
          }
          str += '</small>';
        }
        str += '<br />';

        if(v.desc.length > 0) {
          str += '<br />' + v.desc + '';
        }
      str += '</div>';
      str += '<br style="clear:both" />';
      BurningmoonCatch.state.handles.introductionModal.find('.good-list').append(str);
    })

    $.each(BurningmoonCatch.catchables.bad, function(i, v) {
      var str = '<div>';
        str += '<img src="' + v.src + '" style="width:60px;float:left; margin-right:10px;" />';
        str += '<strong>' + v.name + '</strong>';

        if(v.points != 0 || v.factor != 1) {
          str += '<br /><small>';

          if(v.points != 0) {
            str += v.points + ' point' + ((v.points != 1 && v.points != -1) ? 's' : '');
          }

          if(v.points != 0 && v.factor != 1) {
            str += ' | ';
          }

          if(v.factor != 1) {
            str += 'Bag multiplier x' + v.factor;
          }
          str += '</small>';
        }

        if(v.desc.length > 0) {
          str += '<small> | ' + v.desc + '</small>';
        }
      str += '</div>';
      str += '<br style="clear:both" />';
      BurningmoonCatch.state.handles.introductionModal.find('.bad-list').append(str);
    })

    this.state.handles.introductionModal.find('.start-game-btn').on('click', function() {
        BurningmoonCatch.state.handles.introductionModal.fadeOut();
        BurningmoonCatch.startGame();
    });

    this.state.handles.gameoverModal.find('.restart-game-btn').on('click', function() {
        BurningmoonCatch.state.handles.gameoverModal.fadeOut();
        BurningmoonCatch.restartGame();
    });

    this.state.handles.introductionModal.css('height', (this.state.screen.height * 0.9));
    this.state.handles.introductionModal.fadeIn();
    return this;
  },

  setTimer() {
    console.log('setTimer')
    var secondsDisplay = this.user.time.left;
    if(secondsDisplay < 100 && secondsDisplay >= 10) {
      secondsDisplay = "0" + secondsDisplay;
    } else if(secondsDisplay < 100 && secondsDisplay < 10) {
      secondsDisplay = "00" + secondsDisplay;
    }

    this.state.handles.timer.html(secondsDisplay)
  },

  setScore() {
    console.log('setScore')
    var scoreDisplay = this.user.score.points;

    this.state.handles.score.html(scoreDisplay)
  },

  setLastlogClass(className) {
    console.log('setLastlogClass')

    BurningmoonCatch.state.handles.lastlog.removeClass().addClass(className)
    //setTimeout(function() {
    //  BurningmoonCatch.state.handles.lastlog.removeClass(className)
    //}, 1000)
  },

  setLastAction(hasClassName) {
    console.log('setLastAction', hasClassName)
    var scoreDisplay = this.user.log.last;

    if(hasClassName) {
      this.setLastlogClass(hasClassName)
    }
    /*
    if(scoreDisplay < 100 && scoreDisplay > 10) {
      scoreDisplay = "0" + scoreDisplay;
    } else if(scoreDisplay < 100 && scoreDisplay < 10) {
      scoreDisplay = "00" + scoreDisplay;
    }
    */

    this.state.handles.lastlog.html(this.user.log.last)
  },

  startGame() {
    console.log('startGame', BurningmoonCatch)

    for (i = 0; i < 10; i++) {
      this.dropCatchable();
    }

    this.writeTimer()

    this.game.repeater.handle = setInterval(function(){
      for (i = 0; i < 10; i++) {
        BurningmoonCatch.dropCatchable();
      }
    }, BurningmoonCatch.game.repeater.interval);

    this.game.running = true;
  },

  restartGame() {
    console.log('restartGame', BurningmoonCatch)

    this.setDefaults().startGame();
  },

  gameover() {
    console.log('gameover', BurningmoonCatch)

    $(BurningmoonCatch.state.handles.catchableHandleName).remove();
    this.game.running = false;

    // write infos
    this.state.handles.gameoverModal.find('.finalPoints').html(this.user.score.points)

    BurningmoonCatch.state.handles.gameoverModal.find('.stat-list-item').remove();
    $.each(BurningmoonCatch.user.log.full, function(i, v) {
      console.log('gameover v', v);
      var str = '<div class="stat-list-item">';
      str += '<div>';
      str += '<strong>';
      if(v.catchable.good) {
        str += '<i class="fa fa-arrow-up fa-fw"></i> ';
      } else {
        str += '<i class="fa fa-arrow-down fa-fw"></i> ';
      }
      str += v.catchable.name + '</strong>';
      str += '<span style="float:right">' + v.before + ' <i class="fa fa-angle-right fa-fw"></i>' + v.after + '</span>';
      str += '</div>';
      str += '<br style="clear:both" />';
      str += '</div>';

      BurningmoonCatch.state.handles.gameoverModal.find('.stat-list').append(str);
    })

    setTimeout(function() {
      BurningmoonCatch.state.handles.gameoverModal.fadeIn();
    }, 1000)
    return this;
  },

  writeTimer() {
    console.log('startTimer')

    this.user.time.left--;

    this.setTimer()

    if(this.user.time.left > 0) {
      setTimeout(function() {
        BurningmoonCatch.writeTimer()
      }, 1000);
    } else {
      this.gameover()
      clearInterval(BurningmoonCatch.game.repeater.handle);
    }
  },

  dropCatchable() {
    var isGoodOrBad = this.randomizer(this.probabilities);

    var minVelo = this.game.accelerations.speed.base.min
    var maxVelo = this.game.accelerations.speed.base.max
    var velocitys = 0
    console.log('velocity minVelo', minVelo)
    console.log('velocity maxVelo', maxVelo)
    console.log('velocity velocitys', velocitys)

    if(this.game.accelerations.speed.increase) {
      console.log('velocity !!!!!!!!!!!! INCREASE SPEED, MOOOOOOOOOOOOOORE')

      var secsLeftPercentage = Math.round((this.user.time.left / this.game.runtime) * 100);
      console.log('velocity secsLeftPercentage', secsLeftPercentage)

      //var numberBetween = numberBetween();
      var inBetweeners = this.game.accelerations.speed.secsLeftPercent.filter(function(obj) {
        return BurningmoonCatch.numberBetween(secsLeftPercentage, obj.min, obj.max)
      })[0]
      console.log('velocity inBetweeners', inBetweeners)

      if(typeof inBetweeners != 'undefined') {
        var newMin = Math.round((BurningmoonCatch.game.accelerations.speed.base.min * inBetweeners.multiplierMin), 0)
        var newMax = Math.round((BurningmoonCatch.game.accelerations.speed.base.max * inBetweeners.multiplierMax), 0)
        console.log('velocity CALC NEW newMin', BurningmoonCatch.game.accelerations.speed.base.min, newMin)
        console.log('velocity CALC NEW newMax', BurningmoonCatch.game.accelerations.speed.base.max, newMax)
        velocitys = this.randomNumber(BurningmoonCatch.game.accelerations.speed.base.min, BurningmoonCatch.game.accelerations.speed.base.max);
        console.log('velocity CALC NEW velocitys', velocitys)

        this.state.handles.timer.parent().removeClass('animated flash infinite')
        if(inBetweeners.difficultyLevel == BurningmoonCatch.game.accelerations.speed.secsLeftPercent.length) {
          this.state.handles.timer.parent().addClass('animated flash infinite')
        }

        BurningmoonCatch.state.handles.difficultylog.html(inBetweeners.difficultyLevel + '/' + BurningmoonCatch.game.accelerations.speed.secsLeftPercent.length)
      } else {
        velocitys = this.randomNumber(BurningmoonCatch.game.accelerations.speed.base.min, BurningmoonCatch.game.accelerations.speed.base.max);
        console.log('velocity FALLBACK velocitys', velocitys)
      }
    } else {
      console.log('velocity NO INCREASE IN SPEED')
      velocitys = this.randomNumber(BurningmoonCatch.game.accelerations.speed.base.min, BurningmoonCatch.game.accelerations.speed.base.max);
    }
    console.log('velocity velocitys AFTER', velocitys)


    var velocity = this.randomNumber(928, 10000);
    var size = this.randomNumber(50, 150);
    var length = this.randomNumber(0, (this.game.width - size));
    var thisBox = $("<div/>", {
      class: "box",
      style:  "width:" +size+ "px; height:"+size+"px; left:" + length+  "px; transition: transform " +velocity+ "ms linear;"
    });

    console.log("isGoodOrBad", isGoodOrBad.good);
    thisBox.data("isGoodOrBad", isGoodOrBad.good);
    if(thisBox.data("isGoodOrBad")){
      var catchable = this.randomizer(this.catchables.good);
      console.log('catchable', catchable)

      thisBox.data("key", catchable.key);
      thisBox.css({"background": "url('" + catchable.src + "')", "background-size":"contain"});
    } else {
      var catchable = this.randomizer(this.catchables.bad);
      console.log('catchable', catchable)

      thisBox.data("key", catchable.key);
      thisBox.css({"background": "url('" + catchable.src + "')", "background-size":"contain"});
    }

    //insert gift element
    this.state.handles.game.append(thisBox);

    //random start for animation
    setTimeout(function(){
      thisBox.addClass("move");
    }, BurningmoonCatch.randomNumber(BurningmoonCatch.game.spawnTime.min, BurningmoonCatch.game.spawnTime.max) );

    //remove this object when animation is over
    thisBox.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function(event) {
      $(this).remove();
    });
  },

  startListener() {
    $(document).on('click touchstart', '.box', function(){

      if(!BurningmoonCatch.game.running) {
        console.log('!this.game.running')
        $(BurningmoonCatch.state.handles.catchableHandleName).remove();
        return;
      }

      var catchableItem = this;
      var isGood = $(catchableItem).data("isGoodOrBad");
      var catchableKey = $(catchableItem).data("key");

      console.log('catchableItem isGoodOrBad', isGood)
      console.log('catchableItem key', catchableKey)

      if(typeof isGood == 'undefined' || isGood == null) {
        console.log('catchableItem err !isGood', isGood)
        // Fehler
        $(catchableItem).remove();
        return;
      }

      var item = null;
      if(isGood) {
        item = BurningmoonCatch.catchables.good.filter(function(obj) {
          return obj.key == catchableKey
        })[0];
      } else {
        item = BurningmoonCatch.catchables.bad.filter(function(obj) {
          return obj.key == catchableKey
        })[0];
      }

      if(typeof item == 'undefined' || item == null) {
        console.log('catchableItem err !item', item)
        // Fehler
        $(catchableItem).remove();
        return;
      }
      console.log('catchableItem item', item)

      var itemHasClassName = item.eventClassName || '';
      var itemGood = item.good;
      var itemFactor = parseFloat(item.factor);
      var itemPoints = parseFloat(item.points);
      var workPoints = parseFloat(BurningmoonCatch.user.score.points)

      console.log('catchableItem itemHasClassName', itemHasClassName)
      console.log('catchableItem itemGood', itemGood)
      console.log('catchableItem itemFactor', itemFactor)
      console.log('catchableItem itemPoints', itemPoints)
      console.log('catchableItem workPoints', workPoints)

      // basic
      workPoints = (workPoints + itemPoints)
      console.log('catchableItem workPoints basic', workPoints)

      // factor
      workPoints = (workPoints * itemFactor)
      console.log('catchableItem workPoints factor', workPoints)

      // roundfinal
      workPoints = Math.round(workPoints, 0)
      console.log('catchableItem workPoints roundfinal', workPoints)

      // log
      BurningmoonCatch.user.log.last = item.name
      BurningmoonCatch.user.log.full.unshift({
        before: BurningmoonCatch.user.score.points,
        after: workPoints,
        catchable: item
      })

      BurningmoonCatch.setLastAction(itemHasClassName)

      // set
      BurningmoonCatch.user.score.points = workPoints
      BurningmoonCatch.setScore();

      // Add new
      BurningmoonCatch.dropCatchable();

      console.log('')
      console.log('#####################')
      console.log('')
      $(catchableItem).remove();
      /*
      if($(catchableItem).data("test")){
        score += 1;
      } else {
        score -= 1;
      }

      var scoreDisplay = score;
      if(scoreDisplay < 100 && scoreDisplay > 10) {
        scoreDisplay = "0" + scoreDisplay;
      } else if(scoreDisplay < 100 && scoreDisplay < 10) {
        scoreDisplay = "00" + scoreDisplay;
      }

      console.log('score', score)
      console.log('scoreDisplay', scoreDisplay)
      $("#score").find('span').html(scoreDisplay);
      */
    });
  },

  numberBetween(x, min, max) {
    return x >= min && x <= max;
  },

  randomNumber(min,max) {
   	return Math.round(Math.random() * (max-min) + min);
  },

  randomizer(values) {
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
              pickedValue = values.filter((value) => value.probability === '*')[0];
                  console.log('!pickedValue', pickedValue)
          }
      }

      return pickedValue;
  }
}

/*
var score = 0;

var probability = [
  {
    good    : true,
    probability: 0.8
  },
  {
    good    : false,
    probability: '*'
  }
];

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
            pickedValue = values.filter((value) => value.probability === '*')[0];
                console.log('!pickedValue', pickedValue)
        }
    }

    return pickedValue;
}

function dropBox(){
  var whichIsIt = randomizer(probability);
  console.log('whichIsIt', whichIsIt)

  var length = random(100, ($(".game").width() - 100));
  var velocity = random(850, 10000);
  var size = random(50, 150);
  var thisBox = $("<div/>", {
    class: "box",
    style:  "width:" +size+ "px; height:"+size+"px; left:" + length+  "px; transition: transform " +velocity+ "ms linear;"
  });

  //set data and bg based on data
  thisBox.data("test", whichIsIt.good);
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

$(document).on('click touchstart', '.box', function(){
  if($(this).data("test")){
    score += 1;
  } else {
    score -= 1;
  }

  var scoreDisplay = score;
  if(scoreDisplay < 100 && scoreDisplay > 10) {
    scoreDisplay = "0" + scoreDisplay;
  } else if(scoreDisplay < 100 && scoreDisplay < 10) {
    scoreDisplay = "00" + scoreDisplay;
  }

  console.log('score', score)
  console.log('scoreDisplay', scoreDisplay)
  $("#score").find('span').html(scoreDisplay);
  $(this).remove();
});

var runGame = null;
runGame = setInterval(function(){
  for (i = 0; i < 10; i++) {
    dropBox();
  }
}, 5000);

var seconds = 0;
var gameRuntime = 60;

function countdown() {
	var seconds = gameRuntime;
  function tick() {
    var counter = $("#timer").find('span');
    seconds--;

    var secondsDisplay = seconds;
    if(secondsDisplay < 100 && secondsDisplay >= 10) {
      secondsDisplay = "0" + secondsDisplay;
    } else if(secondsDisplay < 100 && secondsDisplay < 10) {
      secondsDisplay = "00" + secondsDisplay;
    }

    counter.html(secondsDisplay);
    if( seconds > 0 ) {
      setTimeout(tick, 1000);
    } else {
      $('.box').remove();
      alert("Game over");
      clearInterval(runGame);
    }
  }
	tick();
}

countdown();
*/
