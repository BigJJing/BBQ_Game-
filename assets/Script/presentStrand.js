
var com = require('common');

cc.Class({
    extends: cc.Component,

    properties: {
      //篮子
      basket: {
        default: null,
        type: cc.Node
      },
      //垃圾桶
      trash: {
        default: null,
        type: cc.Node
      },
      //动态生成的串串
      presentStrand: {
        default: null,
        type: cc.Node
      },
      //串串所在处理台上的位置
      x: -3,
      y: -117,
      //串串所处篮子中的位置
      position: 0,
      isTrashOpen:false
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      var presentStrand = this.createPresentStrand();
      this.initStick(presentStrand);
      this.presentStrand = presentStrand;

      this.presentStrand.on(cc.Node.EventType.TOUCH_MOVE, this.mouseMove, this);
      this.presentStrand.on(cc.Node.EventType.TOUCH_END, this.mouseEnd, this);
    },

    start () {


    },

    //移动时间
    mouseMove: function(event){
      //判断是否可以移动（当串串上只有一根签字时无法移动）
      var data = com.data;
      if(data.presentSize !== 0){
        var delta = event.touch.getDelta();
        this.presentStrand.x += delta.x;
        this.presentStrand.y += delta.y;

        //如果移动到垃圾桶，则打开垃圾桶
        var trashLeft =  this.trash.x - this.trash.width/2;
        var trashRight = this.trash.x + this.trash.width/2;
        var trashTop = this.trash.y + this.trash.height/2;
        var trashBottom = this.trash.y - this.trash.height/2;

        var anim = this.trash.getComponent(cc.Animation);
        if(this.presentStrand.x >= trashLeft && this.presentStrand.x < trashRight && this.presentStrand.y >= trashBottom && this.presentStrand.y < trashTop){
          //打开垃圾桶
          if(!this.isTrashOpen){
            this.isTrashOpen = true;
            anim.play('trashOpen');
          }
        }
        else{
          if(this.isTrashOpen){
            this.isTrashOpen = false;
            anim.play('trashClose');
          }
        }
      }
      else{
        //提示用户
      }

    },

    //取消移动
    mouseEnd: function(event){
      var basketParent = cc.find("Canvas").getChildByName('Main Camera').getChildByName('basket');
      this.basket = basketParent.getChildByName('container');

      var basketLeft = basketParent.x - this.basket.width/2;
      var basketRight = basketParent.x + this.basket.width/2;
      var basketTop =  basketParent.y + this.basket.height/2;
      var basketBottom = basketParent.y - this.basket.height/2;

      var trashLeft =  this.trash.x - this.trash.width/2;
      var trashRight = this.trash.x + this.trash.width/2;
      var trashTop = this.trash.y + this.trash.height/2;
      var trashBottom = this.trash.y - this.trash.height/2;

      var data = com.data;
      //食物如果放在篮子中：放置的位置在篮子范围内，并且
      if(this.presentStrand.x >= basketLeft && this.presentStrand.x < basketRight && this.presentStrand.y >= basketBottom && this.presentStrand.y < basketTop){
        //改变全局变量中的数据
        var object = {};
        object.type = data.strand;
        var returnData = this.getNumber(data.strand);
        //没增加
        var height = this.basket.height- 30;
        if(returnData.length == 1){
          if(data.strands.length == data.maxBasketSize){
            this.presentStrand.x = this.x;
            this.presentStrand.y = this.y;
            return;
          }
          else{
            object.length = returnData.length;
            data.strands.push(object);
            var y = height/2 - height/data.maxBasketSize * (data.strands.length - 1) - 20;
          }
        }
        else{
          data.strands[returnData.index].length++;
          var y = height/2 - height/data.maxBasketSize * returnData.index + 5*(returnData.length-1) - 20;
        }
        data.strand=[];
        data.presentSize=0;
        //变小且移动位置
        var action = cc.spawn(cc.scaleTo(0.2,0.4,0.4), cc.rotateBy(0.2,90), cc.moveBy(0.2,-20,y))
        this.presentStrand.runAction(action)
        //将此节点添加到basket节点下
        this.presentStrand.parent = this.basket;
        this.presentStrand.x = 0;
        this.presentStrand.y = 0;
        //取消监听
        this.presentStrand.off(cc.Node.EventType.TOUCH_MOVE, this.mouseMove, this);
        this.presentStrand.off(cc.Node.EventType.TOUCH_END, this.mouseEnd, this);

        //再创建一个新的presentStrand节点
        var presentStrand = this.createPresentStrand();
        this.initStick(presentStrand);
        this.presentStrand = presentStrand;
        this.presentStrand.on(cc.Node.EventType.TOUCH_MOVE, this.mouseMove, this);
        this.presentStrand.on(cc.Node.EventType.TOUCH_END, this.mouseEnd, this);
      }

      //食物如果放在了垃圾桶里
      else if(this.presentStrand.x >= trashLeft && this.presentStrand.x < trashRight && this.presentStrand.y >= trashBottom && this.presentStrand.y < trashTop){
        var action = cc.spawn(cc.scaleTo(0.2,0,0),cc.moveBy(0.2,0,0))
        var anim = this.trash.getComponent(cc.Animation);
        this.presentStrand.runAction(action)
        this.isTrashOpen = false;
        anim.play('trashClose');

        this.presentStrand.off(cc.Node.EventType.TOUCH_MOVE, this.mouseMove, this);
        this.presentStrand.off(cc.Node.EventType.TOUCH_END, this.mouseEnd, this);
        //在action播放完成后再销毁节点，否则action会跳过
        setTimeout(function () {
          this.presentStrand.destroy();
          //再创建一个新的presentStrand节点
          var presentStrand = this.createPresentStrand();
          this.initStick(presentStrand);
          this.presentStrand = presentStrand;
          this.presentStrand.on(cc.Node.EventType.TOUCH_MOVE, this.mouseMove, this);
          this.presentStrand.on(cc.Node.EventType.TOUCH_END, this.mouseEnd, this);
          data.strand = [];
          data.presentSize = 0;
        }.bind(this), 200);
      }
      //如果没有放在篮子里 ，则自动回原来的地方
      else {
        this.presentStrand.x = this.x;
        this.presentStrand.y = this.y;
      }
    },

    //显示木棍
    initStick: function(presentStrand){
      //var that = this;
      cc.loader.loadRes('stick', cc.SpriteFrame, function(err, spriteFrame){
        var node = new cc.Node();
        node.parent = presentStrand;
        var sp = node.addComponent(cc.Sprite);
        sp.spriteFrame = spriteFrame;

      })
    },

    //初始化presentStrand节点：存放木棍和食物
    createPresentStrand: function(){
      var node = new cc.Node();
      node.parent = this.node;
      node.name = 'presentStrand';
      node.x = this.x;
      node.y = this.y;
      node.height = 200;
      node.width = 20;
      return node;
    },

    //获取strands中name的数量
    getNumber: function(name){
      var data = com.data;
      var len = 1;
      var i = -1;
      data.strands.forEach(function(item,index){
        if(item.type.toString() == name.toString()){    //不能直接比較数组，所以要先化成字符串在比较
          len += item.length;
          i = index;
        }
      })
      return {"length":len, "index":i};
    },

});
