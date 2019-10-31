//全局变量

module.exports = {

  data: {
    strand: [],   //当前串
    strands:[],   //所有串
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
    foodPlace:null
  }

};
