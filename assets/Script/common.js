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
    //保存烤架上的食物
    foodPlace:null,
    //保存处理板上的食物
    presentStrand:null,
    //保存客人
    guest:null,
    //烤的时间计时器
    timer:null,
    //当前的客人信息：基本信息，点的食物，
    /*
      guests{
        guest:{
          name:"",
          type:"kind",
          appearance:""
        },
        food:"",
        number:1
    }
    */
    guests:[
        {},{},{},{}
    ],
    //保存对话
    /*
    {
      appearance: "",
      content:""
    }
    */
    dialogs:[

    ],
    //游戏设置
    //一个时间游戏计时器：随机在某个时间点来客人
    settings:{
      minTimeForGuest: 10000, //单位：ms
      guestNumber: 10,  //本场游戏来的客人总数
    },
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
    },
    //判断客人是否已满(四个)
    isGuestFull(){
      var arr = [];
      for(var i = 0; i < this.guests.length; i++){
        var str = JSON.stringify(this.guests[i]);
        if(str == "{}"){
          arr.push(i)
        }
      }
      if(arr.length == 0){
        return true;  //满了
      }
      else{
        return false;   //没满
      }
    },
    //获取客人的随机位置并返回
    getGuestPosition(person){
      var arr = [];
      for(var i = 0; i < this.guests.length; i++){
        var str = JSON.stringify(this.guests[i]);
        if(str == "{}"){
          arr.push(i)
        }
      }
      var num = Math.floor(Math.random() * arr.length);
      this.guests[arr[num]].guest = person;
      return arr[num]
    },
    findGuestByName(name){
      console.log(name)
      console.log(this.guests)
      for(var i = 0; i < this.guests.length; i++){
        if(JSON.stringify(this.guests[i])!= "{}" && this.guests[i].guest.name == name){
            return i;
        }
      }
      console.log("error in " + name)
      return false;
    },
    //保存对话：客人特征，对话内容
    saveDialog(appearance,content){
      this.dialogs.push({
        appearance: appearance,
        content:content
      })
    }

  },



};
