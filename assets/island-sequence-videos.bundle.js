import { deferrableData } from "data-island";

var sequence_videos = () => ({
  videos: [],
  playingVideoIndex: 0,
  init() {
    this.$nextTick(() => {
      this.videos = Array.from(this.$el.querySelectorAll('video'));

      this.videos.forEach((video) => {
        video.controls = false;
        video.loop = false;
        video.muted = true;
      });

      if (this.videos.length > 0) {
        this.playVideo(0);
      }
    });
  },
  playVideo(index) {
    this.stopAllVideos();

    if (this.videos[index]) {
      this.videos[index].play();
      this.playingVideoIndex = index;

      this.videos[index].onended = () => {
        this.playNextVideo();
      }
    }
  },
  stopAllVideos() {
    this.videos.forEach((video) => {
      video.play();
      video.pause();
      video.currentTime = 0;
    });
  },
  playNextVideo() {
    let nextIndex = this.playingVideoIndex + 1;

    if (nextIndex >= this.videos.length) {
      nextIndex = 0;
    }

    this.playVideo(nextIndex);
  }
});

deferrableData("SequenceVideos", sequence_videos);