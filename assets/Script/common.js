//全局变量

module.exports = {

  data: {
    strand: [],   //当前串
    strands:[],   //所有串 [{type:"typeName","length":Number}]
    strandsInGrill:[],  //在烤的串 [{name:"name",typeName:"typeName",front:0-2,back:0-2,seasoning:["oil",...]}]
    presentSize:0,  //当前串的大小的
    maxSize:6, //每串能装的大小
    //所有食物的占位大小
    foods:{
      sausage: 6,
      potato: 2
    },
    maxBasketSize: 3, //篮子中能放食物的最多种类
    //保存篮子node对象
    basket: null,
    foodPlace:null,
    timer:null,
    calcTime(){
      var that = this;
        that.timer=setInterval(function(){
        for(var i=0;i<that.strandsInGrill.length;i++){
          if(that.strandsInGrill[i].selectedFace == "back"){
            that.strandsInGrill[i].back += 5
          }
          else{
            that.strandsInGrill[i].front += 5
          }
        }
      },5000)
    },
    clearTime(){
      clearInterval(this.timer)
    }

  },



};
