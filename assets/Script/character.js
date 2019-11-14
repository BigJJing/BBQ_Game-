var characters = require('data/characters')
var menu = require('data/menu')
var dialog = require('data/dialog')
var com = require('common');
cc.Class({
    extends: cc.Component,

    properties: {
      position:[],  //客人位置
      timerShow:null,
      timerLeave:null,
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
      talkingMan:{
        default:null,
        type: cc.Node
      },
      characters:{
        default:null,
        type: cc.Node
      }
    },

    onLoad () {
      //计算人物位置
      //获取盘子的位置（客人位置要和盘子的位置对齐）
      var children = this.dishes.children;
      for(let i = 0 ;i < children.length; i++){
        this.position.push(children[i].x)
      }
      //游戏开始2秒后人物出场
      if(com.data.guest == null){
        com.data.guestsNum = 1;
        var component = this;
        //cocos自带计时器：绑定组件，只执行一次，2后执行
        component.scheduleOnce(function() {
           // 这里的 this 指向 component
           this.showGuest();
       }, 2);
      }
      else{
        var guests = com.data.guest.children;
        //由于guests.length 会因为presentNode.parent = this.node 而自动变化，所以使用while
        while(guests.length != 0){
          var presentNode = guests[0]
          //为还没点单的客人添加监听
          if(presentNode.childrenCount > 0 ){
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
      }
      //客人离开
      this.leave();
      //控制客人出现
      var that = this;
      this.timerShow = setInterval(function(){
        if(com.data.guestsNum < 4){
          that.showGuest();
          com.data.guestsNum ++;
        }
      },com.data.settings.timeForGuest*1000)

      this.timerLeave = setInterval(function(){
        //心情为0时离开
        that.leave();
      },2000)
    },

    start () {

    },

    onDestroy(){
      clearInterval(this.timerShow)
      clearInterval(this.timerLeave)
    },
    // update (dt) {},

    showGuest: function(){
      var that = this;
      var character = characters.data.character;
      var person = characters.data.show(com.data.guests);
      var guestNum = com.data.getGuestPosition(person);
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
        node.x =  that.position[guestNum]
        cc.loader.loadRes('talk',cc.SpriteFrame,function(err,spriteFrame){
          var talkNode = new cc.Node();
          var tsp = talkNode.addComponent(cc.Sprite);
          tsp.spriteFrame = spriteFrame;
          talkNode.name = "talk"
          talkNode.scaleX = 3;
          talkNode.scaleY = 3;
          node.addChild(talkNode);
          talkNode.x = 200;
          talkNode.y = 100;
          //添加监听事件
          that.talkingMan = node;
          node.on(cc.Node.EventType.TOUCH_START,that.guestTalk,that)
        })
      })
    },
    //发起对话
    guestTalk: function(e) {
      var node = e.target;
      var name = node.name;
      var guest = characters.data.findByName(name);
      var food = menu.data.getFood();
      var talk = dialog.data.getGreeting(guest.type);
      var number = dialog.data.getNumber(guest.type);
      var guestTalk = "";
      guestTalk += talk[0];
      guestTalk += food.chinese;
      if(talk.length > 1){
        guestTalk += talk[1];
      }
      guestTalk += number[1];
      var label = this.order.getComponent(cc.Label);
      label.string = guestTalk;
      this.order.parent.opacity = 255;
      this.dialogBtn.getComponent(cc.Button).interactable = true;
      //this.order.string = guestTalk
      var guestIndex = com.data.findGuestByName(name)
      com.data.guests[guestIndex].id = guestIndex;
      com.data.guests[guestIndex].food = food.name;
      com.data.guests[guestIndex].number = number[0];
      com.data.saveDialog(guest.appearance,guestTalk)
      //销毁对话提示信息
      node.children[0].destroy();
      node.off(cc.Node.EventType.TOUCH_START,this.guestTalk,this);
    },

    leave: function(){
      while(com.data.leaveGuest.length != 0){
        var leaveOne = com.data.leaveGuest[0];
        var allGuests = this.node.children;
        for(var i = 0; i < allGuests.length; i++){
          if(allGuests[i].name == leaveOne.guest.name){
            allGuests[i].destroy();
            com.data.guestsNum --;
            com.data.leaveGuest.splice(0,1);
          }
        }
        var index = com.data.findGuestByName(leaveOne.guest.name);
        if(index === false){
          console.err("error: can't find leave guest named" + leaveOne.guest.name)
        }
        else{
          //删除聊天记录
          for(var i = 0; i <com.data.dialogs.length; i++){
            if(com.data.dialogs[i].appearance == com.data.guests[index].guest.appearance){
              com.data.dialogs.splice(i,1)
            }
          }
          com.data.guests[index] = {};
        }


      }
    }

});
