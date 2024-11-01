// 配置常量
const CONFIG = {
    WISH_TIMER_DURATION: 10,
    ANIMATION_DELAY: 1000,
    MUSIC_VOLUME: 0.3,
    BALLOON_COUNT: 15,
    BALLOON_COLORS: ['#FF69B4', '#87CEEB', '#FFD700', '#98FB98', '#DDA0DD'],
    ASSETS: {
        MUSIC_URL: 'https://raw.githubusercontent.com/vcvc87921/birthday-music/main/scott%E7%94%9F%E6%97%A5.MP3',
        CAKE_IMAGE: 'https://i.imgur.com/LG4tESs.png',
        BACKGROUND_IMAGE: 'https://i.imgur.com/ixnhdXy.jpeg'
    }
};

// 祝福訊息陣列
const wishes = [
    "Dear Scott，生日大快樂!覺得能在教會認識I人人真好~~小組中你微宅+理性的聖經討論常讓人耳目一新及增添很多趣味，同時也可以看到你的努力及堅持，願你的這些努力如實呈現在人生的軌跡上，祝福你在上帝的帶領下，你的twentysomething是美好&充滿閃閃小星星的燦爛時光!，May God bless you!，Laura！",
    "嘿～Scott常常覺得很感謝你一開始雖然不看好小組，但還是很忠心的參與在小組裡，不知道你知不知道自己是一個讓小組穩定的力量，你是很不可以或缺的人呢！在新的一個歲數裡，希望你可以更多從神那裡得力，而且可以有更多實際經歷神的生活，祝你生日快樂！！Jocelyn",
    "Dear Scott,看似理性、邏輯鬼才的你，透過你的分享還有觀察，總覺得你是內心溫暖又強大的人。在你身上我看到許多美好的榜樣，明知道小組各種形式對你而言並不是最舒適的，但你卻附上代價、時間，委身在這個地方，真的從你身上看到從神來的愛生日快樂，為你禱告，希望從神而來的力量添加在你身上，讓你手做的事盡都順利! By Jessica",
    "Dear Scott,Happy birthday!! 有沒有感覺一年好快又過了🤣祝福你新的一年在工作中遇到好主管好同事～升職加薪😻也祝福你的屬靈生命在新的一年有更多突破，更多的被神使用！謝謝你們成為我屬靈的家人，祝福你今年一樣的平安健康喜樂，也祝福你和家人的關係，祝你們每天都平安幸福,Gema",
    "Scott 生日快樂！祝福你在職場和生活中都能行在主的旨意中，上帝是你最好的朋友～～希望星期天能夠看到你喔！Dennis",
    "To Scott：感謝你平常在小組裡充滿知識配上不矯揉造作的分享，看似直言不諱同時也是個好人，總是讓小組多增添幾分色彩，期待再一起打羽球吃飯，哈哈，祝你身體健康、恩典滿滿，新的一歲也許多收穫呀！最後祝你生日快樂～Happy Birthday Nick",
  "願你能持續保有求知欲與學習能量，讓你不論在工作上或生活上，都能夠擁有足夠的知識與智慧來解決難題。祝福你，Scott，生日快樂！願上帝與你同在。Daniel&kikyo",
    "Scott，生日快樂，這是我們一起過的第二個生日，感謝主帶領我們小組到了今年，雖然我沒去小組，但我依然關心著大家的近況，知道你最近幾個月比較忙，希望你除了注意身體健康之外，也要注意內心的健康，就像你今年一月以過來人的角色，提醒我即使讀書在忙，也不能遠離神，你需要肢體，肢體也需要你。向主祈求你的工作順利，並穩步地向著那個你有興趣的方向前進。生辰快樂～🎂William",
    "Scott！！生日大快樂，工作與生活的平衡，本就屬不易，知道你不喜歡慶生，所以製作了一個陽春的網頁，把祝福與心意都給你~~，每次看你穩定讀經，都給我提醒，你在小組的參與建造，真的非常感動，工作雖繁忙，但耶穌與你一起，陪著你，祝你健健康康，客戶不吵不鬧，吃好睡飽。生日快樂！！小賴"
];

// 全局狀態
let isPlaying = false;
let wishingTimer = null;

// DOM 元素緩存
const cache = new Map();

// 工具函數
const utils = {
    random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    show: element => element.style.display = 'block',
    hide: element => element.style.display = 'none',
    addClass: (element, className) => element.classList.add(className),
    removeClass: (element, className) => element.classList.remove(className),
    handleError: (error, context) => {
        console.error(`Error in ${context}:`, error);
    }
};

// 圖片模態框相關函數
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    modal.style.display = "block";
    modalImg.src = imageSrc;
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = "none";
    document.body.style.overflow = 'auto';
}

// 資源加載
async function preloadResources() {
    try {
        const imagePromises = [
            CONFIG.ASSETS.CAKE_IMAGE,
            CONFIG.ASSETS.BACKGROUND_IMAGE
        ].map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = url;
            });
        });

        await Promise.all(imagePromises);
    } catch (error) {
        utils.handleError(error, 'preloadResources');
    }
}

async function initAudio() {
    const music = cache.get('bgMusic');
    const musicControl = cache.get('musicControl');
    
    try {
        music.volume = CONFIG.MUSIC_VOLUME;
        music.autoplay = true;
        music.muted = false;
        
        const playPromise = music.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                musicControl.textContent = '🔊';
            }).catch(error => {
                console.log("自動播放失敗，需要用戶互動:", error);
                const playAudioOnClick = () => {
                    music.play().then(() => {
                        isPlaying = true;
                        musicControl.textContent = '🔊';
                        document.removeEventListener('click', playAudioOnClick);
                    });
                };
                document.addEventListener('click', playAudioOnClick);
            });
        }
    } catch (error) {
        utils.handleError(error, 'initAudio');
    }
}

