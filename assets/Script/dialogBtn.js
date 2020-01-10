// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var com = require('../common')

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
        evaluationGuest:null,
        orderGuest:null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
      this.node.on(cc.Node.EventType.TOUCH_START, this.mouseStart, this);
    },

    // update (dt) {},
    mouseStart: function(){
      //音效
      this.AudioPlayer = cc.find("Audio").getComponent("audioManager");
      this.AudioPlayer.playPropClick();
      if(this.orderGuest !== null){
        let index = com.data.findGuestByName(this.orderGuest.guest.name);
        com.data.guests[index].isTalk = false;
        this.orderGuest = null
      }
      if(this.evaluationGuest != null){
        let index = com.data.findGuestByName(this.evaluationGuest.guest.name);
        com.data.guests[index].isTalk = false;
        //离开
        com.data.leaveGuest.push(this.evaluationGuest);
        this.characters.getComponent('character').leave();
        this.evaluationGuest = null;
      }
      this.dialog.opacity = 0
      this.node.getComponent(cc.Button).interactable = false;

      console.log(com.data.guests)
    }
});
