//全局变量

module.exports = {

  data: {
    //本场游戏时间:10min = 600s
    timeForGame:600,
    //显示的时间
    timeForGameDisplay:"00:00",
    //拥有的钱
    money: 0,
    //好评数
    praiseNum:0,
    strand: [],   //当前串
    strands:[],   //所有串 [{type:"typeName","length":Number}]
    //在烤的串
    /* [{
          name:"name",  //对应每个target.name, 唯一标识
          typeName:"typeName",
          front:0-2,    //20~40：熟了
          back:0-2,
          seasoning:["oil",...]
        }]
    */
    strands:[],
    //在烤炉上的串
    strandsInGrill:[],
    //当前串(在处理板上)的大小的
    presentSize:0,
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
        id:0  , //id座位号 ：0,1,2,3
        guest:{
          name:"",
          type:"kind",
          appearance:""
        },
        food:{},     // {  name: "potatopotatopotato",chinese: "土豆串",price:1,}
        number:1,
        mood:120,  //120秒就离开
        money:0,    //支付的费用
        evaluation:type,   //评价：type:选择最严重的(完美："tasteGood",食物错了："falseFood",没熟："uncooked"，烤糊了:"thanCooked")
        isTalk:false,     //是否正在对话
      }
    */
    guests:[
        {},{},{},{}
    ],
    guestsNum:0,
    leaveGuest:[],
    //客人出现计时是否关闭
    isStopGuestTimer:false,
    //保存对话
    /*
    {
      appearance: "",
      content:""
    }
    */
    dialogs:[],
    /*
    * 固定设置
    */
    maxSize:6, //每串能装的大小
    //所有食物的占位大小
    foods:{
      sausage: 6,
      potato: 2,
      mutton: 6,
    },
    maxBasketSize: 3, //篮子中能放食物的最多种类
    //游戏设置
    //一个时间游戏计时器：随机在某个时间点来客人
    settings:{
      timeForGame:10, //min
      timeForGuest: 100, //每n秒（5的倍数）内出现一个人，用来确定游戏的难度
    },
    clearTime(){
      console.log("clear Interval")
      clearInterval(this.timer)
    },
    changeAllInCommon(){
      this.timeShow += 5;
      //对食物的熟度计时
      for(var i=0;i<this.strandsInGrill.length;i++){

        if(this.strandsInGrill[i].selectedFace == "back"){
          this.strandsInGrill[i].back += 5
        }
        else{
          this.strandsInGrill[i].front += 5
        }
      }
    },
    changeMood(){
      for(var j = 0; j < this.guests.length; j++){
        var str = JSON.stringify(this.guests[j]);
        if(str !== "{}"){
          if(this.guests[j].mood <= 0){
            //离开
            if(this.guests[j].isTalk == false){
              this.leaveGuest.push(this.guests[j])
            }

          }
          else{
            this.guests[j].mood -= 5;
          }

        }
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
      if(arr.length !== 0){
        var num = Math.floor(Math.random() * arr.length);
        this.guests[arr[num]].id = arr[num];
        this.guests[arr[num]].guest = person;
        this.guests[arr[num]].mood = 150;
        this.guests[arr[num]].money = 0;
        this.guests[arr[num]].evaluation = "tasteGood";
        this.guests[arr[num]].isTalk = false;
        return arr[num]
      }
      else{
        return false
      }
    },
    findGuestByName(name){
      for(var i = 0; i < this.guests.length; i++){
        if(JSON.stringify(this.guests[i]) != "{}" && this.guests[i].guest.name == name){
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
    },
    //还原数据
    restoreData(){
      this.timeForGameDisplay = "00:00";
      this.timeForGame = 30;
      this.praiseNum = 0;
      this.strand = [];
      this.strands = [];
      this.strands = [];
      this.strandsInGrill = [];
      this.presentSize = 0;
      this.foodPlace = null;
      this.presentStrand = null;
      this.guest = null;
      this.timer = null;
      this.timeShow = 0;
      this.guests = [{},{},{},{}];
      this.guestsNum = 0;
      this.isStopGuestTimer = false;
      this.dialogs = [];
    }


  },



};
