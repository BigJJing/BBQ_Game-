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
      grill: {
        default: null,
        type: cc.Node
      },
      //辣椒粉
      paprika:{
        default: null,
        type: cc.Node
      },
      //孜然粉
      cuminPowder:{
        default: null,
        type: cc.Node
      },
      //油
      oil:{
        default: null,
        type: cc.Node
      },
      targetOriginX: 0,
      targetOriginY: 0,
    },

    onLoad () {
      var children = this.node.children;
      for(var i = 0; i < children.length; i++){
        children[i].on(cc.Node.EventType.TOUCH_MOVE, this.mouseMove,this);
        children[i].on(cc.Node.EventType.TOUCH_START, this.mouseStart,this);
        children[i].on(cc.Node.EventType.TOUCH_END,this.mouseEnd,this);
        children[i].on(cc.Node.EventType.TOUCH_CANCEL,this.mouseEnd,this);
      }
      if(com.data.timer == null){
        com.data.calcTime();
      }
    },

    mouseStart: function(e){
      var target = e.target;
      this.targetOriginX = target.x;
      this.targetOriginY = target.y;
      target.zIndex ++;
      var paprika = this.paprika.getComponent('all');
      var cuminPowder = this.cuminPowder.getComponent('all');
      var oil = this.oil.getComponent('all');
      console.log(paprika.isSelect,cuminPowder.isSelect,oil.isSelect)

    },

    mouseMove: function(e){
      var target = e.target;
      var paprika = this.paprika.getComponent('all');
      var cuminPowder = this.cuminPowder.getComponent('all');
      var oil = this.oil.getComponent('all');
      if(!(paprika.isSelect||cuminPowder.isSelect||oil.isSelect)){
        //移动
        var delta = e.touch.getDelta();
        target.x += delta.x;
        target.y += delta.y;
      }

    },

    mouseEnd: function(e){
      var target = e.target;

      var paprika = this.paprika.getComponent('all');
      var cuminPowder = this.cuminPowder.getComponent('all');
      var oil = this.oil.getComponent('all');

      //没有拿起调料时
      if(!(paprika.isSelect||cuminPowder.isSelect||oil.isSelect)){
        //判断是移动还是翻转食物(没有移动即是翻转)
        if(target.x == this.targetOriginX && target.y == this.targetOriginY ){
          //食物翻面
          var ripe = 0;
          var strandsInGrill = com.data.strandsInGrill;
          for( var i=0; i<strandsInGrill.length; i++){
            if(strandsInGrill[i].name == target.name){
              if(com.data.strandsInGrill[i].selectedFace == "back"){
                com.data.strandsInGrill[i].selectedFace = "front"
                ripe = com.data.strandsInGrill[i].back;  //成熟度
              }
              else{
                com.data.strandsInGrill[i].selectedFace = "back";
                ripe = com.data.strandsInGrill[i].front;
              }
            }
          }
          var originScaleX = target.scaleX;
          var originScaleY = target.scaleY;
          var action = cc.sequence(
            cc.spawn(cc.moveBy(0.05,5,5),cc.scaleTo(0.1,0.3,originScaleY)),
            cc.spawn(cc.moveBy(0.05,-5,-5),cc.scaleTo(0.1,originScaleX,originScaleY))
          )
          target.runAction(action)

          var targetChild = target.children
          for(let i=1; i<targetChild.length; i++){
            var name = targetChild[i].name;
            if(ripe < 30){

            }
            else if(ripe>=30 && ripe< 60){
              name+= "_1"
            }
            else if(ripe>=60 && ripe<90){
              name+= "_2"
            }
            else if(ripe >= 90){
              name+= "_3"
            }
            console.log(name)
            this.changeFoodRipe(name,targetChild[i])
          }
        }
        else{
          var grillLeft = - this.grill.width/2 + 50;
          var grillRight = this.grill.width/2 - 50;
          var grillTop =  this.grill.height/2;
          var grillBottom = - this.grill.height/2;
          if(target.x >= grillLeft && target.x <= grillRight && target.y <= grillTop && target.y >= grillBottom){
            //检查是否把节点移到了食物上
            var foods = this.node.children;
            var targetLeft = target.x - target.width/2;
            var targetRight = target.x + target.width/2;
            for(var i = 0; i < foods.length; i++){
              var foodLeft = foods[i].x - foods[i].width/2;
              var foodRight = foods[i].x + foods[i].width/2;
              if(!(targetRight < foodLeft || targetLeft > foodRight) && foods[i] != target){
                //位置复原
                target.x = this.targetOriginX;
                target.y = this.targetOriginY;
                target.zIndex --;
                return;
              }
            }
            //移动到新位置
            target.y = 0;
          }
          else{
            //位置复原
            target.x = this.targetOriginX;
            target.y = this.targetOriginY;
          }
          target.zIndex --;
        }
      }
      //添加调料时
      else{
        //增加属性
        var strandsInGrill = com.data.strandsInGrill;
        for(var i = 0; i < strandsInGrill.length; i++){
          if(strandsInGrill[i].name == target.name){
            var type = "";
            console.log(paprika.isSelect,cuminPowder.isSelect,oil.isSelect)
            if(paprika.isSelect){
              strandsInGrill[i].seasoning.push("paprika");
              type = "paprika";
            }
            else if(cuminPowder.isSelect){
              strandsInGrill[i].seasoning.push("cuminPowder");
              type = "cuminPowder";
            }
            else if(oil.isSelect){
              strandsInGrill[i].seasoning.push("oil");
              type = "oil";
            }
            this.addSeasoning(target,type)
          }
        }
      }
    },

    //改变食物熟度
    changeFoodRipe(name,target){
      cc.loader.loadRes(name, cc.SpriteFrame, function (err, spriteFrame) {
          target.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });

    },

    //添加调料
    addSeasoning: function(target,type){
      var color = "";
      if(type == ""){
        console.error("no seasoning");
      }
      else if(type == "paprika" || type == "cuminPowder" ){
        switch(type){
          case "paprika":
            color = "bf0000";
            break;
          case "cuminPowder":
            color = "#bf7200";
            break;
        }
        for(var j=1 ;j<target.childrenCount; j++){
          var targetChild = target.children[j];
          //绘制
          var grapNode = new cc.Node();
          grapNode.parent = targetChild;
          var ctx = grapNode.addComponent(cc.Graphics);
          ctx.fillColor = new cc.Color().fromHEX(color);
          for(var i=0;i<100;i++){
            var randomX = (5-targetChild.width/2) + (targetChild.width - 5)*Math.random();
            var randomY = (5-targetChild.height/2) + (targetChild.height - 5)*Math.random();
            var randomR = Math.random();
            ctx.circle(randomX,randomY,randomR);
            ctx.fill();
          }
        }
      }
      else if(type == "oil"){
        cc.loader.loadRes("oil", cc.SpriteFrame, function (err, spriteFrame) {
          for(var i=0;i <target.childrenCount;i++){
            var targetChild = target.children[i];
            var node = new cc.Node();
            targetChild.addChild(node);
            var sp = node.addComponent(cc.Sprite);
            sp.spriteFrame = spriteFrame;
            node.width = targetChild.width;
            node.height = targetChild.height;
            //添加动画
            var action = cc.spawn(cc.fadeTo(2,0),cc.scaleTo(2,0.2,0.2))
            node.runAction(action);
            setTimeout(function(){
              node.destroy();
              console.log(targetChild)
            },2000)
          }
        });
      }
    }
});
