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
        this.initAudioEventListeners();
    }

    initialize(){

        window.addEventListener('load', () =>{

            this.loadMusic(this._musicIndex);
        });
    }

// 'loadMusic' function is used to update the relevant HTML elements with the information of the music specified by the index passed as an argument,
// the music information is obtained from the array 'allMusic', 
// which contains the file names of the music cover image and audio, as well as the name of the music and artist.

    loadMusic(indexNumb){

        this._musicTitle.innerText = allMusic[indexNumb - 1].name;
        this._musicArtist.innerText = allMusic[indexNumb - 1].artist;
        this._musicCover.src = `img/${allMusic[indexNumb - 1].src}.jpg`;
        this._mainAudio.src = `audio/${allMusic[indexNumb - 1].src}.mp3`;
    }

// The 'timeUpdate()' function adds three event listeners,
// one to update the progress bar as the music plays 'timeupdate',
// one to get the total duration of the music as soon as it is loaded 'loadeddata',
// and another to allow the user to click on the progress bar and advance the music to a certain point 'click'.

    timeUpdate() {

        this._mainAudio.addEventListener('timeupdate', this.handleTimeUpdate.bind(this));
        this._mainAudio.addEventListener('loadeddata', this.handleLoadedData.bind(this));
        this._progressArea.addEventListener('click', this.handleProgressClick.bind(this));
    }
    
// The 'handleTimeUpdate(e)' function is executed whenever a 'timeupdate',
// event occurs and updates the width of the progress bar, the current duration of the music, and displays it on the screen.

    handleTimeUpdate(e) {

        const currentTime = e.target.currentTime;
        const duration = e.target.duration;
        const progressWidth = ((currentTime / duration) * 100);

        this._progressBar.style.width = `${progressWidth}%`;

        const currentDuration = this.formatTime(currentTime);
        this._musicCurrentTime.innerText = currentDuration;
    }
    
// The 'handleLoadedData()' function is executed whenever a 'loadeddata',
// event occurs and displays the total duration of the music on the screen.

    handleLoadedData() {

        const totalDuration = this.formatTime(this._mainAudio.duration);
        this._musicDuration.innerText = totalDuration;
    }
    
// The 'handleProgressClick(e)' function is executed whenever a 'click',
// event occurs on the progress bar area and updates the position of the music according to the position where the user clicked.

    handleProgressClick(e) {

        const progressWidth = this._progressArea.clientWidth;
        const clickedOffsetX = e.offsetX;
        const songDuration = this._mainAudio.duration;

        this._mainAudio.currentTime = ((clickedOffsetX / progressWidth) * songDuration);
        this.playMusic();
    }
   
// The 'formatTime(duration)' function is a helper function that converts a time in seconds to a minutes and seconds format, with two digits for the seconds.

    formatTime(duration) {

        let totalMin = Math.floor(duration / 60);
        let totalSec = Math.floor(duration % 60);
        if (totalSec < 10) {

            totalSec = `0${totalSec}`;
        }

        return `${totalMin} : ${totalSec}`;
    }

// The 'addEventListenerAll' function adds multiple event listeners to an HTML element,
// it takes three parameters: 'element (the HTML element to add the listeners to)', 'events (a string with the names of the events to add separated by spaces)', 'fn (the callback function to be executed when the event is triggered)'.

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event =>{

            element.addEventListener(event, fn, false);
        });
    }

// The 'initButtonsEvents' function initializes the events for the buttons of the music player,
// it first selects all the buttons with the selector '#music-buttons > i, #music-buttons > div > i' and stores them in the buttons variable,
// it then uses a forEach loop to add the event listeners to each button,
// calling 'addEventListenerAll' with the button element, the events 'click drag', and a callback function that extracts the button class name and passes it to execBtn,
// the execBtn method is responsible for executing the corresponding operation for the button that was clicked.

    initButtonsEvents(){

        let buttons = document.querySelectorAll('#music-buttons > i, #music-buttons > div > i');

        buttons.forEach((bx) =>{

            this.addEventListenerAll(bx, 'click drag', () =>{

                let textBtn = bx.className.replace('bi bi-', '');

                this.execBtn(textBtn);
            });
        });
    }

