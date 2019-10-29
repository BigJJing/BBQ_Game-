// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       isSelect:false,
       //辣椒粉
       paprika:{
         default: null,
         type: cc.Node
       },
       //孜然粉
       CuminPowder:{
         default: null,
         type: cc.Node
       },
       //油
       oil:{
         default: null,
         type: cc.Node
       },
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
      this.node.on(cc.Node.EventType.TOUCH_START, this.mouseStart, this);
      this.node.on(cc.Node.EventType.TOUCH_END, this.mouseEnd, this);
    },

    start () {

    },

    //鼠标点击事件
    mouseStart:function(e){
      console.log(e.target)
      if(this.node.opacity == 0){
        this.node.opacity = 255;
        cc.game.canvas.style.cursor = "";
      }
      else{
        this.reNewAll();
        var target = e.target || e.currentTarget
        if(target.name == "seasoning_paprika"){
          cc.game.canvas.style.cursor = "url('/res/import/09/09970fcf-9605-4983-a799-e0df3ce2cb2a.png'),auto";
        }
        else if(target.name == "seasoning_CuminPowder"){
          cc.game.canvas.style.cursor = "url('/res/import/07/075e9abc-a512-4e7b-8bea-bb93b30f5557.png'),auto";
        }
        else if(target.name == "seasoning_oli"){
          cc.game.canvas.style.cursor = "url('/res/import/a4/a42ccd2f-1a30-4456-9d0e-de2147d17477.png'),auto";
        }
        this.node.opacity = 0;
      }
    },

    //鼠标结束点击
    mouseEnd:function(){
      console.log("mouseEnd")
    },

    //位置还原
    reNewAll: function(){
      console.log("reNewAll")
      this.paprika.opacity = 255;
      this.CuminPowder.opacity = 255;
      this.oil.opacity = 255;
    },

});