function createBalloons() {
    const container = document.getElementById('balloonsContainer');
    
    for (let i = 0; i < CONFIG.BALLOON_COUNT; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.backgroundColor = CONFIG.BALLOON_COLORS[
            utils.random(0, CONFIG.BALLOON_COLORS.length - 1)
        ];
        balloon.style.left = `${utils.random(0, 100)}%`;
        balloon.style.animationDuration = `${utils.random(3, 5)}s`;
        balloon.style.animationDelay = `${utils.random(0, 2)}s`;
        container.appendChild(balloon);
    }
}

function validateForm(name, birthday) {
    const errors = [];
    
    if (!name.trim()) errors.push('請輸入名字');
    if (!birthday.trim()) errors.push('請輸入生日');
    if (birthday && !/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(birthday)) {
        errors.push('生日格式不正確 (MM-DD)');
    }
    
    if (errors.length) {
        alert(errors.join('\n'));
        return false;
    }
    return true;
}

function showWishes(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const birthday = document.getElementById('birthday').value;

    if (!validateForm(name, birthday)) return;

    utils.hide(cache.get('formContainer'));
    utils.show(cache.get('wishesContainer'));
    utils.show(cache.get('cakeContainer'));
    utils.show(cache.get('wishPrompt'));

    document.querySelectorAll('.wish').forEach((element, index) => {
        if (wishes[index]) {
            element.textContent = wishes[index];
        }
    });
}

function startWishingProcess() {
    const wishTimer = document.getElementById('wishTimer');
    if (wishTimer.style.display === 'block') return;
    
    const elements = {
        candle: document.querySelector('.candle'),
        flame: document.querySelector('.flame'),
        cakeContainer: cache.get('cakeContainer'),
        wishPrompt: cache.get('wishPrompt')
    };
    
    utils.show(elements.candle);
    utils.show(elements.flame);
    utils.show(wishTimer);
    utils.hide(elements.wishPrompt);
    utils.addClass(elements.cakeContainer, 'enlarged');
    
    startWishTimer();
}

function startWishTimer() {
    let timeLeft = CONFIG.WISH_TIMER_DURATION;
    const wishTimer = document.getElementById('wishTimer');
    
    clearInterval(wishingTimer);
    wishingTimer = setInterval(() => {
        wishTimer.textContent = `請在 ${timeLeft} 秒內許下3個願望...`;
        
        if (timeLeft <= 0) {clearInterval(wishingTimer);
            completeWishingProcess();
        }
        timeLeft--;
    }, 1000);
}

function completeWishingProcess() {
    const elements = {
        flame: document.querySelector('.flame'),
        wishTimer: document.getElementById('wishTimer'),
        balloonsContainer: document.getElementById('balloonsContainer'),
        floatingImages: document.getElementById('floatingImages'),
        cakeContainer: cache.get('cakeContainer')
    };
    
    utils.hide(elements.flame);
    elements.wishTimer.textContent = '願望已記錄！';
    utils.addClass(elements.wishTimer, 'top-position');
    
    setTimeout(() => {
        const background = document.createElement('div');
        background.className = 'wishes-background';
        document.body.appendChild(background);
        utils.show(background);
        
        utils.hide(elements.cakeContainer);
        utils.hide(elements.balloonsContainer);
        utils.show(elements.floatingImages);
        
        setTimeout(showWishesAnimation, CONFIG.ANIMATION_DELAY);
    }, CONFIG.ANIMATION_DELAY);
}

function showWishesAnimation() {
    const wishes = document.querySelectorAll('.wish');
    const floatPhotos = document.querySelectorAll('.float-photo');
    
    wishes.forEach((wish, index) => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                utils.addClass(wish, 'show');
                if (floatPhotos[index]) {
                    floatPhotos[index].style.opacity = '1';
                }
            }, index * CONFIG.ANIMATION_DELAY);
        });
    });
}

function toggleMusic() {
    const music = cache.get('bgMusic');
    const musicControl = cache.get('musicControl');
    
    if (isPlaying) {
        music.pause();
        musicControl.textContent = '🔇';
    } else {
        music.play().catch(error => utils.handleError(error, 'toggleMusic'));
        musicControl.textContent = '🔊';
    }
    isPlaying = !isPlaying;
}

async function initializeApp() {
    try {
        ['formContainer', 'wishesContainer', 'cakeContainer', 'wishPrompt', 'bgMusic', 'musicControl']
            .forEach(id => cache.set(id, document.getElementById(id)));

        await preloadResources();
        await initAudio();
        createBalloons();
        setupEventListeners();
    } catch (error) {
        utils.handleError(error, 'initializeApp');
    }
}

function setupEventListeners() {
    // 原有的事件監聽器
    cache.get('cakeContainer').addEventListener('click', startWishingProcess);
    cache.get('musicControl').addEventListener('click', toggleMusic);
    
    // 添加模態框相關的事件監聽器
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    document.getElementById('imageModal').addEventListener('click', function(event) {
        if (event.target === this) {
            closeModal();
        }
    });

    window.addEventListener('beforeunload', cleanup);
}

function cleanup() {
    clearInterval(wishingTimer);
    const music = cache.get('bgMusic');
    if (music) {
        music.pause();
        music.currentTime = 0;
    }
}

window.addEventListener('DOMContentLoaded', initializeApp);