// 'execBtn' function is used to execute different actions depending on the button clicked in the music player.

    execBtn(value){

        switch(value){

            case 'skip-start-fill':
                this.skipPrevious();
                break;

            case 'play-circle-fill':
            case 'pause-circle-fill':
                this.playPause();
                break;

            case 'skip-end-fill':
                this.skipNext();
                break;
            
            case 'volume-mute-fill':
            case 'volume-up-fill':
                this.muteUnmute();
                break;
        }
    }

// ''repeat()' restarts the currently playing song from the beginning.

    repeat(){

        this._mainAudio.currentTime = 0;
        this.loadMusic(this._musicIndex);
        this.playMusic();
    }

// 'shuffle()' randomly selects a song from the playlist to play.

    shuffle() {

        const randIndex = Math.floor(Math.random() * allMusic.length);

        if(randIndex === this._musicIndex){

            this._musicIndex = (this._musicIndex + 1) % allMusic.length;
        } else{

            this._musicIndex = randIndex;
        }

        this.loadMusic(this._musicIndex);
        this.playMusic();
    }

// 'skipPrevious()' decrements the current music index by one,
// and if the new index is less than 1, it sets the index to the total number of music tracks.

    skipPrevious(){

        this._musicIndex--;
        this._musicIndex < 1 ? this._musicIndex = allMusic.length : this._musicIndex = this._musicIndex;

        this.loadMusic(this._musicIndex);
        this.playMusic();
    }

// 'skipNext()' increments the current music index by one, 
// and if the new index is greater than the total number of music tracks, it resets the index to 1, it sets the index to the total number of music tracks.

    skipNext(){

        this._musicIndex++;
        this._musicIndex > allMusic.length ? this._musicIndex = 1 : this._musicIndex = this._musicIndex;
        
        this.loadMusic(this._musicIndex);
        this.playMusic();
    }

// 'playMusic' function is used to play audio in the music player.

    playMusic(){

        this._container.classList.add('paused');
        this._btnPlay.classList.replace('bi-play-circle-fill', 'bi-pause-circle-fill');
        this._mainAudio.play();
    }

// 'pauseMusic' function is used to pause audio playback in the music player.

    pauseMusic(){

        this._container.classList.remove('paused');
        this._btnPlay.classList.replace('bi-pause-circle-fill', 'bi-play-circle-fill');
        this._mainAudio.pause();
    }

// 'playPause' function is used to toggle between playing and pausing audio in the music player.

    playPause(){

        const isMusicPaused = this._container.classList.contains('paused');
        isMusicPaused ? this.pauseMusic() : this.playMusic();
    }

// 'volumeOf' function is used to mute the audio in the music player.

    volumeOf(){

        this._container.classList.add('muted');
        this._btnSound.classList.replace('bi-volume-mute-fill', 'bi-volume-up-fill');
        this._mainAudio.volume = 0;
    }

// 'volumeOn' function is used to turn on the audio in the music player.

    volumeOn(){

        this._container.classList.remove('muted');
        this._btnSound.classList.replace('bi-volume-up-fill', 'bi-volume-mute-fill');
        this._mainAudio.volume = 1;
    }

// 'volumeMute' function that is used to toggle between muting and unmuting the audio in the music player.

    muteUnmute(){

        const isMusicMuted = this._container.classList.contains('muted');
        isMusicMuted ? this.volumeOn() : this.volumeOf();
    }

// 'initAudioEventListeners' method is used to initialize the audio-related events.

    initAudioEventListeners() {

        this._btnRepeat.addEventListener('click', this.changeIcon.bind(this));
        this._mainAudio.addEventListener('ended', this.songEnd.bind(this));
    }

// 'getRepeatButtonClassName' method returns a string that represents the class name of the repeat button on the music player.

    getRepeatButtonClassName(){

        return this._btnRepeat.className.replace('bi bi-', '');
    }

// 'changeIcon' method is responsible for changing the icon of the repeat button on the music player,
// depending on its current state.

    changeIcon(){

        switch(this.getRepeatButtonClassName()){

            case 'repeat':
                this._btnRepeat.classList.replace('bi-repeat', 'bi-repeat-1');
                break

            case 'repeat-1':
                this._btnRepeat.classList.replace('bi-repeat-1', 'bi-shuffle');
                break

            case 'shuffle':
                this._btnRepeat.classList.replace('bi-shuffle', 'bi-repeat');
                break
        }
    }

// 'songEnd' method is responsible for determining what action to take when a song ends on the music player,
// depending on the current state of the repeat button. 

    songEnd(){

        switch(this.getRepeatButtonClassName()){

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
    }
}