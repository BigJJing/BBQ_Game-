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
    //保存客人Node
    guest:null,
    //烤的时间计时器
    timer:null,
    //计时（客人出现时间）
    timeShow:0,
    //当前的客人信息：基本信息，点的食物，
    /*
      guests{
        id:0  , //id为序号 0,1,2,3
        guest:{
          name:"",
          type:"kind",
          appearance:""
        },
        food:"",
        number:1,
        mood:120  //120秒就离开
    }
    */
    guests:[
        {},{},{},{}
    ],
    guestsNum:0,
    leaveGuest:[],
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
      timeForGame:10, //min
      timeForGuest: 10, //每n秒（5的倍数）内出现一个人，用来确定游戏的难度
    },
    calcTime(){
      var that = this;
      that.timer=setInterval(function(){
        //对食物的熟度计时
        for(var i=0;i<that.strandsInGrill.length;i++){
          if(that.strandsInGrill[i].selectedFace == "back"){
            that.strandsInGrill[i].back += 5
          }
          else{
            that.strandsInGrill[i].front += 5
          }
        }
        /*
        if(that.guestsNum==0){
          that.guestsNum = 1;
        }
        */
        //客人的出现计时
        if(that.timeShow == that.settings.timeForGuest){
          that.timeShow = -5;
          if(that.guestsNum < 4){
            that.guestsNum ++;
          }
        }
        that.timeShow += 5;
        //客人的心情计时
        for(var j = 0; j < that.guests.length; j++){
          var str = JSON.stringify(that.guests[j]);
          if(str !== "{}"){
            console.log(that.guests[j].mood)
            if(that.guests[j].mood <= 0){
              //离开
              that.leaveGuest.push(that.guests[j])
            }
            else{
              that.guests[j].mood -= 5;
            }

          }
        }
      },5000)
    },
    clearTime(){
      clearInterval(this.timer)
    },
    //获取客人的随机位置并返回
    getGuestPosition(person){
      console.log(person)
      var arr = [];
      for(var i = 0; i < this.guests.length; i++){
        var str = JSON.stringify(this.guests[i]);
        if(str == "{}"){
          arr.push(i)
        }
      }
      var num = Math.floor(Math.random() * arr.length);
      this.guests[arr[num]].guest = person;
      this.guests[arr[num]].mood = 30;
      return arr[num]
    },
    findGuestByName(name){
      console.log(name)
      for(var i = 0; i < this.guests.length; i++){
        if(JSON.stringify(this.guests[i])!= "{}" && this.guests[i].guest.name == name){
            return i;
        }
      }
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
