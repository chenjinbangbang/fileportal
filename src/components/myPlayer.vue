<template>
  <div class="container">
    <div class="player">
      <div v-show="/mp4|flv/.test(file.split('.')[(file.split('.').length-1)])">
        <video id="videoElement" controls ></video>
      </div>
      <!-- <video-player class="video-player vjs-custom-skin" v-if="/mp4|flv/.test(file.split('.')[(file.split('.').length-1)])"
                     ref="videoPlayer"
                     :playsinline="true"
                     :options="playerOptions"
                     @play="onPlayerPlay($event)"
                     @pause="onPlayerPause($event)"
      >
      </video-player> -->
      <img :src="file" v-if="/jpg|png|gif/.test(file.split('.')[(file.split('.').length-1)])"/>
    </div>

    
  </div>
</template>

<script>
import flvjs from "flv.js";

import { videoPlayer } from "vue-video-player";
export default {
  data() {
    return {
      playerOptions: {
        //        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            //type: "application/x-mpegURL",
            type: "video/mp4",
            src: "" //你的m3u8地址（必填）
          }
        ],
        poster: "static/img/greenincome.png", //你的封面地址
        width: document.documentElement.clientWidth,
        notSupportedMessage: "此视频暂无法播放，请稍后再试" //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        //        controlBar: {
        //          timeDivider: true,
        //          durationDisplay: true,
        //          remainingTimeDisplay: false,
        //          fullscreenToggle: true  //全屏按钮
        //        }
      }
    };
  },
  created() {
    this.playerOptions.sources[0].src = this.file;
  },
  mounted() {
    this.playFlv();
  },
  components: {
    videoPlayer
  },
  methods: {
    onPlayerPlay(player) {
      //alert("play");
    },
    onPlayerPause(player) {
      //alert("pause");
    },
    //播放flv和mp4格式视频
    playFlv() {
      let type = this.file.split(".")[this.file.split(".").length - 1];
      console.log(type);
      //如果是图片格式就不执行
      if (!/png|jpg|gif/.test(type)) {
        if (flvjs.isSupported()) {
          var videoElement = document.getElementById("videoElement");
          var flvPlayer = flvjs.createPlayer({
            type: type,
            url: this.file
          });
          flvPlayer.attachMediaElement(videoElement);
          flvPlayer.load();
          flvPlayer.play();
        }
      }
    }
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    },
    file() {
      //console.log(this.$store.getters.file);
      return this.$store.getters.file;
    }
  },
  watch: {
    file(val) {
      //this.playerOptions.sources[0].src = val;
      this.playFlv();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.container {
  background-color: #efefef;
  min-height: 100%;
  text-align: center;
}
.player {
  //border:1px solid #f00;
  video{
    width:100%;
  }
  img {
    max-width: 100%;
    max-height: 100%;
  }
}
.video-js .vjs-big-play-button {
  /*
      播放按钮换成圆形
     */
  height: 2em;
  width: 2em;
  line-height: 2em;
  border-radius: 1em;
}
</style>