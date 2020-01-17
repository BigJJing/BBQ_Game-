
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
      //顾客
      guests:{
        default: null,
        type: cc.Node
      },
      dishes:{
        default: null,
        type: cc.Node
      },
      trash:{
        default: null,
        type: cc.Node
      },
      targetOriginX: 0,
      targetOriginY: 0,
      isTrashOpen:false
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
        //com.data.calcTime();
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
      //如果移动到垃圾桶，则打开垃圾桶
      var trashLeft =  this.trash.x - this.trash.width/2;
      var trashRight = this.trash.x + this.trash.width/2;
      var trashTop = this.trash.y + this.trash.height/2 - this.grill.y;
      var trashBottom = this.trash.y - this.trash.height/2 - this.grill.y ;

      var anim = this.trash.getComponent(cc.Animation);
      if(target.x >= trashLeft && target.x < trashRight && target.y >= trashBottom && target.y < trashTop){
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

    },

    mouseEnd: function(e){
      var target = e.target;

      var paprika = this.paprika.getComponent('all');
      var cuminPowder = this.cuminPowder.getComponent('all');
      var oil = this.oil.getComponent('all');

      //没有拿起调料时
      if(!(paprika.isSelect||cuminPowder.isSelect||oil.isSelect)){
        //判断是移动还是翻转食物(没有移动即是翻转)
        if((target.x < this.targetOriginX+5 && target.x > this.targetOriginX-5) && (target.y < this.targetOriginY+5 && target.y > this.targetOriginY-5)){
          //食物翻面
          var ripe = 0;
          var strandsInGrill = com.data.strandsInGrill;
          for( let i=0; i<strandsInGrill.length; i++){
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
            if(ripe < 10){

            }
            else if(ripe>=10 && ripe< 20){
              name+= "_1"
            }
            else if(ripe>=20 && ripe<40){
              name+= "_2"
            }
            else if(ripe >= 40){
              name+= "_3"
            }
            this.changeFoodRipe(name,targetChild[i])
          }
        }
        else{
          var grillLeft = - this.grill.width/2 + 50;
          var grillRight = this.grill.width/2 - 50;
          var grillTop =  this.grill.height/2;
          var grillBottom = - this.grill.height/2;

          var trashLeft =  this.trash.x - this.trash.width/2;
          var trashRight = this.trash.x + this.trash.width/2;
          var trashTop = this.trash.y + this.trash.height/2 - this.grill.y;
          var trashBottom = this.trash.y - this.trash.height/2 - this.grill.y ;

          //放在烤炉上
          if(target.x >= grillLeft && target.x <= grillRight && target.y <= grillTop && target.y >= grillBottom){
            //检查是否把节点移到了食物上
            var foods = this.node.children;
            var targetLeft = target.x - target.width/2;
            var targetRight = target.x + target.width/2;
            for(let i = 0; i < foods.length; i++){
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
            return;
          }
          //放在垃圾桶里
          else if(target.x >= trashLeft && target.x < trashRight && target.y >= trashBottom && target.y < trashTop){
            var action = cc.spawn(cc.scaleTo(0.2,0,0),cc.moveBy(0.2,0,0)).easing(cc.easeCubicActionOut())
            var anim = this.trash.getComponent(cc.Animation);
            target.runAction(action)
            this.isTrashOpen = false;
            anim.play('trashClose');

            target.off(cc.Node.EventType.TOUCH_MOVE, this.mouseMove, this);
            target.off(cc.Node.EventType.TOUCH_END, this.mouseEnd, this);
            //在action播放完成后再销毁节点，否则action会跳过
            setTimeout(function () {
              target.destroy();
            }.bind(this), 200);
          }
          else{
            var guestsPosition = []

            for(let i = 0; i < this.guests.childrenCount;i++){
              var guestNode = this.guests.children[i];
              var guestTop = this.guests.x + guestNode.height;
              var guestBottom = this.guests.x;  //桌子的top
              var guestLeft = guestNode.x - guestNode.width/2;
              var guestRight = guestNode.x + guestNode.width/2;
              guestsPosition.push({
                top: guestTop,
                bottom: guestBottom,
                left: guestLeft,
                right: guestRight
              })
              //食物递给客人
              if(target.x >= guestLeft && target.x <= guestRight && target.y <= guestTop && target.y >= guestBottom){
                var guest = com.data.guests[com.data.findGuestByName(guestNode.name)];
                //判斷是否已經點單
                if(guest.food){
                  var dish = this.dishes.children[guest.id];
                  var timerX = setTimeout(function(){
                    target.parent = dish;
                    target.zIndex = dish.zIndex + 1;
                    var w = (dish.width/2 -20);
                    let foodX = -w + Math.floor(w * Math.random()) + 20
                    var action = cc.spawn(cc.scaleTo(0.2,0.2,0.2),cc.moveTo(0.2,foodX,0)).easing(cc.easeCubicActionOut());
                    target.runAction(action);
                    clearTimeout(timerX)
                  },0)
                  //找到此串的信息
                  var strands = com.data.strandsInGrill;
                  var score = 100;  //食物分数
                  var isTrueName = false; //判断是否是对的食物原料
                  var strandName = "";
                  for(var k = 1; k < target.childrenCount; k++){
                    strandName += target.children[k].name;
                  }
                  if(guest.food.name == strandName){
                    isTrueName = true;
                    //根据name找到对应串判断是否已经达到要求
                    for(let j = 0; j < strands.length; j++){
                      if(strands[j].name == target.name){
                        //1.没熟
                        if(strands[j].front < 20||strands[j].back < 20){
                          score -= 20;
                          guest.evaluation = "uncooked"
                        }
                        //2.糊了
                        else if(strands[j].front > 40||strands[j].back > 40){
                          score -= 20;
                          guest.evaluation = "thanCooked"
                        }
                        //调料放错了

                      }
                    }
                  }
                  if(isTrueName == false){
                    score -= 40;
                    guest.evaluation = "falseFood"
                  }
                  guest.money = guest.money + score * 0.01 * guest.food.price;
                  guest.number --;
                  //取消监听
                  target.off(cc.Node.EventType.TOUCH_MOVE, this.mouseMove,this);
                  target.off(cc.Node.EventType.TOUCH_START, this.mouseStart,this);
                  target.off(cc.Node.EventType.TOUCH_END,this.mouseEnd,this);
                  target.off(cc.Node.EventType.TOUCH_CANCEL,this.mouseEnd,this);
                  //判断烤串是否已经全部上完
                  if(guest.number == 0){
                    //客人给出评价
                    var Character = this.guests.getComponent('character');
                    Character.guestEvaluation(guest)
                  }
                  return;
                }
                else{
                  //还没点单提示
                  console.log("这位顾客还没点单呢");
                }
              }
          }

        }
          //位置复原
          target.x = this.targetOriginX;
          target.y = this.targetOriginY;
          target.zIndex --;
        }
      }
      //添加调料时
      else{
        //增加属性
        var strandsInGrill = com.data.strandsInGrill;
        for(let i = 0; i < strandsInGrill.length; i++){
          if(strandsInGrill[i].name == target.name){
            var type = "";
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
    changeFoodRipe: function(name,target){
      cc.loader.loadRes(name, cc.SpriteFrame, function (err, spriteFrame) {
          target.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });

    },

    //添加调料
    addSeasoning: function(target,type){
      var color = "";
      if(type == "paprika" || type == "cuminPowder" ){
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
            var action = cc.spawn(cc.fadeTo(2,0),cc.scaleTo(2,0.2,0.2)).easing(cc.easeCubicActionOut())
            node.runAction(action);
            setTimeout(function(){
              node.destroy();
            },2000)
          }
        });
      }
    }
});
