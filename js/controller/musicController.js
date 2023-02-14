class MusicController{

    constructor(){

        this._container = document.querySelector('#music-player')
        this._musicCover = document.querySelector('#music-cover > img');
        this._musicTitle = document.querySelector('#music-title');
        this._musicArtist = document.querySelector('#music-artist');
        this._progressArea = document.querySelector('#progress-bar-container')
        this._progressBar = document.querySelector('#progress-bar')
        this._mainAudio = document.querySelector('#music-audio');
        this._musicCurrentTime = document.querySelector('#current-time');
        this._musicDuration = document.querySelector('#max-duration');
        this._btnRepeat = document.querySelector('#btn-repeat')
        this._btnPlay = document.querySelector('#btn-play')
        this._btnSound = document.querySelector('#btn-sound')
        this._musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
        this.initialize();
        this.timeUpdate();
        this.initButtonsEvents();
        this.changeIcon();
        this.songEnd();
    }

    loadMusic(indexNumb){

        this._musicTitle.innerText = allMusic[indexNumb - 1].name;
        this._musicArtist.innerText = allMusic[indexNumb - 1].artist;
        this._musicCover.src = `img/${allMusic[indexNumb - 1].src}.jpg`;
        this._mainAudio.src = `audio/${allMusic[indexNumb - 1].src}.mp3`;
    }

    initialize(){

        window.addEventListener('load', () =>{

            this.loadMusic(this._musicIndex);
        });
    }

    timeUpdate(){

        this._mainAudio.addEventListener('timeupdate', (e) =>{

            const currentTime = e.target.currentTime;
            const duration = e.target.duration;

            let progressWidth = ((currentTime / duration) * 100);       
            this._progressBar.style.width = `${progressWidth}%`;

            this._mainAudio.addEventListener('loadeddata', () =>{

                let audioDuration = this._mainAudio.duration;

                let totalMin = Math.floor(audioDuration / 60);
                let totalSec = Math.floor(audioDuration % 60);
                if(totalSec < 10){

                    totalSec = `0${totalSec}`;
                }
                this._musicDuration.innerText = `${totalMin} : ${totalSec}`;
            });

            let currentMin = Math.floor(currentTime / 60);
            let currentSec = Math.floor(currentTime % 60);
            if(currentSec < 10){

                currentSec = `0${currentSec}`;
            }
            this._musicCurrentTime.innerText = `${currentMin} : ${currentSec}`;
        });

        this._progressArea.addEventListener('click', (e) =>{

            let progressWidth = this._progressArea.clientWidth;
            let clickedOffsetX = e.offsetX;
            let songDuration = this._mainAudio.duration

            this._mainAudio.currentTime = ((clickedOffsetX / progressWidth) * songDuration);
            this.playMusic();
        })
    }

    repeat(){

        this._mainAudio.currentTime = 0;
        this.loadMusic(this._musicIndex);
        this.playMusic();
    }

    shuffle(){

        let randIndex = Math.floor((Math.random() * allMusic.length) + 1);

        do{

            randIndex
        } while(this._musicIndex == randIndex);

        this._musicIndex = randIndex;
        this.loadMusic(this._musicIndex);
        this.playMusic();
    }

    skipPrevious(){

        this._musicIndex--;
        this._musicIndex < 1 ? this._musicIndex = allMusic.length : this._musicIndex = this._musicIndex;
        this.loadMusic(this._musicIndex);
        this.playMusic();
    }

    playMusic(){

        this._container.classList.add('paused');
        this._btnPlay.classList.remove('bi-play-circle-fill');
        this._btnPlay.classList.add('bi-pause-circle-fill');
        this._mainAudio.play();
    }

    pauseMusic(){

        this._container.classList.remove('paused');
        this._btnPlay.classList.remove('bi-pause-circle-fill');
        this._btnPlay.classList.add('bi-play-circle-fill');
        this._mainAudio.pause();
    }

    playCircle(){

        const isMusicPlay = this._container.classList.contains('paused');
        isMusicPlay ? this.pauseMusic() : this.playMusic();
    }

    skipNext(){

        this._musicIndex++;
        this._musicIndex > allMusic.length ? this._musicIndex = 1 : this._musicIndex = this._musicIndex;
        this.loadMusic(this._musicIndex);
        this.playMusic();
    }

    volumeOf(){

        this._container.classList.add('muted');
        this._btnSound.classList.remove('bi-volume-mute-fill');
        this._btnSound.classList.add('bi-volume-up-fill');
        this._mainAudio.volume = 0;
    }

    volumeOn(){

        this._container.classList.remove('muted');
        this._btnSound.classList.remove('bi-volume-up-fill');
        this._btnSound.classList.add('bi-volume-mute-fill');
        this._mainAudio.volume = 1;
    }

    volumeMute(){

        const isMusicSound = this._container.classList.contains('muted');
        isMusicSound ? this.volumeOn() : this.volumeOf();
    }

    execBtn(value){

        switch(value){

            case 'skip-start-fill':
                this.skipPrevious();
                break;

            case 'play-circle-fill':
            case 'pause-circle-fill':
                this.playCircle();
                break;

            case 'skip-end-fill':
                this.skipNext();
                break;
            
            case 'volume-mute-fill':
            case 'volume-up-fill':
                this.volumeMute();
                break;
        }
    }

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event =>{

            element.addEventListener(event, fn, false);
        });
    }

    initButtonsEvents(){

        let buttons = document.querySelectorAll('#music-buttons > i, #music-buttons > div > i ');

        buttons.forEach((bx) =>{

            this.addEventListenerAll(bx, 'click drag', () =>{

                let textBtn = bx.className.replace('bi bi-', '');

                this.execBtn(textBtn);
            });
        });
    }

    changeIcon(){

        this._btnRepeat.addEventListener('click', () => {

            let getText = this._btnRepeat.className.replace('bi bi-', '');

            switch(getText){

                case 'repeat':
                    this._btnRepeat.classList.remove('bi-repeat');
                    this._btnRepeat.classList.add('bi-repeat-1');
                    break

                case 'repeat-1':
                    this._btnRepeat.classList.remove('bi-repeat-1');
                    this._btnRepeat.classList.add('bi-shuffle');
                    break

                case 'shuffle':
                    this._btnRepeat.classList.remove('bi-shuffle');
                    this._btnRepeat.classList.add('bi-repeat');
                    break
            }
        })
    }

    songEnd(){

        this._mainAudio.addEventListener('ended', () =>{

            let getText = this._btnRepeat.className.replace('bi bi-', '');

            switch(getText){

                case 'repeat':
                    this.skipNext();
                    break

                case 'repeat-1':
                    this.repeat();
                    break

                case 'shuffle':
                    this.shuffle();
                    break
            }
        })
    }
}