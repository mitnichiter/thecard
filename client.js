document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const playlistElement = document.getElementById('playlist');
    const audioPlayer = document.getElementById('audio-player');
    const coverArtElement = document.getElementById('current-cover-art');
    const titleElement = document.getElementById('current-title');
    const artistElement = document.getElementById('current-artist');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const volumeBar = document.getElementById('volume-bar');
    const volumeIcon = document.getElementById('volume-icon');

    // --- State ---
    let playlist = [];
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let repeatMode = 'none'; // 'none', 'one', 'all'

    // --- Functions ---

    async function fetchPlaylist() {
        try {
            const response = await fetch('/api/playlist');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            playlist = await response.json();
            renderPlaylist();
            loadSong(currentSongIndex);
        } catch (error) {
            console.error("Failed to fetch playlist:", error);
            if (playlistElement) playlistElement.innerHTML = '<li class="error">Could not load playlist.</li>';
        }
    }

    function renderPlaylist() {
        playlistElement.innerHTML = '';
        playlist.forEach((song, index) => {
            const li = document.createElement('li');
            li.dataset.index = index;
            li.innerHTML = `<span class="song-title">${song.title}</span><span class="song-artist">${song.artist}</span>`;
            playlistElement.appendChild(li);
        });
    }

    function loadSong(index) {
        currentSongIndex = index;
        const song = playlist[index];
        audioPlayer.src = song.url;
        titleElement.textContent = song.title;
        artistElement.textContent = song.artist;
        coverArtElement.src = song.coverArtUrl;
        updateActivePlaylistItem();
    }

    function playSong() {
        isPlaying = true;
        audioPlayer.play();
        playPauseBtn.textContent = '停止'; // Pause in Japanese
    }

    function pauseSong() {
        isPlaying = false;
        audioPlayer.pause();
        playPauseBtn.textContent = '再生'; // Play in Japanese
    }

    function togglePlayPause() {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    }

    function playNextSong() {
        if (isShuffle) {
            currentSongIndex = Math.floor(Math.random() * playlist.length);
        } else {
            currentSongIndex = (currentSongIndex + 1) % playlist.length;
        }
        loadSong(currentSongIndex);
        playSong();
    }

    function playPrevSong() {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
        playSong();
    }

    function updateProgressBar() {
        if (audioPlayer.duration) {
            progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
            durationEl.textContent = formatTime(audioPlayer.duration);
        }
    }

    function seek() {
        audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
    }

    function toggleShuffle() {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
    }

    function toggleRepeat() {
        if (repeatMode === 'none') {
            repeatMode = 'all';
            repeatBtn.textContent = '🔁';
            repeatBtn.classList.add('active');
        } else if (repeatMode === 'all') {
            repeatMode = 'one';
            repeatBtn.textContent = '🔂';
        } else {
            repeatMode = 'none';
            repeatBtn.textContent = '🔁';
            repeatBtn.classList.remove('active');
        }
    }

    function handleSongEnd() {
        if (repeatMode === 'one') {
            playSong();
        } else if (repeatMode === 'all') {
            playNextSong();
        } else { // 'none'
            if (currentSongIndex === playlist.length - 1) {
                pauseSong(); // Stop at the end of the playlist
            } else {
                playNextSong();
            }
        }
    }

    function setVolume() {
        audioPlayer.volume = volumeBar.value / 100;
        if(audioPlayer.volume > 0.5) volumeIcon.textContent = '🔊';
        else if(audioPlayer.volume > 0) volumeIcon.textContent = '🔉';
        else volumeIcon.textContent = '🔇';
    }

    function updateActivePlaylistItem() {
        document.querySelectorAll('.playlist li.active').forEach(item => item.classList.remove('active'));
        const activeItem = document.querySelector(`.playlist li[data-index='${currentSongIndex}']`);
        if (activeItem) activeItem.classList.add('active');
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // --- Event Listeners ---
    playPauseBtn.addEventListener('click', togglePlayPause);
    nextBtn.addEventListener('click', playNextSong);
    prevBtn.addEventListener('click', playPrevSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);

    audioPlayer.addEventListener('timeupdate', updateProgressBar);
    audioPlayer.addEventListener('ended', handleSongEnd);

    progressBar.addEventListener('input', seek);
    volumeBar.addEventListener('input', setVolume);

    playlistElement.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (li && li.dataset.index) {
            loadSong(parseInt(li.dataset.index, 10));
            playSong();
        }
    });

    // --- Initial Load ---
    fetchPlaylist();
});
