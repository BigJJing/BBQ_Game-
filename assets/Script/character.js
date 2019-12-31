var characters = require('data/characters')
var foodMenu = require('data/menu')
var dialog = require('data/dialog')
var com = require('common');
cc.Class({
    extends: cc.Component,

    properties: {
      position:[],  //客人位置
      dishes:{
        default:null,
        type:cc.Node
      },
      order:{
        default: null,
        type: cc.Node
      },
      dialogBtn:{
        default: null,
        type: cc.Node
      },
      characters:{
        default:null,
        type: cc.Node
      },
      money: {
        default: null,
        type: cc.Label
      },
      account:{
        default: null,
        type: cc.Prefab
      }
    },

    onLoad () {
      //计算人物位置
      //获取盘子的位置（客人位置要和盘子的位置对齐）
      com.data.isStopGuestTimer = true;
      var children = this.dishes.children;
      for(let i = 0 ;i < children.length; i++){
        this.position.push(children[i].x)
      }
      //首次进入游戏
      if(com.data.guest == null){
        //游戏开始2秒后人物出场
        com.data.guestsNum = 1;
        var component = this;
        //cocos自带计时器：绑定组件，只执行一次，2s后执行
        component.scheduleOnce(function() {
           // 这里的 this 指向 component
           this.showGuest();
       }, 2);
      }
      //切换界面到游戏
      else{
        var guests = com.data.guest.children;
        //由于guests.length 会因为presentNode.parent = this.node 而自动变化，所以使用while
        while(guests.length != 0){
          var presentNode = guests[0]
          //为还没点单的客人添加监听
          if(presentNode.childrenCount > 0 && presentNode.children[0].name == "talk"){
            presentNode.on(cc.Node.EventType.TOUCH_START,this.guestTalk,this)
          }
          presentNode.parent = this.node
        }
        var addNum = com.data.guestsNum - this.node.childrenCount;
        if(addNum > 0){
          for(let i = 0; i < addNum;i++){
            this.showGuest()
          }
        }
        //客人离开
        this.leave();
        //客人心情变化
        this.updateMood();
      }
    },

    start () {

    },

    onDestroy(){
      com.data.isStopGuestTimer = false;
    },
    // update (dt) {},

    changeMood: function(node,guestMood){
      if(guestMood > 0 && guestMood <= 30 && node.name != "mood_2"){
        cc.loader.loadRes("mood/2", cc.SpriteFrame, function(err, spriteFrame){
          node.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })
      }
      else if(guestMood > 30 && guestMood <= 60 && node.name != "mood_1"){
        cc.loader.loadRes("mood/1", cc.SpriteFrame, function(err, spriteFrame){
          node.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })
      }
      /*
      cc.loader.loadRes(imageName, cc.SpriteFrame, function(err, spriteFrame){
        node.getComponent(cc.Sprite).spriteFrame = spriteFrame
      })
      */
    },

    showGuest: function(){
      var that = this;
      var character = characters.data.character;
      var person = characters.data.show(com.data.guests);
      var guestNum = com.data.getGuestPosition(person);
      if(guestNum !== false){
        var imageName = "character/" + person.name;
        cc.loader.loadRes(imageName,cc.SpriteFrame,function(err,spriteFrame){
          var node = new cc.Node;
          //node.addComponent(cc.Sprite).spriteFrame = spriteFrame;
          var sp = node.addComponent(cc.Sprite);
          sp.spriteFrame = spriteFrame;
          node.name = person.name;
          node.scaleX = 0.4;
          node.scaleY = 0.9;
          //that.node.addChild(node);
          node.parent = that.node;
          node.x = that.position[guestNum]
          node.anchorY = 0;
          cc.loader.loadRes('talk',cc.SpriteFrame,function(err,spriteFrame){
            var talkNode = new cc.Node();
            var tsp = talkNode.addComponent(cc.Sprite);
            tsp.spriteFrame = spriteFrame;
            talkNode.name = "talk"
            talkNode.scaleX = 2;
            talkNode.scaleY = 2;
            talkNode.anchorY = 0.5;
            node.addChild(talkNode);
            talkNode.x = 150;
            talkNode.y = 250;

            //添加监听事件
            node.on(cc.Node.EventType.TOUCH_START,that.guestTalk,that)
          })
          cc.loader.loadRes('mood/0', cc.SpriteFrame, function(err,spriteFrame){
            var moodNode = new cc.Node();
            var msp = moodNode.addComponent(cc.Sprite);
            msp.spriteFrame = spriteFrame
            moodNode.name = "mood_0";
            moodNode.scaleX = 2;
            moodNode.scaleY = 2;
            moodNode.anchorY = 0.5;
            node.addChild(moodNode);
            moodNode.y =  node.height + 70;
          })
        })
      }

    },
    //发起对话
    guestTalk: function(e) {
      var node = e.target;
      var name = node.name;
      var guest = characters.data.findByName(name);
      console.log(dialog)
      var food = foodMenu.data.getFood();
      var talk = dialog.data.getGreeting(guest.type);
      var number = dialog.data.getNumber(guest.type);

      var guestTalk = "";
      guestTalk += talk[0];
      guestTalk += food.chinese;
      if(talk.length > 1){
        guestTalk += talk[1];
      }
      guestTalk += number[1];
      this.dialogBtn.getComponent('dialogBtn').mouseStart();
      var label = this.order.getComponent(cc.Label);
      label.string = guestTalk;
      this.order.parent.opacity = 255;

      this.dialogBtn.getComponent(cc.Button).interactable = true;
      //this.order.string = guestTalk
      //var guestIndex = com.data.findGuestByName(name)
      var guestIndex = com.data.findGuestByName(name)
      com.data.guests[guestIndex].food = food;
      com.data.guests[guestIndex].number = number[0];
      com.data.saveDialog(guest.appearance,guestTalk)
      //销毁对话提示信息
      for(let i = 0; i < node.childrenCount; i++){
        if(node.children[i].name == "talk"){
          node.children[i].destroy();
        }
      }
      node.off(cc.Node.EventType.TOUCH_START,this.guestTalk,this);
    },

    //客人评价
    guestEvaluation: function(guest) {
      if(guest.evaluation == "tasteGood"){
        com.data.praiseNum ++;
      }
      var guestTalk = dialog.data.getEvaluation(guest.guest.type, guest.evaluation);
      var label = this.order.getComponent(cc.Label);
      label.string = guestTalk;
      this.order.parent.opacity = 255;
      this.dialogBtn.getComponent(cc.Button).interactable = true;
      //com.data.leaveGuest.push(com.data.guests[j]);
      //this.leave();
      var dialogBtn = this.dialogBtn.getComponent('dialogBtn')
      dialogBtn.evaluationGuest = guest
    },
    findLeaveGuest: function(){
      for(var j = 0; j < com.data.guests.length; j++){
          var str = JSON.stringify(com.data.guests[j]);
          if(str !== "{}"){
            var node;
            for(let i = 0; i < this.node.childrenCount; i++){
              if(this.node.children[i].name == com.data.guests[j].guest.name){
                node = this.node.children[i]
              }
            }
            var guestMood = com.data.guests[j].mood;
            if(guestMood <= 0 && node){
              //离开
              com.data.leaveGuest.push(com.data.guests[j]);
              this.leave();
            }
            else if(node){
              var mood
              for(let i = 0; i < node.childrenCount; i++){
                //if(node.children[i].name != "talk"){
                if(node.children[i].name != "talk"){
                  mood = node.children[i]
                }
              }
              this.changeMood(mood,guestMood)
              com.data.guests[j].mood -= 5;
            }

          }
        }
    },
    leave: function(){
      console.log("leave")
      console.log(com.data.guests)
      console.log(com.data.leaveGuest.length)
      while(com.data.leaveGuest.length != 0){
        var leaveOne = com.data.leaveGuest[0];
        var allGuests = this.node.children;
        for(let i = 0; i < allGuests.length; i++){
          if(allGuests[i].name == leaveOne.guest.name){
            var action = cc.moveBy(0.5,0,-300).easing(cc.easeCubicActionOut());
            allGuests[i].runAction(action);
            var timer = setTimeout(function(){
              allGuests[i].destroy();
              clearTimeout(timer)
            },500)
            com.data.guestsNum --;
          }
        }
        var index = com.data.findGuestByName(leaveOne.guest.name);
        console.log(leaveOne.guest.name)
        if(index === false){
          console.log("error: can't find leave guest named" + leaveOne.guest.name)
        }
        else{
          //删除聊天记录
          for(var i = 0; i <com.data.dialogs.length; i++){
            if(com.data.dialogs[i].appearance == com.data.guests[index].guest.appearance){
              com.data.dialogs.splice(i,1)
            }
          }
          //清盘
          for(let j = 0; j <this.dishes.children[index].childrenCount; j++){
            this.dishes.children[index].children[j].destroy();
          }
          //付钱
          var money = com.data.money;
          var endMoney = parseFloat(com.data.guests[index].money) + money;
          var that = this;
          var moneyTimer = setInterval(function(){
            if(money+1 < endMoney){
              money = (money + 1);
              that.money.string = money.toFixed(2) + ""
            }
            else if(money+1 > endMoney&&money < endMoney){
              money = money + 0.1;
              that.money.string = money.toFixed(2)+""
            }
            else{
              clearInterval(moneyTimer);
              com.data.money = parseFloat(endMoney);
              console.log(com.data.money)
              that.money.string = parseFloat(endMoney).toFixed(2) + ""
            }
          },100)

          com.data.guests[index] = {};
          com.data.leaveGuest.splice(0,1);
          console.log(com.data.guestsNum);
          if(com.data.guestsNum == 0 && com.data.timeForGame > 0){
            setTimeout(()=>{
              this.showGuest();
              com.data.guestsNum++;
            },500)
          }
          else{
            setTimeout(()=>{
              //游戏结束 ： 显示今天的营业详情
              console.log("Game Over");
              com.data.clearTime();
              var account = cc.instantiate(this.account);
              account.parent = this.node.parent.parent;
              var children = account.children;
              console.log(children);
              var userData = JSON.parse(cc.sys.localStorage.getItem('userData'));
              console.log(userData);
              //天数
              var dayNum = children[1].children[1].getComponent(cc.Label);
              console.log(dayNum)
              dayNum.string = userData.day;
              //销售额
              var total = children[3].getComponent(cc.Label);
              total.string = (com.data.money - userData.money).toFixed(2);
              //利润
              var profit = children[5].getComponent(cc.Label);
              var profitMoney = (com.data.money - userData.money - 10).toFixed(2);
              profit.string = profitMoney;
              if(profitMoney >= 0){
                children[5].color = new cc.Color().fromHEX('#A46556');
              }
              else{
                children[5].color = new cc.Color().fromHEX('#7EA456');
              }
              //好评数
              var praise = children[6].getComponent(cc.Label);
              praise.string = com.data.praiseNum;
              //保存游戏数据
              userData.day++;
              userData.money = com.data.money;
              cc.sys.localStorage.setItem('userData',JSON.stringify(userData));
              children[7].on('click',function(){
                //清空所有的数据
                com.data.restoreData()
                //回退到第几天页面
                cc.director.loadScene("SenceEnter")
              })
            },1000)
          }
        }
      }
    },

    updateMood: function(){
      var guests = com.data.guests;
      for(var i = 0; i < guests.length; i++){
        if(JSON.stringify(guests[i]) !== "{}"){
          var mood = guests[i].mood;
          for(var j = 0; j < this.node.childrenCount; j++){
            var thisGuest = this.node.children[j]
            //console.log(thisGuest)
            if(thisGuest.name == guests[i].guest.name){
              for(var k = 0; k < thisGuest.childrenCount; k++){
                if(thisGuest.children[k].name != "talk"){
                  this.changeMood(thisGuest.children[k], mood)
                }
              }
            }
          }
        }
      }
    },

});
