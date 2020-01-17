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
        //背景音乐
        bgMusic:{
          url: cc.AudioClip,
          default: null
        },
        //烧烤音效
        barbecue_sound:{
          url: cc.AudioClip,
          default: null
        },
        //普通点击声音
        general_click:{
          url: cc.AudioClip,
          default: null
        },
        //游戏道具点击声
        prop_click:{
          url: cc.AudioClip,
          default: null
        },
        //来客人
        guest_coming:{
          url: cc.AudioClip,
          default: null
        },
        //收钱
        money_collect:{
          url: cc.AudioClip,
          default: null
        },
        //游戏结束
        game_over:{
          url: cc.AudioClip,
          default: null
        }
    },
    onLoad () {
      cc.game.addPersistRootNode(this.node);
    },
    playBgMusic() {
      var userData = JSON.parse(cc.sys.localStorage.getItem('userData'))
      if(userData){
        var musicLevel = userData.setting.bgMusic;
        this.bgMusicChannel = cc.audioEngine.play(this.bgMusic,true,musicLevel)
      }
      else{
        this.bgMusicChannel = cc.audioEngine.play(this.bgMusic,true,0.5)
      }
    },

    stopBgMusic() {
        if (this.bgMusicChannel !== undefined) {
            cc.audioEngine.stop(this.bgMusicChannel);
            this.bgMusicChannel = undefined;
        }
    },
    setBgVolume(num){
      cc.audioEngine.setVolume(this.bgMusicChannel,num);
      var userData = JSON.parse(cc.sys.localStorage.getItem('userData'))
      userData.setting.bgMusic = num;
      cc.sys.localStorage.setItem('userData', JSON.stringify(userData));
    },
    getBgVolume(){
      return cc.audioEngine.getVolume(this.bgMusicChannel)
    },
    setEffectVolume(num){
      var userData = JSON.parse(cc.sys.localStorage.getItem('userData'))
      userData.setting.soundEffect = num;
      cc.sys.localStorage.setItem('userData', JSON.stringify(userData));
    },
    getEffectVolume(){
      var userData = JSON.parse(cc.sys.localStorage.getItem('userData'));
      return userData.setting.soundEffect
    },
    //烧烤音效
    playBarbecueSound(){
      var soundLevel = this.getEffectVolume();
      this.barbecueMusicChannel = cc.audioEngine.play(this.barbecue_sound,true,soundLevel)
    },
    stopBarbecueSound(){
      if (this.barbecueMusicChannel !== undefined) {
          cc.audioEngine.stop(this.barbecueMusicChannel);
          this.barbecueMusicChannel = undefined;
      }
    },
    //普通点击声音
    playGeneralClick(){
      var soundLevel = this.getEffectVolume();
      cc.audioEngine.play(this.prop_click,false,soundLevel);
    },
    //游戏道具点击声音
    playPropClick(){
      var soundLevel = this.getEffectVolume();
      cc.audioEngine.play(this.general_click,false,soundLevel);
    },
    //客人出现
    playGuestComing(){
      var soundLevel = this.getEffectVolume();
      cc.audioEngine.play(this.guest_coming,false,soundLevel);
    },
    //收钱
    playMoneyCollect(){
      var soundLevel = this.getEffectVolume();
      cc.audioEngine.play(this.money_collect,false,soundLevel);
    },
    //游戏结束
    playGameOver(){
      var soundLevel = this.getEffectVolume();
      cc.audioEngine.play(this.game_over,false,soundLevel);
    },
});
