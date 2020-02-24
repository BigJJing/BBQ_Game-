window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  addFood: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d8a43WZeZROkKOS/mTprWvv", "addFood");
    "use strict";
    var com = require("common");
    cc.Class({
      extends: cc.Component,
      properties: {
        presentStrand: {
          default: null,
          type: cc.Node
        }
      },
      onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.mouseStart, this);
      },
      start: function start() {},
      mouseStart: function mouseStart(e) {
        this.presentStrand = cc.find("Canvas").getChildByName("Main Camera").getChildByName("presentStrand");
        var name = e.target.name;
        var imageName = "";
        for (var i = 0; i < name.length - 1; i++) imageName += name[i];
        var data = com.data;
        var afterSize = data.presentSize + data.foods[imageName];
        if (afterSize <= data.maxSize) {
          this.createSingleFood(imageName);
          data.strand[data.strand.length] = imageName;
          data.presentSize = afterSize;
        }
      },
      createSingleFood: function createSingleFood(imageName) {
        var that = this;
        cc.loader.loadRes(imageName, cc.SpriteFrame, function(err, spriteFrame) {
          var singleFood = new cc.Node();
          singleFood.parent = that.presentStrand;
          var sp = singleFood.addComponent(cc.Sprite);
          sp.spriteFrame = spriteFrame;
          singleFood.name = imageName;
          singleFood.scale = .5;
          singleFood.x = that.node.x;
          singleFood.y = that.node.y;
          that.presentStrand.width = that.presentStrand.width < singleFood.width ? singleFood.width : that.presentStrand.width;
          var canvas = cc.view.getFrameSize();
          var x = -that.node.x;
          if (6 == com.data.foods[imageName]) var y = -200; else var y = 100 - that.node.y - singleFood.height / 2 - 35 * (6 - com.data.presentSize - com.data.foods[imageName]);
          var action = cc.spawn(cc.moveBy(.5, x, y), cc.scaleTo(.5, 1, 1)).easing(cc.easeCubicActionOut());
          singleFood.runAction(action);
        });
      }
    });
    cc._RF.pop();
  }, {
    common: "common"
  } ],
  all: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7138cbas9pCR67b4jxuefpv", "all");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        isSelect: false,
        paprika: {
          default: null,
          type: cc.Node
        },
        cuminPowder: {
          default: null,
          type: cc.Node
        },
        oil: {
          default: null,
          type: cc.Node
        }
      },
      onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.mouseStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.mouseEnd, this);
      },
      start: function start() {},
      mouseStart: function mouseStart(e) {
        if (0 == this.node.opacity) {
          this.reNewAll();
          this.node.opacity = 255;
          cc.game.canvas.style.cursor = "";
        } else {
          this.reNewAll();
          var target = e.target || e.currentTarget;
          "seasoning_paprika" == target.name ? cc.game.canvas.style.cursor = "url('/res/import/09/09970fcf-9605-4983-a799-e0df3ce2cb2a.png'),auto" : "seasoning_CuminPowder" == target.name ? cc.game.canvas.style.cursor = "url('/res/import/07/075e9abc-a512-4e7b-8bea-bb93b30f5557.png'),auto" : "seasoning_oli" == target.name && (cc.game.canvas.style.cursor = "url('/res/import/32/3299655d-108c-4ab3-8e8a-dedf36a369c5.png'),auto");
          this.isSelect = true;
          console.log(this.node);
          this.node.opacity = 0;
        }
      },
      mouseEnd: function mouseEnd() {},
      reNewAll: function reNewAll() {
        this.paprika.opacity = 255;
        this.cuminPowder.opacity = 255;
        this.oil.opacity = 255;
        this.paprika.getComponent("all").isSelect = false;
        this.cuminPowder.getComponent("all").isSelect = false;
        this.oil.getComponent("all").isSelect = false;
      }
    });
    cc._RF.pop();
  }, {} ],
  audioManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8db0fdsih5C6L/tB45p6BYV", "audioManager");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        bgMusic: {
          url: cc.AudioClip,
          default: null
        },
        barbecue_sound: {
          url: cc.AudioClip,
          default: null
        },
        general_click: {
          url: cc.AudioClip,
          default: null
        },
        prop_click: {
          url: cc.AudioClip,
          default: null
        },
        guest_coming: {
          url: cc.AudioClip,
          default: null
        },
        money_collect: {
          url: cc.AudioClip,
          default: null
        },
        game_over: {
          url: cc.AudioClip,
          default: null
        }
      },
      onLoad: function onLoad() {
        cc.game.addPersistRootNode(this.node);
      },
      playBgMusic: function playBgMusic() {
        var userData = JSON.parse(cc.sys.localStorage.getItem("userData"));
        if (userData) {
          var musicLevel = userData.setting.bgMusic;
          this.bgMusicChannel = cc.audioEngine.play(this.bgMusic, true, musicLevel);
        } else this.bgMusicChannel = cc.audioEngine.play(this.bgMusic, true, .5);
      },
      stopBgMusic: function stopBgMusic() {
        if (void 0 !== this.bgMusicChannel) {
          cc.audioEngine.stop(this.bgMusicChannel);
          this.bgMusicChannel = void 0;
        }
      },
      setBgVolume: function setBgVolume(num) {
        cc.audioEngine.setVolume(this.bgMusicChannel, num);
        var userData = JSON.parse(cc.sys.localStorage.getItem("userData"));
        userData.setting.bgMusic = num;
        cc.sys.localStorage.setItem("userData", JSON.stringify(userData));
      },
      getBgVolume: function getBgVolume() {
        return cc.audioEngine.getVolume(this.bgMusicChannel);
      },
      setEffectVolume: function setEffectVolume(num) {
        var userData = JSON.parse(cc.sys.localStorage.getItem("userData"));
        userData.setting.soundEffect = num;
        cc.sys.localStorage.setItem("userData", JSON.stringify(userData));
      },
      getEffectVolume: function getEffectVolume() {
        var userData = JSON.parse(cc.sys.localStorage.getItem("userData"));
        return userData.setting.soundEffect;
      },
      playBarbecueSound: function playBarbecueSound() {
        var soundLevel = this.getEffectVolume();
        this.barbecueMusicChannel = cc.audioEngine.play(this.barbecue_sound, true, soundLevel);
      },
      stopBarbecueSound: function stopBarbecueSound() {
        if (void 0 !== this.barbecueMusicChannel) {
          cc.audioEngine.stop(this.barbecueMusicChannel);
          this.barbecueMusicChannel = void 0;
        }
      },
      playGeneralClick: function playGeneralClick() {
        var soundLevel = this.getEffectVolume();
        cc.audioEngine.play(this.prop_click, false, soundLevel);
      },
      playPropClick: function playPropClick() {
        var soundLevel = this.getEffectVolume();
        cc.audioEngine.play(this.general_click, false, soundLevel);
      },
      playGuestComing: function playGuestComing() {
        var soundLevel = this.getEffectVolume();
        cc.audioEngine.play(this.guest_coming, false, soundLevel);
      },
      playMoneyCollect: function playMoneyCollect() {
        var soundLevel = this.getEffectVolume();
        cc.audioEngine.play(this.money_collect, false, soundLevel);
      },
      playGameOver: function playGameOver() {
        var soundLevel = this.getEffectVolume();
        cc.audioEngine.play(this.game_over, false, soundLevel);
      }
    });
    cc._RF.pop();
  }, {} ],
  beginGame: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "055d8Z1F7lGDrM9J8Qw+iTH", "beginGame");
    "use strict";
    var com = require("common");
    cc.Class({
      extends: cc.Component,
      properties: {
        enterBtn: {
          default: null,
          type: cc.Button
        },
        nameing: {
          default: null,
          type: cc.Prefab
        }
      },
      onLoad: function onLoad() {
        var userData = JSON.parse(cc.sys.localStorage.getItem("userData"));
        console.log(userData);
        if (null == userData) {
          var name = cc.instantiate(this.nameing);
          this.node.addChild(name);
          var input = name.children[2];
          input.on("editing-return", this.doNaming, name);
        } else {
          var dayStr = "\u7b2c" + userData.day + "\u5929";
          this.enterBtn.node.children[0].children[0].getComponent(cc.Label).string = dayStr;
        }
        this.enterBtn.node.on("click", this.enter, this);
        this.AudioPlayer = cc.find("Audio").getComponent("audioManager");
        console.log(this.AudioPlayer);
        this.AudioPlayer.playBgMusic();
      },
      start: function start() {},
      enter: function enter(e) {
        this.AudioPlayer = cc.find("Audio").getComponent("audioManager");
        this.AudioPlayer.playGeneralClick();
        var userData = JSON.parse(cc.sys.localStorage.getItem("userData"));
        com.data.money = userData.money;
        cc.director.loadScene("SenceCook");
      },
      doNaming: function doNaming(e) {
        e.placeholder = '\u6309 "enter" \u786e\u8ba4';
        if ("" == e.string) {
          e.placeholder = "\u540d\u5b57\u4e0d\u80fd\u4e3a\u7a7a\u54df";
          e.placeholderFontColor = new cc.Color().fromHEX("#762727");
        } else {
          var userData = {
            player: e.string,
            day: 1,
            money: 10,
            setting: {
              bgMusic: .5,
              soundEffect: .5
            }
          };
          cc.sys.localStorage.setItem("userData", JSON.stringify(userData));
          this.destroy();
        }
      }
    });
    cc._RF.pop();
  }, {
    common: "common"
  } ],
  characters: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c1f83j3Ty1PKaVjyQ1rgjft", "characters");
    "use strict";
    module.exports = {
      data: {
        character: [ {
          name: "Abel",
          type: "kind",
          appearance: "\u7565\u663e\u9893\u5e9f\u7684\u9ec4\u5934\u53d1\u7537\u4eba"
        }, {
          name: "catGirl",
          type: "kind",
          appearance: "\u62b1\u7740\u732b\u7684\u5c0f\u5973\u5b69"
        }, {
          name: "candy",
          type: "kind",
          appearance: "\u7a7f\u7740\u6b63\u5f0f\u7684\u5973\u751f"
        }, {
          name: "littleAngal",
          type: "kind",
          appearance: "\u53ef\u7231\u7684\u84dd\u88d9\u5b50\u5973\u5b69"
        }, {
          name: "sugar",
          type: "kind",
          appearance: "\u84dd\u88d9\u5b50\u5927\u5973\u5b69"
        } ],
        show: function show(guests) {
          var nameArr = [];
          var characterArr = [];
          for (var i = 0; i < guests.length; i++) {
            var str = JSON.stringify(guests[i]);
            "{}" != str && nameArr.push(guests[i].guest.name);
          }
          var len = this.character.length;
          for (var _i = 0; _i < len; _i++) -1 == nameArr.indexOf(this.character[_i].name) && characterArr.push(this.character[_i]);
          var num = Math.floor(Math.random() * characterArr.length);
          return characterArr[num];
        },
        findByName: function findByName(name) {
          for (var i = 0; i < this.character.length; i++) if (this.character[i].name == name) return this.character[i];
          console.err("can't find" + name);
          return false;
        }
      }
    };
    cc._RF.pop();
  }, {} ],
  character: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8bf09OITupEjphMjvBOU2cf", "character");
    "use strict";
    var characters = require("data/characters");
    var foodMenu = require("data/menu");
    var dialog = require("data/dialog");
    var com = require("common");
    cc.Class({
      extends: cc.Component,
      properties: {
        position: [],
        dishes: {
          default: null,
          type: cc.Node
        },
        order: {
          default: null,
          type: cc.Node
        },
        dialogBtn: {
          default: null,
          type: cc.Node
        },
        characters: {
          default: null,
          type: cc.Node
        },
        money: {
          default: null,
          type: cc.Label
        },
        account: {
          default: null,
          type: cc.Prefab
        }
      },
      onLoad: function onLoad() {
        this.AudioPlayer = cc.find("Audio").getComponent("audioManager");
        com.data.isStopGuestTimer = true;
        var children = this.dishes.children;
        for (var i = 0; i < children.length; i++) this.position.push(children[i].x);
        if (null == com.data.guest) {
          com.data.guestsNum = 1;
          var component = this;
          component.scheduleOnce(function() {
            this.AudioPlayer.playGuestComing();
            this.showGuest();
          }, 2);
        } else {
          var guests = com.data.guest.children;
          while (0 != guests.length) {
            var presentNode = guests[0];
            presentNode.childrenCount > 0 && "talk" == presentNode.children[0].name && presentNode.on(cc.Node.EventType.TOUCH_START, this.guestTalk, this);
            presentNode.parent = this.node;
          }
          var addNum = com.data.guestsNum - this.node.childrenCount;
          if (addNum > 0) for (var _i = 0; _i < addNum; _i++) this.showGuest();
          this.leave();
          this.updateMood();
        }
      },
      start: function start() {},
      onDestroy: function onDestroy() {
        com.data.isStopGuestTimer = false;
      },
      changeMood: function changeMood(node, guestMood) {
        guestMood > 0 && guestMood <= 30 && "mood_2" != node.name ? cc.loader.loadRes("mood/2", cc.SpriteFrame, function(err, spriteFrame) {
          node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        }) : guestMood > 30 && guestMood <= 60 && "mood_1" != node.name && cc.loader.loadRes("mood/1", cc.SpriteFrame, function(err, spriteFrame) {
          node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
      },
      showGuest: function showGuest() {
        var that = this;
        var character = characters.data.character;
        var person = characters.data.show(com.data.guests);
        var guestNum = com.data.getGuestPosition(person);
        if (false !== guestNum) {
          var imageName = "character/" + person.name;
          cc.loader.loadRes(imageName, cc.SpriteFrame, function(err, spriteFrame) {
            var node = new cc.Node();
            var sp = node.addComponent(cc.Sprite);
            sp.spriteFrame = spriteFrame;
            node.name = person.name;
            node.scaleX = .4;
            node.scaleY = .9;
            node.parent = that.node;
            node.x = that.position[guestNum];
            node.anchorY = 0;
            cc.loader.loadRes("talk", cc.SpriteFrame, function(err, spriteFrame) {
              var talkNode = new cc.Node();
              var tsp = talkNode.addComponent(cc.Sprite);
              tsp.spriteFrame = spriteFrame;
              talkNode.name = "talk";
              talkNode.scaleX = 2;
              talkNode.scaleY = 2;
              talkNode.anchorY = .5;
              node.addChild(talkNode);
              talkNode.x = 150;
              talkNode.y = 250;
              node.on(cc.Node.EventType.TOUCH_START, that.guestTalk, that);
            });
            cc.loader.loadRes("mood/0", cc.SpriteFrame, function(err, spriteFrame) {
              var moodNode = new cc.Node();
              var msp = moodNode.addComponent(cc.Sprite);
              msp.spriteFrame = spriteFrame;
              moodNode.name = "mood_0";
              moodNode.scaleX = 2;
              moodNode.scaleY = 2;
              moodNode.anchorY = .5;
              node.addChild(moodNode);
              moodNode.y = node.height + 70;
            });
          });
        }
      },
      guestTalk: function guestTalk(e) {
        this.AudioPlayer.playPropClick();
        var node = e.target;
        var name = node.name;
        var guest = characters.data.findByName(name);
        var food = foodMenu.data.getFood();
        var talk = dialog.data.getGreeting(guest.type);
        var number = dialog.data.getNumber(guest.type);
        var guestTalk = "";
        guestTalk += talk[0];
        guestTalk += food.chinese;
        talk.length > 1 && (guestTalk += talk[1]);
        guestTalk += number[1];
        this.dialogBtn.getComponent("dialogBtn").mouseStart();
        var label = this.order.getComponent(cc.Label);
        label.string = guestTalk;
        this.order.parent.opacity = 255;
        this.dialogBtn.getComponent(cc.Button).interactable = true;
        var guestIndex = com.data.findGuestByName(name);
        com.data.guests[guestIndex].food = food;
        com.data.guests[guestIndex].number = number[0];
        com.data.guests[guestIndex].isTalk = true;
        com.data.saveDialog(guest.appearance, guestTalk);
        for (var i = 0; i < node.childrenCount; i++) "talk" == node.children[i].name && node.children[i].destroy();
        node.off(cc.Node.EventType.TOUCH_START, this.guestTalk, this);
        var dialogBtn = this.dialogBtn.getComponent("dialogBtn");
        dialogBtn.orderGuest = com.data.guests[guestIndex];
      },
      guestEvaluation: function guestEvaluation(guest) {
        guest.isTalk = true;
        "tasteGood" == guest.evaluation && com.data.praiseNum++;
        var guestTalk = dialog.data.getEvaluation(guest.guest.type, guest.evaluation);
        var label = this.order.getComponent(cc.Label);
        label.string = guestTalk;
        this.order.parent.opacity = 255;
        this.dialogBtn.getComponent(cc.Button).interactable = true;
        var dialogBtn = this.dialogBtn.getComponent("dialogBtn");
        dialogBtn.evaluationGuest = guest;
      },
      findLeaveGuest: function findLeaveGuest() {
        for (var j = 0; j < com.data.guests.length; j++) {
          var str = JSON.stringify(com.data.guests[j]);
          if ("{}" !== str) {
            var node;
            for (var i = 0; i < this.node.childrenCount; i++) this.node.children[i].name == com.data.guests[j].guest.name && (node = this.node.children[i]);
            var guestMood = com.data.guests[j].mood;
            if (guestMood <= 0 && node && false == com.data.guests[j].isTalk) {
              com.data.leaveGuest.push(com.data.guests[j]);
              this.leave();
            } else if (node) {
              var mood;
              for (var _i2 = 0; _i2 < node.childrenCount; _i2++) "talk" != node.children[_i2].name && (mood = node.children[_i2]);
              this.changeMood(mood, guestMood);
              com.data.guests[j].mood -= 5;
            }
          }
        }
      },
      leave: function leave() {
        var _this = this;
        while (0 != com.data.leaveGuest.length) {
          var leaveOne = com.data.leaveGuest[0];
          var allGuests = this.node.children;
          var _loop = function _loop(_i3) {
            if (allGuests[_i3].name == leaveOne.guest.name) {
              action = cc.moveBy(.5, 0, -300).easing(cc.easeCubicActionOut());
              allGuests[_i3].runAction(action);
              timer = setTimeout(function() {
                allGuests[_i3].destroy();
                clearTimeout(timer);
              }, 500);
              com.data.guestsNum--;
            }
          };
          for (var _i3 = 0; _i3 < allGuests.length; _i3++) {
            var action;
            var timer;
            _loop(_i3);
          }
          var index = com.data.findGuestByName(leaveOne.guest.name);
          if (false === index) console.log("error: can't find leave guest named" + leaveOne.guest.name); else {
            for (var i = 0; i < com.data.dialogs.length; i++) com.data.dialogs[i].appearance == com.data.guests[index].guest.appearance && com.data.dialogs.splice(i, 1);
            for (var j = 0; j < this.dishes.children[index].childrenCount; j++) this.dishes.children[index].children[j].destroy();
            this.AudioPlayer.playMoneyCollect();
            var money = com.data.money;
            var endMoney = parseFloat(com.data.guests[index].money) + money;
            var that = this;
            var moneyTimer = setInterval(function() {
              if (money + 1 < endMoney) {
                money += 1;
                that.money.string = money.toFixed(2) + "";
              } else if (money + 1 > endMoney && money < endMoney) {
                money += .1;
                that.money.string = money.toFixed(2) + "";
              } else {
                clearInterval(moneyTimer);
                com.data.money = parseFloat(endMoney);
                that.money.string = parseFloat(endMoney).toFixed(2) + "";
              }
            }, 100);
            com.data.guests[index] = {};
            com.data.leaveGuest.splice(0, 1);
            0 === com.data.guestsNum && com.data.timeForGame > 0 ? setTimeout(function() {
              _this.showGuest();
              com.data.guestsNum++;
              _this.AudioPlayer = cc.find("Audio").getComponent("audioManager");
              _this.AudioPlayer.playGuestComing();
            }, 500) : 0 === com.data.guestsNum && com.data.timeForGame <= 0 && setTimeout(function() {
              _this.AudioPlayer.stopBarbecueSound();
              _this.AudioPlayer.playGameOver();
              com.data.clearTime();
              var account = cc.instantiate(_this.account);
              account.parent = _this.node.parent.parent;
              var children = account.children;
              var userData = JSON.parse(cc.sys.localStorage.getItem("userData"));
              var dayNum = children[1].children[1].getComponent(cc.Label);
              dayNum.string = userData.day;
              var total = children[3].getComponent(cc.Label);
              total.string = (com.data.money - userData.money).toFixed(2);
              var profit = children[5].getComponent(cc.Label);
              var profitMoney = (com.data.money - userData.money - 10).toFixed(2);
              profit.string = profitMoney;
              children[5].color = profitMoney >= 0 ? new cc.Color().fromHEX("#A46556") : new cc.Color().fromHEX("#7EA456");
              var praise = children[6].getComponent(cc.Label);
              praise.string = com.data.praiseNum;
              userData.day++;
              com.data.money -= 10;
              userData.money = com.data.money;
              cc.sys.localStorage.setItem("userData", JSON.stringify(userData));
              children[7].on("click", function() {
                this.AudioPlayer.playPropClick();
                com.data.restoreData();
                cc.director.loadScene("SenceEnter");
              }, _this);
            }, 1e3);
          }
        }
      },
      updateMood: function updateMood() {
        var guests = com.data.guests;
        for (var i = 0; i < guests.length; i++) if ("{}" !== JSON.stringify(guests[i])) {
          var mood = guests[i].mood;
          for (var j = 0; j < this.node.childrenCount; j++) {
            var thisGuest = this.node.children[j];
            if (thisGuest.name == guests[i].guest.name) for (var k = 0; k < thisGuest.childrenCount; k++) "talk" != thisGuest.children[k].name && this.changeMood(thisGuest.children[k], mood);
          }
        }
      }
    });
    cc._RF.pop();
  }, {
    common: "common",
    "data/characters": void 0,
    "data/dialog": void 0,
    "data/menu": void 0
  } ],
  common: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "61a47BHB31C24nj582GHyVC", "common");
    "use strict";
    module.exports = {
      data: {
        timeForGame: 200,
        timeForGameDisplay: "00:00",
        money: 0,
        praiseNum: 0,
        strand: [],
        strands: [],
        strandsInGrill: [],
        presentSize: 0,
        basket: null,
        foodPlace: null,
        presentStrand: null,
        guest: null,
        timer: null,
        timeShow: 0,
        guests: [ {}, {}, {}, {} ],
        guestsNum: 0,
        leaveGuest: [],
        isStopGuestTimer: false,
        dialogs: [],
        maxSize: 6,
        foods: {
          sausage: 6,
          potato: 2,
          mutton: 6
        },
        maxBasketSize: 3,
        maxSameFoodInBasket: 5,
        settings: {
          timeForGame: 10,
          timeForGuest: 100
        },
        clearTime: function clearTime() {
          console.log("clear Interval");
          clearInterval(this.timer);
        },
        changeAllInCommon: function changeAllInCommon() {
          this.timeShow += 5;
          for (var i = 0; i < this.strandsInGrill.length; i++) "back" == this.strandsInGrill[i].selectedFace ? this.strandsInGrill[i].back += 5 : this.strandsInGrill[i].front += 5;
        },
        changeMood: function changeMood() {
          for (var j = 0; j < this.guests.length; j++) {
            var str = JSON.stringify(this.guests[j]);
            "{}" !== str && (this.guests[j].mood <= 0 ? false == this.guests[j].isTalk && this.leaveGuest.push(this.guests[j]) : this.guests[j].mood -= 5);
          }
        },
        getGuestPosition: function getGuestPosition(person) {
          var arr = [];
          for (var i = 0; i < this.guests.length; i++) {
            var str = JSON.stringify(this.guests[i]);
            "{}" == str && arr.push(i);
          }
          if (0 !== arr.length) {
            var num = Math.floor(Math.random() * arr.length);
            this.guests[arr[num]].id = arr[num];
            this.guests[arr[num]].guest = person;
            this.guests[arr[num]].mood = 150;
            this.guests[arr[num]].money = 0;
            this.guests[arr[num]].evaluation = "tasteGood";
            this.guests[arr[num]].isTalk = false;
            return arr[num];
          }
          return false;
        },
        findGuestByName: function findGuestByName(name) {
          for (var i = 0; i < this.guests.length; i++) if ("{}" != JSON.stringify(this.guests[i]) && this.guests[i].guest.name == name) return i;
          return false;
        },
        saveDialog: function saveDialog(appearance, content) {
          this.dialogs.push({
            appearance: appearance,
            content: content
          });
        },
        getBasketPosition: function getBasketPosition() {
          if (0 == this.strands.length) return 0;
          var used = [];
          for (var i = 0; i < this.strands.length; i++) used.push(this.strands[i].index);
          for (var _i = 0; _i < this.maxBasketSize; _i++) if (-1 == used.indexOf(_i)) return _i;
          console.log("error basket position");
        },
        restoreData: function restoreData() {
          this.timeForGameDisplay = "00:00";
          this.timeForGame = 200;
          this.praiseNum = 0;
          this.strand = [];
          this.strands = [];
          this.strands = [];
          this.strandsInGrill = [];
          this.presentSize = 0;
          this.foodPlace = null;
          this.presentStrand = null;
          this.guest = null;
          this.basket = null;
          this.timer = null;
          this.timeShow = 0;
          this.guests = [ {}, {}, {}, {} ];
          this.guestsNum = 0;
          this.isStopGuestTimer = false;
          this.dialogs = [];
        }
      }
    };
    cc._RF.pop();
  }, {} ],
  dialogBtn: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6a4a3wSFAlNL5aQ5l9dOFKC", "dialogBtn");
    "use strict";
    var com = require("../common");
    cc.Class({
      extends: cc.Component,
      properties: {
        dialog: {
          default: null,
          type: cc.Node
        },
        characters: {
          default: null,
          type: cc.Node
        },
        evaluationGuest: null,
        orderGuest: null
      },
      start: function start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.mouseStart, this);
      },
      mouseStart: function mouseStart() {
        this.AudioPlayer = cc.find("Audio").getComponent("audioManager");
        this.AudioPlayer.playPropClick();
        if (null !== this.orderGuest) {
          var index = com.data.findGuestByName(this.orderGuest.guest.name);
          com.data.guests[index].isTalk = false;
          this.orderGuest = null;
        }
        if (null != this.evaluationGuest) {
          var _index = com.data.findGuestByName(this.evaluationGuest.guest.name);
          com.data.guests[_index].isTalk = false;
          com.data.leaveGuest.push(this.evaluationGuest);
          this.characters.getComponent("character").leave();
          this.evaluationGuest = null;
        }
        this.dialog.opacity = 0;
        this.node.getComponent(cc.Button).interactable = false;
        console.log(com.data.guests);
      }
    });
    cc._RF.pop();
  }, {
    "../common": void 0
  } ],
  dialog: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "95e4eDA8l5PhIjuzD7KNNCv", "dialog");
    "use strict";
    module.exports = {
      data: {
        kind: {
          greeting: [ [ "\u4eca\u5929\u6211\u60f3\u6765\u70b9", "\u3002" ], [ "\u597d\u4e45\u6ca1\u5403\u8fc7", "\u5566\u3002" ], [ "\u9ebb\u70e6\u7ed9\u6211\u6765\u70b9", "\u3002" ], [ "\u5929\u6c14\u597d\u80c3\u53e3\u5c31\u597d\uff0c\u6211\u60f3\u8981\u5403", "\u3002" ], [ "\u597d\u4e45\u4e0d\u89c1\u4e86\u5462,\u771f\u6000\u5ff5\u4f60\u5bb6\u7684", "!" ], [ "\u53ef\u4ee5\u7ed9\u6211\u6765\u70b9", "\u5417?" ] ],
          number: [ [ 1, "" ], [ 1, "\u4e00\u4e32\u5c31\u53ef\u4ee5\u3002" ], [ 2, "\u9ebb\u70e6\u6765\u4e24\u4e32\u3002" ], [ 3, "\u6765\u4e09\u4e32\u5427\uff0c\u5feb\u8981\u997f\u6b7b\u4e86\u3002" ] ],
          tasteGood: [ "\u786e\u8ba4\u8fc7\u773c\u795e\uff0c\u6211\u662f\u5403\u5b83\u7684\u4eba", "\u597d\u5403\u597d\u5403", "\u6211\u5df2\u7ecf\u8feb\u4e0d\u53ca\u5f85\u60f3\u8981\u518d\u6765\u4e00\u4efd\u4e86" ],
          falseFood: [ "\u8fd8\u884c\u5427\uff0c\u52c9\u5f3a\u80fd\u5403", "\u8fd9\u597d\u50cf\u4e0d\u662f\u6211\u70b9\u7684", "\u6211\u7684\u5929\uff0c\u4f60\u5c45\u7136\u77e5\u9053\u6211\u66f4\u559c\u6b22\u5403\u8fd9\u4e2a", "\u8fd9\u597d\u50cf\u6bd4\u6211\u70b9\u7684\u66f4\u597d\u5403\u5462", "\u55ef..\u867d\u7136\u4e0d\u662f\u6211\u70b9\u7684..\u4f46\u662f\u597d\u50cf\u8d5a\u5230\u4e86\u5462" ],
          uncooked: [ "\u597d\u50cf\u6709\u70b9\u6ca1\u719f\u5462", "\u725b\u6392\u4e03\u5206\u719f\u66f4\u597d\u5403\u5462\uff0c\u8fd9\u4e2a\u4e5f\u4e00\u6837\u5462", "\u867d\u7136\u6709\u70b9\u6ca1\u719f\uff0c\u4f46\u8001\u677f\u7684\u81ea\u4fe1\u6070\u6070\u8bf4\u660e\u4e86\u98df\u7269\u5f88\u65b0\u9c9c", "\u600e\u4e48\u70e4\u4e86\u540e\u8fd8\u662f\u8f6f\u8db4\u8db4\u7684" ],
          thanCooked: [ "\u4e0b\u6b21\u53ef\u4ee5\u4e0d\u8981\u70e4\u7cca\u5417", "\u6709\u79cd\u7126\u7126\u7684\u611f\u89c9", "\u6ca1\u6709\u4ee5\u524d\u7684\u597d\u5403\u4e86\u5462", "\u6211\u611f\u89c9\u53ef\u4ee5\u62ff\u7740\u5b83\u5f53\u6b66\u5668" ]
        },
        unkind: {
          greeting: [ [ "\u7ed9\u6211\u70e4\u70b9", ",\u4e0d\u8981\u518d\u70e4\u7cca\u4e86!" ], [ "\u6765\u70b9\u597d\u5403\u7684", "\u5427\u3002" ], [ "\u6211\u60f3\u5403", ",\u901f\u5ea6\u5feb\u4e00\u70b9OK?" ] ],
          number: [ [ 1, "" ], [ 1, "\u5c31\u8981\u4e00\u4e32\u3002" ], [ 1, "\u53ea\u8981\u4e00\u4e32\u3002" ], [ 2, "\u6765\u4e24\u4e32\u597d\u4e86\u3002" ], [ 2, "\u4e24\u4e32\u3002" ], [ 3, "\u4e09\u4e32,\u591a\u5403\u624d\u80fd\u53d8\u5065\u5eb7~" ] ],
          tasteGood: [ "\u597d\u5403\u5230\u6d41\u6cb9", "\u8fd9\u662f\u6211\u5403\u8fc7\u7684\u6700\u597d\u5403\u7684\u70e7\u70e4\u4e86" ],
          falseFood: [ "\u4f60\u662f\u8033\u80cc\u5417", "\u8fd9\u662f\u6211\u89c1\u8fc7\u6700\u5dee\u7684\u670d\u52a1\u4e86", "\u54a6\uff0c\u8fd9\u662f\u5565\uff1f\u597d\u96be\u5403\u554a", "\u4f60\u89c9\u5f97\u8fd9\u79cd\u732a\u98df\u6211\u4f1a\u5403\u5417\uff1f", "\u6211\u4ece\u6765\u4e0d\u5403\u8fd9\u4e2a" ],
          uncooked: [ "\u4e00\u80a1\u5b50\u8165\u5473", "\u8001\u677f\u4f60\u600e\u4e48\u80fd\u7ed9\u6211\u5403\u6ca1\u719f\u7684\u98df\u7269\u5462\uff0c\u62c9\u809a\u5b50\u4e86\u4f60\u8d1f\u8d23\u5417", "\u600e\u4e48\u8fd8\u662f\u751f\u7684\uff0c\u6211\u4e5f\u662f\u9189\u4e86", "\u8fd9\u53ef\u80fd\u4e0d\u662f\u70e4\u7684\uff0c\u662f\u6c34\u716e\u7684" ],
          thanCooked: [ "\u4ec0\u4e48\u5440\uff0c\u786c\u90a6\u90a6\u7684", "\u90fd\u70e4\u7126\u4e86\uff0c\u8fd8\u600e\u4e48\u5403\u5440", "\u5403\u8d77\u6765\u50cf\u6728\u5934\u4e00\u6837", "\u6211\u7684\u7259\u9f7f\u90fd\u8981\u88ab\u78d5\u6389\u4e86" ]
        },
        getGreeting: function getGreeting(type) {
          if ("kind" == type) {
            var num = Math.floor(Math.random() * this.kind.greeting.length);
            return this.kind.greeting[num];
          }
          var num = Math.floor(Math.random() * this.unkind.greeting.length);
          return this.unkind.greeting[num];
        },
        getNumber: function getNumber(type) {
          if ("kind" == type) {
            var num = Math.floor(Math.random() * this.kind.number.length);
            return this.kind.number[num];
          }
          var num = Math.floor(Math.random() * this.unkind.number.length);
          return this.unkind.number[num];
        },
        getEvaluation: function getEvaluation(type, evaluationType) {
          if ("kind" == type) {
            if ("tasteGood" == evaluationType) {
              var num = Math.floor(Math.random() * this.kind.tasteGood.length);
              return this.kind.tasteGood[num];
            }
            if ("falseFood" == evaluationType) {
              var num = Math.floor(Math.random() * this.kind.falseFood.length);
              return this.kind.falseFood[num];
            }
            if ("uncooked" == evaluationType) {
              var num = Math.floor(Math.random() * this.kind.uncooked.length);
              return this.kind.uncooked[num];
            }
            if ("thanCooked" == evaluationType) {
              var num = Math.floor(Math.random() * this.kind.thanCooked.length);
              return this.kind.thanCooked[num];
            }
          } else {
            if ("tasteGood" == evaluationType) {
              var num = Math.floor(Math.random() * this.unkind.tasteGood.length);
              return this.unkind.tasteGood[num];
            }
            if ("falseFood" == evaluationType) {
              var num = Math.floor(Math.random() * this.unkind.falseFood.length);
              return this.unkind.falseFood[num];
            }
            if ("uncooked" == evaluationType) {
              var num = Math.floor(Math.random() * this.unkind.uncooked.length);
              return this.unkind.uncooked[num];
            }
            if ("thanCooked" == evaluationType) {
              var num = Math.floor(Math.random() * this.unkind.thanCooked.length);
              return this.unkind.thanCooked[num];
            }
          }
        }
      }
    };
    cc._RF.pop();
  }, {} ],
  foodPlace: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "82552KEusdBR6ElbSKHRh4J", "foodPlace");
    "use strict";
    var com = require("common");
    cc.Class({
      extends: cc.Component,
      properties: {
        grill: {
          default: null,
          type: cc.Node
        },
        paprika: {
          default: null,
          type: cc.Node
        },
        cuminPowder: {
          default: null,
          type: cc.Node
        },
        oil: {
          default: null,
          type: cc.Node
        },
        guests: {
          default: null,
          type: cc.Node
        },
        dishes: {
          default: null,
          type: cc.Node
        },
        trash: {
          default: null,
          type: cc.Node
        },
        targetOriginX: 0,
        targetOriginY: 0,
        isTrashOpen: false
      },
      onLoad: function onLoad() {
        var children = this.node.children;
        for (var i = 0; i < children.length; i++) {
          children[i].on(cc.Node.EventType.TOUCH_MOVE, this.mouseMove, this);
          children[i].on(cc.Node.EventType.TOUCH_START, this.mouseStart, this);
          children[i].on(cc.Node.EventType.TOUCH_END, this.mouseEnd, this);
          children[i].on(cc.Node.EventType.TOUCH_CANCEL, this.mouseEnd, this);
        }
        null == com.data.timer;
      },
      mouseStart: function mouseStart(e) {
        var target = e.target;
        this.targetOriginX = target.x;
        this.targetOriginY = target.y;
        target.zIndex++;
        var paprika = this.paprika.getComponent("all");
        var cuminPowder = this.cuminPowder.getComponent("all");
        var oil = this.oil.getComponent("all");
      },
      mouseMove: function mouseMove(e) {
        var target = e.target;
        var paprika = this.paprika.getComponent("all");
        var cuminPowder = this.cuminPowder.getComponent("all");
        var oil = this.oil.getComponent("all");
        if (!(paprika.isSelect || cuminPowder.isSelect || oil.isSelect)) {
          var delta = e.touch.getDelta();
          target.x += delta.x;
          target.y += delta.y;
        }
        var trashLeft = this.trash.x - this.trash.width / 2;
        var trashRight = this.trash.x + this.trash.width / 2;
        var trashTop = this.trash.y + this.trash.height / 2 - this.grill.y;
        var trashBottom = this.trash.y - this.trash.height / 2 - this.grill.y;
        var anim = this.trash.getComponent(cc.Animation);
        if (target.x >= trashLeft && target.x < trashRight && target.y >= trashBottom && target.y < trashTop) {
          if (!this.isTrashOpen) {
            this.isTrashOpen = true;
            anim.play("trashOpen");
          }
        } else if (this.isTrashOpen) {
          this.isTrashOpen = false;
          anim.play("trashClose");
        }
      },
      mouseEnd: function mouseEnd(e) {
        var target = e.target;
        var paprika = this.paprika.getComponent("all");
        var cuminPowder = this.cuminPowder.getComponent("all");
        var oil = this.oil.getComponent("all");
        if (paprika.isSelect || cuminPowder.isSelect || oil.isSelect) {
          var strandsInGrill = com.data.strandsInGrill;
          for (var _i4 = 0; _i4 < strandsInGrill.length; _i4++) if (strandsInGrill[_i4].name == target.name) {
            var type = "";
            if (paprika.isSelect) {
              strandsInGrill[_i4].seasoning.push("paprika");
              type = "paprika";
            } else if (cuminPowder.isSelect) {
              strandsInGrill[_i4].seasoning.push("cuminPowder");
              type = "cuminPowder";
            } else if (oil.isSelect) {
              strandsInGrill[_i4].seasoning.push("oil");
              type = "oil";
            }
            this.addSeasoning(target, type);
          }
        } else if (target.x < this.targetOriginX + 5 && target.x > this.targetOriginX - 5 && target.y < this.targetOriginY + 5 && target.y > this.targetOriginY - 5) {
          var ripe = 0;
          var strandsInGrill = com.data.strandsInGrill;
          for (var i = 0; i < strandsInGrill.length; i++) if (strandsInGrill[i].name == target.name) if ("back" == com.data.strandsInGrill[i].selectedFace) {
            com.data.strandsInGrill[i].selectedFace = "front";
            ripe = com.data.strandsInGrill[i].back;
          } else {
            com.data.strandsInGrill[i].selectedFace = "back";
            ripe = com.data.strandsInGrill[i].front;
          }
          var originScaleX = target.scaleX;
          var originScaleY = target.scaleY;
          var action = cc.sequence(cc.spawn(cc.moveBy(.05, 5, 5), cc.scaleTo(.1, .3, originScaleY)), cc.spawn(cc.moveBy(.05, -5, -5), cc.scaleTo(.1, originScaleX, originScaleY)));
          target.runAction(action);
          var targetChild = target.children;
          for (var _i = 1; _i < targetChild.length; _i++) {
            var name = targetChild[_i].name;
            ripe < 10 || (ripe >= 10 && ripe < 20 ? name += "_1" : ripe >= 20 && ripe < 40 ? name += "_2" : ripe >= 40 && (name += "_3"));
            this.changeFoodRipe(name, targetChild[_i]);
          }
        } else {
          var grillLeft = -this.grill.width / 2 + 50;
          var grillRight = this.grill.width / 2 - 50;
          var grillTop = this.grill.height / 2;
          var grillBottom = -this.grill.height / 2;
          var trashLeft = this.trash.x - this.trash.width / 2;
          var trashRight = this.trash.x + this.trash.width / 2;
          var trashTop = this.trash.y + this.trash.height / 2 - this.grill.y;
          var trashBottom = this.trash.y - this.trash.height / 2 - this.grill.y;
          if (target.x >= grillLeft && target.x <= grillRight && target.y <= grillTop && target.y >= grillBottom) {
            var foods = this.node.children;
            var targetLeft = target.x - target.width / 2;
            var targetRight = target.x + target.width / 2;
            for (var _i2 = 0; _i2 < foods.length; _i2++) {
              var foodLeft = foods[_i2].x - foods[_i2].width / 2;
              var foodRight = foods[_i2].x + foods[_i2].width / 2;
              if (!(targetRight < foodLeft || targetLeft > foodRight) && foods[_i2] != target) {
                target.x = this.targetOriginX;
                target.y = this.targetOriginY;
                target.zIndex--;
                return;
              }
            }
            target.y = 0;
            return;
          }
          if (target.x >= trashLeft && target.x < trashRight && target.y >= trashBottom && target.y < trashTop) {
            var action = cc.spawn(cc.scaleTo(.2, 0, 0), cc.moveBy(.2, 0, 0)).easing(cc.easeCubicActionOut());
            var anim = this.trash.getComponent(cc.Animation);
            target.runAction(action);
            this.isTrashOpen = false;
            anim.play("trashClose");
            target.off(cc.Node.EventType.TOUCH_MOVE, this.mouseMove, this);
            target.off(cc.Node.EventType.TOUCH_END, this.mouseEnd, this);
            setTimeout(function() {
              target.destroy();
            }.bind(this), 200);
          } else {
            var guestsPosition = [];
            for (var _i3 = 0; _i3 < this.guests.childrenCount; _i3++) {
              var guestNode = this.guests.children[_i3];
              var guestTop = this.guests.x + guestNode.height;
              var guestBottom = this.guests.x;
              var guestLeft = guestNode.x - guestNode.width / 2;
              var guestRight = guestNode.x + guestNode.width / 2;
              guestsPosition.push({
                top: guestTop,
                bottom: guestBottom,
                left: guestLeft,
                right: guestRight
              });
              if (target.x >= guestLeft && target.x <= guestRight && target.y <= guestTop && target.y >= guestBottom) {
                var guest = com.data.guests[com.data.findGuestByName(guestNode.name)];
                if (guest.food) {
                  var dish = this.dishes.children[guest.id];
                  var timerX = setTimeout(function() {
                    target.parent = dish;
                    target.zIndex = dish.zIndex + 1;
                    var w = dish.width / 2 - 20;
                    var foodX = -w + Math.floor(w * Math.random()) + 20;
                    var action = cc.spawn(cc.scaleTo(.2, .2, .2), cc.moveTo(.2, foodX, 0)).easing(cc.easeCubicActionOut());
                    target.runAction(action);
                    clearTimeout(timerX);
                  }, 0);
                  var strands = com.data.strandsInGrill;
                  var score = 100;
                  var isTrueName = false;
                  var strandName = "";
                  for (var k = 1; k < target.childrenCount; k++) strandName += target.children[k].name;
                  if (guest.food.name == strandName) {
                    isTrueName = true;
                    for (var j = 0; j < strands.length; j++) if (strands[j].name == target.name) if (strands[j].front < 20 || strands[j].back < 20) {
                      score -= 20;
                      guest.evaluation = "uncooked";
                    } else if (strands[j].front > 40 || strands[j].back > 40) {
                      score -= 20;
                      guest.evaluation = "thanCooked";
                    }
                  }
                  if (false == isTrueName) {
                    score -= 40;
                    guest.evaluation = "falseFood";
                  }
                  guest.money = guest.money + .01 * score * guest.food.price;
                  guest.number--;
                  target.off(cc.Node.EventType.TOUCH_MOVE, this.mouseMove, this);
                  target.off(cc.Node.EventType.TOUCH_START, this.mouseStart, this);
                  target.off(cc.Node.EventType.TOUCH_END, this.mouseEnd, this);
                  target.off(cc.Node.EventType.TOUCH_CANCEL, this.mouseEnd, this);
                  if (0 == guest.number) {
                    var Character = this.guests.getComponent("character");
                    Character.guestEvaluation(guest);
                  }
                  return;
                }
                console.log("\u8fd9\u4f4d\u987e\u5ba2\u8fd8\u6ca1\u70b9\u5355\u5462");
              }
            }
          }
          target.x = this.targetOriginX;
          target.y = this.targetOriginY;
          target.zIndex--;
        }
      },
      changeFoodRipe: function changeFoodRipe(name, target) {
        cc.loader.loadRes(name, cc.SpriteFrame, function(err, spriteFrame) {
          target.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
      },
      addSeasoning: function addSeasoning(target, type) {
        var color = "";
        if ("paprika" == type || "cuminPowder" == type) {
          switch (type) {
           case "paprika":
            color = "bf0000";
            break;

           case "cuminPowder":
            color = "#bf7200";
          }
          for (var j = 1; j < target.childrenCount; j++) {
            var targetChild = target.children[j];
            var grapNode = new cc.Node();
            grapNode.parent = targetChild;
            var ctx = grapNode.addComponent(cc.Graphics);
            ctx.fillColor = new cc.Color().fromHEX(color);
            for (var i = 0; i < 100; i++) {
              var randomX = 5 - targetChild.width / 2 + (targetChild.width - 5) * Math.random();
              var randomY = 5 - targetChild.height / 2 + (targetChild.height - 5) * Math.random();
              var randomR = Math.random();
              ctx.circle(randomX, randomY, randomR);
              ctx.fill();
            }
          }
        } else "oil" == type && cc.loader.loadRes("oil", cc.SpriteFrame, function(err, spriteFrame) {
          for (var i = 0; i < target.childrenCount; i++) {
            var targetChild = target.children[i];
            var node = new cc.Node();
            targetChild.addChild(node);
            var sp = node.addComponent(cc.Sprite);
            sp.spriteFrame = spriteFrame;
            node.width = targetChild.width;
            node.height = targetChild.height;
            var action = cc.spawn(cc.fadeTo(2, 0), cc.scaleTo(2, .2, .2)).easing(cc.easeCubicActionOut());
            node.runAction(action);
            setTimeout(function() {
              node.destroy();
            }, 2e3);
          }
        });
      }
    });
    cc._RF.pop();
  }, {
    common: "common"
  } ],
  game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5cf85QwDMhBYJw2HeJIi60h", "game");
    "use strict";
    var com = require("common");
    cc.Class({
      extends: cc.Component,
      properties: {
        basket: {
          default: null,
          type: cc.Node
        },
        foodPlace: {
          default: null,
          type: cc.Node
        },
        dialogMenu: {
          default: null,
          type: cc.Node
        },
        menu: {
          default: null,
          type: cc.Prefab
        },
        confirmBack: {
          default: null,
          type: cc.Prefab
        },
        setting: {
          default: null,
          type: cc.Prefab
        },
        menuBtn: {
          default: null,
          type: cc.Node
        },
        dialogBtn: {
          default: null,
          type: cc.Node
        },
        guest: {
          default: null,
          type: cc.Node
        },
        dish: {
          default: null,
          type: cc.Node
        },
        money: {
          default: null,
          type: cc.Label
        },
        sun: {
          default: null,
          type: cc.Label
        },
        timeChange: 5e3
      },
      onLoad: function onLoad() {
        console.log(1);
        this.AudioPlayer = cc.find("Audio").getComponent("audioManager");
        var nowSence = cc.director.getScene();
        this.sun.string = com.data.timeForGameDisplay;
        com.data.timeForGame <= 0 && (this.sun.node.color = new cc.Color().fromHEX("#FF0000"));
        this.money.string = com.data.money.toFixed(2);
        var basket = com.data.basket;
        if (null !== basket && 0 !== basket.childrenCount) for (var i = 0; i < basket.childrenCount; i++) {
          var node = cc.instantiate(basket.children[i]);
          node.parent = this.basket;
        }
        if ("SenceCook" == nowSence.name) {
          this.AudioPlayer.playBarbecueSound();
          var foodPlace = com.data.foodPlace;
          if (null !== foodPlace && 0 !== foodPlace.childrenCount) for (var i = 0; i < foodPlace.childrenCount; i++) {
            var _node = cc.instantiate(foodPlace.children[i]);
            _node.parent = this.foodPlace;
          }
          var dish = com.data.dish;
          if (dish) {
            var _node2 = cc.instantiate(dish);
            for (var _i = 0; _i < _node2.children.length; _i++) {
              var foods = _node2.children[_i].children;
              for (var j = 0; j < foods.length; j++) foods[j].parent = this.dish.children[_i];
            }
          }
        } else this.AudioPlayer.stopBarbecueSound();
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.changeSence, this);
        this.dialogBtn.on(cc.Node.EventType.TOUCH_START, this.openDialog, this);
        this.menuBtn.on(cc.Node.EventType.TOUCH_START, this.openMenu, this);
        console.log(2);
      },
      start: function start() {
        this.doInterval();
      },
      doInterval: function doInterval() {
        var _this = this;
        com.data.timer = setInterval(function() {
          com.data.timeForGame -= 5;
          _this.sun.string = _this.getTime();
          com.data.timeForGameDisplay = _this.sun.string;
          console.log(com.data.timeForGame);
          com.data.timeForGame <= 0 && (_this.sun.node.color = new cc.Color().fromHEX("#FF0000"));
          com.data.timeForGame <= 0 && 0 == com.data.guestsNum;
          var nowSence = cc.director.getScene();
          com.data.changeAllInCommon();
          if ("SenceCook" == nowSence.name) {
            var guestScript = _this.guest.getComponent("character");
            if (com.data.timeShow == com.data.settings.timeForGuest && com.data.timeForGame > 0) {
              com.data.timeShow = 0;
              if (com.data.guestsNum < 4) {
                com.data.guestsNum++;
                guestScript.showGuest();
                _this.AudioPlayer.playGuestComing();
              }
            }
            guestScript.findLeaveGuest();
          } else {
            if (com.data.timeShow == com.data.settings.timeForGuest && com.data.timeForGame > 0) {
              com.data.timeShow = 0;
              if (com.data.guestsNum < 4) {
                com.data.guestsNum++;
                _this.AudioPlayer.playGuestComing();
              }
            }
            com.data.changeMood();
          }
        }, this.timeChange);
      },
      changeSence: function changeSence(e) {
        com.data.clearTime();
        console.log("clear 2");
        var nowSence = cc.director.getScene();
        if (65 == e.keyCode || 68 == e.keyCode) {
          com.data.basket = cc.instantiate(this.basket);
          if ("SenceCook" == nowSence.name) {
            com.data.foodPlace = cc.instantiate(this.foodPlace);
            com.data.guest = cc.instantiate(this.guest);
            com.data.dish = cc.instantiate(this.dish);
            cc.director.loadScene("SenceMake");
          } else {
            var presentStrand = cc.find("Canvas").getChildByName("Main Camera").getChildByName("presentStrand");
            com.data.presentStrand = cc.instantiate(presentStrand);
            cc.director.loadScene("SenceCook");
          }
        }
      },
      openDialog: function openDialog(e) {
        this.AudioPlayer.playPropClick();
        var dialogs = com.data.dialogs;
        var menu = this.dialogMenu.children[1].children[0];
        var topX = -190;
        var topY = 200;
        var MAX_CONTENT_LENGTH = 18;
        var content = "";
        for (var i = 0; i < dialogs.length; i++) {
          content += dialogs[i].appearance;
          content += ":\n";
          var diaContent = dialogs[i].content;
          if (diaContent.length > MAX_CONTENT_LENGTH) {
            var diaLen = Math.ceil(diaContent.length / MAX_CONTENT_LENGTH);
            for (var j = 0; j < diaLen; j++) {
              var str = diaContent.slice(j * MAX_CONTENT_LENGTH, (j + 1) * MAX_CONTENT_LENGTH);
              content += str;
              content += "\n";
            }
          } else {
            content += diaContent;
            content += "\n";
          }
          content += "\n\n";
        }
        menu.getComponent(cc.Label).string = content;
        this.dialogMenu.opacity = 255;
        var cancelBtn = this.dialogMenu.children[0];
        cancelBtn.on(cc.Node.EventType.TOUCH_START, this.closeDialog, this);
      },
      closeDialog: function closeDialog(e) {
        this.dialogMenu.opacity = 0;
        var cancelBtn = this.dialogMenu.children[0];
        cancelBtn.off(cc.Node.EventType.TOUCH_START, this.closeDialog, this);
      },
      openMenu: function openMenu(e) {
        this.AudioPlayer.stopBarbecueSound();
        this.AudioPlayer.playPropClick();
        var menu = cc.instantiate(this.menu);
        this.node.parent.addChild(menu);
        com.data.clearTime();
        console.log("clear 3");
        var btns = menu.children[0].children;
        for (var i = 0; i < btns.length; i++) btns[i].on(cc.Node.EventType.TOUCH_START, this.selectMenuBtn, this);
      },
      selectMenuBtn: function selectMenuBtn(e) {
        this.AudioPlayer.playGeneralClick();
        var parent = e.target.parent.parent;
        if ("return" == e.target.name) this.closeMenu(parent); else if ("settings" == e.target.name) {
          var setting = cc.instantiate(this.setting);
          parent.addChild(setting);
          var bgManager = setting.getChildByName("bg");
          var soundEffectManager = setting.getChildByName("effect");
          var btn = setting.getChildByName("true");
          bgManager.getComponent(cc.Slider).progress = this.AudioPlayer.getBgVolume();
          soundEffectManager.getComponent(cc.Slider).progress = this.AudioPlayer.getEffectVolume();
          bgManager.on("slide", function(e) {
            this.AudioPlayer.setBgVolume(e.progress);
          }, this);
          soundEffectManager.on("slide", function(e) {
            this.AudioPlayer.setEffectVolume(e.progress);
          }, this);
          btn.on("click", function(e) {
            this.AudioPlayer.playGeneralClick();
            this.closeMenu(parent);
          }, this);
        } else if ("mainMenu" == e.target.name) {
          var confirm = cc.instantiate(this.confirmBack);
          parent.addChild(confirm);
          var children = confirm.children;
          for (var i = 1; i < children.length; i++) children[i].on(cc.Node.EventType.TOUCH_START, function(e) {
            this.AudioPlayer.playGeneralClick();
            if ("true" == e.target.name) {
              this.AudioPlayer.playGeneralClick();
              com.data.restoreData();
              cc.director.loadScene("SenceEnter");
            } else "false" == e.target.name && this.closeMenu(parent);
          }, this);
        }
      },
      closeMenu: function closeMenu(parent) {
        this.doInterval();
        parent.destroy();
        var nowSence = cc.director.getScene();
        "SenceCook" == nowSence.name && this.AudioPlayer.playBarbecueSound();
      },
      getTime: function getTime() {
        var str = this.sun.string;
        var arr = str.split(":");
        var min = parseInt(arr[1]);
        if (min + 3 >= 60) {
          var h = parseInt(arr[0]) + 1;
          return "0" + h + ":00";
        }
        min += 3;
        return min > 10 ? arr[0] + ":" + min : arr[0] + ":0" + min;
      }
    });
    cc._RF.pop();
  }, {
    common: "common"
  } ],
  getFoodFromBasket: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0f82ePpCnZCcLrxuRW6FSRl", "getFoodFromBasket");
    "use strict";
    var com = require("common");
    cc.Class({
      extends: cc.Component,
      properties: {
        isLight: false,
        grillPosition: {
          default: null,
          type: cc.Node
        },
        grill: {
          default: null,
          type: cc.Node
        },
        foodPlace: {
          default: null,
          type: cc.Node
        },
        smoke: {
          default: null,
          type: cc.Node
        },
        foodCookingParticle: {
          default: null,
          type: cc.Prefab
        },
        targetOriginX: 0,
        targetOriginY: 0,
        targetBeforeYLength: 0,
        iSelect: -1
      },
      onLoad: function onLoad() {
        var children = this.node.children;
        for (var i = 0; i < children.length; i++) {
          children[i].on(cc.Node.EventType.TOUCH_MOVE, this.mouseMove, this);
          children[i].on(cc.Node.EventType.TOUCH_END, this.mouseEnd, this);
          children[i].on(cc.Node.EventType.TOUCH_CANCEL, this.mouseEnd, this);
        }
      },
      start: function start() {},
      mouseMove: function mouseMove(e) {
        var target = e.target;
        if (!this.isLight) {
          this.targetOriginX = target.x;
          this.targetOriginY = target.y;
          this.isLight = true;
          var action = cc.spawn(cc.scaleTo(.2, .8, .8), cc.rotateBy(.2, -90)).easing(cc.easeCubicActionOut());
          target.runAction(action);
          var children = this.node.children;
          var targetType = "";
          for (var k = 1; k < target.childrenCount; k++) targetType += target.children[k].name;
          for (var i = 0; i < children.length; i++) {
            children[i] == target && (this.iSelect = i);
            var child = children[i].children;
            var childType = "";
            for (var j = 1; j < child.length; j++) childType += child[j].name;
            if (children[i].y > this.targetOriginY && childType == targetType && i !== this.iSelect) {
              var actionY = cc.moveBy(.2, 0, -5);
              children[i].runAction(actionY);
              this.targetBeforeYLength++;
            }
          }
        }
        var delta = e.touch.getDelta();
        target.x += delta.x;
        target.y += delta.y;
      },
      mouseEnd: function mouseEnd(e) {
        var target = e.target;
        if (!this.isLight) return;
        this.isLight = false;
        var grillLeft = -744;
        var grillRight = -100;
        var grillTop = 100;
        var grillBottom = -200;
        if (target.x >= grillLeft && target.x <= grillRight && target.y <= grillTop && target.y >= grillBottom) {
          var distance = this.node.x - this.grillPosition.x;
          var foods = this.foodPlace.children;
          var targetLeft = target.x - target.width / 2;
          var targetRight = target.x + target.width / 2;
          for (var i = 0; i < foods.length; i++) {
            var foodLeft = foods[i].x - foods[i].width / 2 - distance;
            var foodRight = foods[i].x + foods[i].width / 2 - distance;
            if (!(targetRight < foodLeft || targetLeft > foodRight)) {
              this.doRecover(target);
              return;
            }
          }
          target.parent = this.foodPlace;
          target.y = 0;
          target.x = target.x + distance;
          var randomNum = "";
          for (var j = 0; j < 10; j++) randomNum += Math.floor(10 * Math.random());
          target.name = "strand" + randomNum;
          target.off(cc.Node.EventType.TOUCH_MOVE, this.mouseMove, this);
          target.off(cc.Node.EventType.TOUCH_END, this.mouseEnd, this);
          target.off(cc.Node.EventType.TOUCH_CANCEL, this.mouseEnd, this);
          this.targetBeforeYLength = 0;
          this.changeStrands(target);
          this.onGrill();
          var that = this.foodPlace.getComponent("foodPlace");
          target.on(cc.Node.EventType.TOUCH_MOVE, that.mouseMove, that);
          target.on(cc.Node.EventType.TOUCH_START, that.mouseStart, that);
          target.on(cc.Node.EventType.TOUCH_END, that.mouseEnd, that);
          target.on(cc.Node.EventType.TOUCH_CANCEL, that.mouseEnd, that);
        } else this.doRecover(target);
      },
      doRecover: function doRecover(target) {
        var x = -1 * target.x + this.targetOriginX;
        var y = -1 * target.y + this.targetOriginY + 5 * this.targetBeforeYLength;
        var action = cc.spawn(cc.scaleTo(.2, .4, .4), cc.rotateBy(.2, 90), cc.moveBy(.2, x, y)).easing(cc.easeCubicActionOut());
        target.runAction(action);
        this.changeFoodOrder(target);
        this.targetBeforeYLength = 0;
      },
      changeFoodOrder: function changeFoodOrder(target) {
        var children = this.node.children;
        var temp = children[this.iSelect];
        for (var i = this.iSelect; i < children.length; i++) children[i] = children[i + 1];
        children[children.length - 1] = temp;
      },
      changeStrands: function changeStrands(target) {
        var strands = com.data.strands;
        var targetType = "";
        for (var i = 1; i < target.childrenCount; i++) targetType += target.children[i].name;
        for (var _i = 0; _i < strands.length; _i++) {
          var type = strands[_i].type;
          var str = "";
          for (var j = 0; j < type.length; j++) str += type[j];
          if (str == targetType) {
            strands[_i].length--;
            0 == strands[_i].length && strands.splice(_i, 1);
          }
        }
        var data = {
          name: target.name,
          typeName: targetType,
          front: 0,
          back: 0,
          seasoning: [],
          selectedFace: "back"
        };
        com.data.strandsInGrill.push(data);
        com.data.strands = strands;
      },
      onGrill: function onGrill() {
        var anim = this.smoke.getComponent(cc.Animation);
        anim.play();
      }
    });
    cc._RF.pop();
  }, {
    common: "common"
  } ],
  level: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "20b63QVfbBB/rGbAfWkaVHT", "level");
    "use strict";
    module.export = {
      data: {
        level: [ {
          num: 1,
          timeForGuest: 50
        } ]
      }
    };
    cc._RF.pop();
  }, {} ],
  menu: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "44c0d5LDN5NsYl7vBBIOxWY", "menu");
    "use strict";
    module.exports = {
      data: {
        types: [ {
          name: "sausage",
          chinese: "\u9999\u80a0",
          price: 2
        }, {
          name: "potatopotatopotato",
          chinese: "\u571f\u8c46\u4e32",
          price: 1
        }, {
          name: "mutton",
          chinese: "\u7f8a\u8089\u4e32",
          price: 3
        } ],
        getFood: function getFood() {
          var num = Math.floor(Math.random() * this.types.length);
          console.log(this.types[num]);
          return this.types[num];
        }
      }
    };
    cc._RF.pop();
  }, {} ],
  presentStrand: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "df8ef92kotNxYzDJfMGmQ6U", "presentStrand");
    "use strict";
    var com = require("common");
    cc.Class({
      extends: cc.Component,
      properties: {
        basket: {
          default: null,
          type: cc.Node
        },
        trash: {
          default: null,
          type: cc.Node
        },
        presentStrand: {
          default: null,
          type: cc.Node
        },
        x: -3,
        y: -117,
        position: 0,
        isTrashOpen: false
      },
      onLoad: function onLoad() {
        var presentStrandInData = com.data.presentStrand;
        if (null != presentStrandInData) {
          presentStrandInData.parent = this.node;
          this.presentStrand = presentStrandInData;
        } else {
          var presentStrand = this.createPresentStrand();
          this.initStick(presentStrand);
          this.presentStrand = presentStrand;
        }
        this.presentStrand.on(cc.Node.EventType.TOUCH_MOVE, this.mouseMove, this);
        this.presentStrand.on(cc.Node.EventType.TOUCH_END, this.mouseEnd, this);
      },
      start: function start() {},
      mouseMove: function mouseMove(event) {
        var data = com.data;
        if (0 !== data.presentSize) {
          var delta = event.touch.getDelta();
          this.presentStrand.x += delta.x;
          this.presentStrand.y += delta.y;
          var trashLeft = this.trash.x - this.trash.width / 2;
          var trashRight = this.trash.x + this.trash.width / 2;
          var trashTop = this.trash.y + this.trash.height / 2;
          var trashBottom = this.trash.y - this.trash.height / 2;
          var anim = this.trash.getComponent(cc.Animation);
          if (this.presentStrand.x >= trashLeft && this.presentStrand.x < trashRight && this.presentStrand.y >= trashBottom && this.presentStrand.y < trashTop) {
            if (!this.isTrashOpen) {
              this.isTrashOpen = true;
              anim.play("trashOpen");
            }
          } else if (this.isTrashOpen) {
            this.isTrashOpen = false;
            anim.play("trashClose");
          }
        }
      },
      mouseEnd: function mouseEnd(event) {
        var basketLeft = this.basket.x - this.basket.width / 2;
        var basketRight = this.basket.x + this.basket.width / 2;
        var basketTop = this.basket.y + this.basket.height / 2;
        var basketBottom = this.basket.y - this.basket.height / 2;
        var trashLeft = this.trash.x - this.trash.width / 2;
        var trashRight = this.trash.x + this.trash.width / 2;
        var trashTop = this.trash.y + this.trash.height / 2;
        var trashBottom = this.trash.y - this.trash.height / 2;
        var data = com.data;
        if (this.presentStrand.x >= basketLeft && this.presentStrand.x < basketRight && this.presentStrand.y >= basketBottom && this.presentStrand.y < basketTop) {
          var object = {};
          object.type = data.strand;
          var returnData = this.getNumber(data.strand);
          var height = this.basket.height - 30;
          if (-1 == returnData.index) {
            if (data.strands.length == data.maxBasketSize) {
              this.presentStrand.x = this.x;
              this.presentStrand.y = this.y;
              return;
            }
            object.index = data.getBasketPosition();
            object.length = returnData.length;
            data.strands.push(object);
            var y = height / 2 - height / data.maxBasketSize * object.index - 20;
          } else {
            if (!(data.strands[returnData.index].length < data.maxSameFoodInBasket)) {
              this.presentStrand.x = this.x;
              this.presentStrand.y = this.y;
              return;
            }
            data.strands[returnData.index].length++;
            var y = height / 2 - height / data.maxBasketSize * data.strands[returnData.index].index + 5 * (returnData.length - 1) - 20;
          }
          data.strand = [];
          data.presentSize = 0;
          var action = cc.spawn(cc.scaleTo(.2, .4, .4), cc.rotateBy(.2, 90), cc.moveBy(.2, -20, y)).easing(cc.easeCubicActionOut());
          this.presentStrand.runAction(action);
          this.presentStrand.parent = this.basket;
          this.presentStrand.x = 0;
          this.presentStrand.y = 0;
          this.presentStrand.off(cc.Node.EventType.TOUCH_MOVE, this.mouseMove, this);
          this.presentStrand.off(cc.Node.EventType.TOUCH_END, this.mouseEnd, this);
          var presentStrand = this.createPresentStrand();
          this.initStick(presentStrand);
          this.presentStrand = presentStrand;
          this.presentStrand.on(cc.Node.EventType.TOUCH_MOVE, this.mouseMove, this);
          this.presentStrand.on(cc.Node.EventType.TOUCH_END, this.mouseEnd, this);
        } else if (this.presentStrand.x >= trashLeft && this.presentStrand.x < trashRight && this.presentStrand.y >= trashBottom && this.presentStrand.y < trashTop) {
          var action = cc.spawn(cc.scaleTo(.2, 0, 0), cc.moveBy(.2, 0, 0)).easing(cc.easeCubicActionOut());
          var anim = this.trash.getComponent(cc.Animation);
          this.presentStrand.runAction(action);
          this.isTrashOpen = false;
          anim.play("trashClose");
          this.presentStrand.off(cc.Node.EventType.TOUCH_MOVE, this.mouseMove, this);
          this.presentStrand.off(cc.Node.EventType.TOUCH_END, this.mouseEnd, this);
          setTimeout(function() {
            this.presentStrand.destroy();
            var presentStrand = this.createPresentStrand();
            this.initStick(presentStrand);
            this.presentStrand = presentStrand;
            this.presentStrand.on(cc.Node.EventType.TOUCH_MOVE, this.mouseMove, this);
            this.presentStrand.on(cc.Node.EventType.TOUCH_END, this.mouseEnd, this);
            data.strand = [];
            data.presentSize = 0;
          }.bind(this), 200);
        } else {
          this.presentStrand.x = this.x;
          this.presentStrand.y = this.y;
        }
      },
      initStick: function initStick(presentStrand) {
        cc.loader.loadRes("stick", cc.SpriteFrame, function(err, spriteFrame) {
          var node = new cc.Node();
          node.parent = presentStrand;
          var sp = node.addComponent(cc.Sprite);
          sp.spriteFrame = spriteFrame;
        });
      },
      createPresentStrand: function createPresentStrand() {
        var node = new cc.Node();
        node.parent = this.node;
        node.name = "presentStrand";
        node.x = this.x;
        node.y = this.y;
        node.height = 200;
        node.width = 20;
        return node;
      },
      getNumber: function getNumber(name) {
        var data = com.data;
        var len = 1;
        var i = -1;
        data.strands.forEach(function(item, index) {
          if (item.type.toString() == name.toString()) {
            len += item.length;
            i = index;
          }
        });
        return {
          length: len,
          index: i
        };
      }
    });
    cc._RF.pop();
  }, {
    common: "common"
  } ],
  story: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cd68fZl479Cg6epQ26e1oFH", "story");
    "use strict";
    module.exports = {
      data: {
        story: [ {
          dialog: [ [ "Jan", "\u6211\u60f3\u7ed9\u7238\u7238\u4e70\u4e9b\u597d\u5403\u7684\uff0c\u4ed6\u5df2\u7ecf\u5f88\u4e45\u6ca1\u6709\u5403\u8fc7\u70e7\u70e4\u4e86\u3002" ], [ "Jan", "\u90a3\u4f60\u60f3\u6765\u70b9\u4ec0\u4e48\u5462\uff1f" ], [ "Jan", "\u6765\u4e24\u6839\u70e4\u80a0\u5427\uff01\u7b49\u7b49\uff0c\u8fd8\u662f\u4e00\u6839\u5427\u3002" ] ],
          evaluation: {
            good: "\u95fb\u8d77\u6765\u5f88\u9999\uff0c\u7238\u7238\u4e00\u5b9a\u4f1a\u559c\u6b22\u7684\u3002",
            bad: "\u5e0c\u671b\u7238\u7238\u4f1a\u559c\u6b22\u3002"
          }
        } ]
      }
    };
    cc._RF.pop();
  }, {} ]
}, {}, [ "addFood", "audioManager", "beginGame", "character", "common", "characters", "dialog", "level", "menu", "story", "dialogBtn", "foodPlace", "game", "getFoodFromBasket", "presentStrand", "all" ]);