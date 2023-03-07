const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const prev = document.querySelector("#controls #prev");
const play = document.querySelector("#controls #play");
const next = document.querySelector("#controls #next");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const ul = document.querySelector("ul");
const player = new MusicPlayer(musicList);

window.addEventListener("load", () => {
  let music = player.getMusic();
  displayMusic(music);
  displayMusicList(player.musicList);
  isPlayingNow();
});

function displayMusic(music) {
  title.innerText = music.getName();
  singer.innerText = music.singer;
  image.src = "img/" + music.img;
  audio.src = "mp3/" + music.file;
}

play.addEventListener("click", () => {
  const isMusicPlay = container.classList.contains("playing");
  isMusicPlay ? pauseMusic() : playMusic();
});
prev.addEventListener("click", () => {
  prevMusic();
});
next.addEventListener("click", () => {
  nextMusic();
});

const prevMusic = () => {
  player.prev();
  let music = player.getMusic();
  displayMusic(music);
  playMusic();
  isPlayingNow();
};
const nextMusic = () => {
  player.next();
  let music = player.getMusic();
  displayMusic(music);
  playMusic();
  isPlayingNow();
};
const pauseMusic = () => {
  container.classList.remove("playing");
  play.querySelector("i").classList = "fa-solid fa-play";
  audio.pause();
};
const playMusic = () => {
  container.classList.add("playing");
  play.querySelector("i").classList = "fa-solid fa-pause";
  audio.play();
};
const calculateTime = (seconds) => {
  const minute = Math.floor(seconds / 60);
  const second = Math.floor(seconds % 60);
  const newSecond = second < 10 ? `0${second}` : `${second}`;
  const result = `${minute}:${newSecond}`;
  return result;
};
const selectedMusic = (li) => {
  player.index = li.getAttribute("li-index");
  displayMusic(player.getMusic());
  playMusic();
  isPlayingNow();
};
const displayMusicList = (list) => {
  for (let i = 0; i < list.length; i++) {
    let liTag = `
      <li onclick="selectedMusic(this)" li-index='${i}' class="list-group-item rounded-3 m-1">
        <span>${list[i].getName()}</span>
        <span id="music-${i}" class="badge bg-primary rounded-pill">5:25</span>
        <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
      </li>
    `;
    ul.insertAdjacentHTML("beforeend", liTag);
    let liAudioDuration = ul.querySelector(`#music-${i}`);
    let liAudioTag = ul.querySelector(`.music-${i}`);
    liAudioTag.addEventListener("loadeddata", () => {
      liAudioDuration.innerText = calculateTime(liAudioTag.duration);
    });
  }
};
const isPlayingNow = () => {
  for (let li of ul.querySelectorAll("li")) {
    if (li.classList.contains("playing")) {
      li.classList.remove("playing");
    }
    if (li.getAttribute("li-index") == player.index) {
      li.classList.add("playing");
    }
  }
};

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = calculateTime(audio.duration);
  progressBar.max = Math.floor(audio.duration);
  progressBar.step = 1;
});
audio.addEventListener("timeupdate", () => {
  progressBar.value = Math.floor(audio.currentTime);
  currentTime.textContent = calculateTime(progressBar.value);
});

progressBar.addEventListener("input", () => {
  currentTime.textContent = calculateTime(progressBar.value);
  audio.currentTime = progressBar.value;
});

volume.addEventListener("click", () => {
  if (
    volume.classList.contains("fa-volume-high") ||
    volume.classList.contains("fa-volume-low")
  ) {
    audio.muted = true;
    volume.classList = "fa-solid fa-volume-mute";
    volumeBar.value = 0;
  } else {
    audio.muted = false;
    volume.classList = "fa-solid fa-volume-high";
    volumeBar.value = value;
    if (value > 50) {
      volume.classList = "fa-solid fa-volume-high";
    }
    if (value > 0 && value <= 50) {
      volume.classList = "fa-solid fa-volume-low";
    }
  }
});
let value = 0;
volumeBar.addEventListener("input", (e) => {
  value = e.target.value;
  audio.volume = value / 100;
  if (value > 50) {
    volume.classList = "fa-solid fa-volume-high";
    audio.muted = false;
  }
  if (value > 0 && value <= 50) {
    volume.classList = "fa-solid fa-volume-low";
    audio.muted = false;
  }
  if (value == 0) {
    volume.classList = "fa-solid fa-volume-mute";
    audio.muted = true;
  }
});
audio.addEventListener("ended", () => {
  nextMusic();
});
