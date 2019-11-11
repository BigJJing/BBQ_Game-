var characters = require('data/characters')
var menu = require('data/menu')
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
        setTimeout(()=>this.showGuest(this),2000)
      }
      else{
        var guests = com.data.guest.children;
        //由于guests.length 会因为presentNode.parent = this.node 而自动变化，所以使用while
        while(guests.length != 0){
          var presentNode = guests[0]
          //为还没点单的客人添加监听
          if(presentNode.childrenCount > 0){
            presentNode.on(cc.Node.EventType.TOUCH_START,this.guestTalk,this)
          }
          //console.log(this.node)
          presentNode.parent = this.node
        }
        if(!com.data.isGuestFull()){
          var time = com.data.settings.minTimeForGuest + Math.floor(Math.random()*com.data.settings.minTimeForGuest)
          setTimeout(()=>this.showGuest(this),5000)
        }
      }

    },

    start () {

    },

    // update (dt) {},

    showGuest: function(){
      var that = this;
      var character = characters.data.character;
      var person = characters.data.show();
      var guestNum = com.data.getGuestPosition(person);
      var imageName = "character/" + person.name;
      console.log(that)
      console.log(that.node)
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
      if(!com.data.isGuestFull()){
        var time = com.data.settings.minTimeForGuest + Math.floor(Math.random()*com.data.settings.minTimeForGuest)
        setTimeout(()=>this.showGuest(this),5000)
      }
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
      com.data.guests[guestIndex].food = food.name;
      com.data.guests[guestIndex].number = number[0];
      com.data.saveDialog(guest.appearance,guestTalk)
      //销毁对话提示信息
      node.children[0].destroy();
      node.off(cc.Node.EventType.TOUCH_START,this.guestTalk,this);
    },

});
