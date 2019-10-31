// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var com = require('common');

cc.Class({
    extends: cc.Component,

    properties: {
        presentStrand: {
          default: null,
          type: cc.Node
        }
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      //监听点击事件
      this.node.on(cc.Node.EventType.TOUCH_START, this.mouseStart, this);
    },

    start () {

    },

    // update (dt) {},

    //鼠标点击事件
    mouseStart: function(e){
      this.presentStrand = cc.find("Canvas").getChildByName('Main Camera').getChildByName('presentStrand')
      //篮子中的食物用复数，拿出来的食物起单数，所以把name去掉结尾的s就是要加载的图片
      var name = e.target.name;
      var imageName  = "";
      for(var i = 0; i < name.length - 1; i++){
        imageName += name[i]
      }
      console.log(imageName);
      //生成添加食物动画

      //添加
      var data = com.data

      var afterSize = data.presentSize + data.foods[imageName];
      if(afterSize <= data.maxSize){
        this.createSingleFood(imageName);
        data.strand[data.strand.length] = imageName;
        data.presentSize = afterSize;
      }
      else{
        //data.presentSize = 0;
        //提醒要放到篮子
      }
    },

    //生成单个食物，并放置到砧板上
    createSingleFood: function(imageName){
      var that = this;
      cc.loader.loadRes(imageName, cc.SpriteFrame, function (err, spriteFrame) {
        var singleFood = new cc.Node();
        singleFood.parent = that.presentStrand;
        var sp = singleFood.addComponent(cc.Sprite);
        sp.spriteFrame = spriteFrame;
        singleFood.name = imageName;
        singleFood.scale = 0.5;
        singleFood.x = that.node.x;
        singleFood.y = that.node.y;
        //根据食物的最大宽度来确定串的宽度
        that.presentStrand.width = that.presentStrand.width < singleFood.width ? singleFood.width : that.presentStrand.width;
        var canvas = cc.view.getFrameSize();    //获取总画布宽高
        //计算中心的坐标x 和 变化我坐标y

        var x = -that.node.x;
        //var y = (that.presentStrand.y - that.presentStrand.height/4)/6 * (7-com.data.foods[imageName]);\
        console.log(singleFood.height);
        if(com.data.foods[imageName]==6){
          var y = -220
        }
        else{
          var y =100 - that.node.y - singleFood.height/2 - (6- com.data.presentSize - com.data.foods[imageName])*35 ;
        }
        //console.log()
        var action = cc.spawn(cc.moveBy(0.5,x,y), cc.scaleTo(0.5,1,1)).easing(cc.easeCubicActionOut());
        singleFood.runAction(action);
      });
    },
});
