function initVideo() {
    const video = document.querySelector('video');

    video.addEventListener('enterpictureinpicture', async () => {
        await document.exitPictureInPicture();
    });

    video.addEventListener('contextmenu', e => e.preventDefault());

    document.getElementById('titre').addEventListener('click', () => {
        video.classList.toggle('centre');

        const titre = document.getElementById('titre');
        titre.style.opacity = '0';
        setTimeout(() => {
            titre.style.display = 'none';
            const menu = document.getElementById('menu');
            menu.classList.remove('cache');
        }, 100);
    });
}

function initVideoPlaylist() {
    const video = document.querySelector('video');

    window.jouerVideo = function () {
        video.loop = false;
        video.src = "../../assets/image/boucle.mp4";
        video.play();

        video.onended = () => {
            video.src = "../../assets/image/boucle.mp4";
            video.loop = true;
            video.play();
        };
    };

    jouerVideo();
}

function initMenu() {
    const items = document.querySelectorAll('#menu li');
    const menu = document.getElementById('menu');
    const contact = document.getElementById('contact');
    const btnRetour = document.getElementById('retour');
    const presentation = document.getElementById('presentation');
    const triangle = document.getElementById('triangle');

    items.forEach(item => {
        item.addEventListener('click', () => {
            const texte = item.textContent.trim();

            jouerVideo();

            if (texte === 'A PROPOS DE MOI') {
                menu.classList.add('cache');
                presentation.classList.remove('cache');
                btnRetour.classList.remove('cache');
                triangle.style.opacity = '0'; // cache le triangle
                return;
            }

            if (texte === 'CONTACT') {
                menu.classList.add('cache');
                presentation.classList.add('cache');
                contact.classList.remove('cache');
                btnRetour.classList.remove('cache');
                triangle.style.opacity = '0'; // cache le triangle
                const firstContact = contact.querySelector('li');
                if (firstContact) moveTriangleExternal(firstContact);
                return;
            }

            items.forEach(i => i.classList.remove('actif'));
            item.classList.add('actif');
        });
    });

    btnRetour.addEventListener('click', () => {
        contact.classList.add('cache');
        presentation.classList.add('cache');
        btnRetour.classList.add('cache');
        menu.classList.remove('cache');
        triangle.style.opacity = '0'; // le MutationObserver le remettra au bon moment
        jouerVideo();
    });
}

function initTriangle() {
    const triangle = document.getElementById("triangle");
    const menu = document.getElementById("menu");
    const contact = document.getElementById("contact");

    function getAngle(item) {
        const style = window.getComputedStyle(item);
        const transform = style.transform;
        if (transform === "none") return 0;
        const values = transform.split("(")[1].split(")")[0].split(",");
        const a = parseFloat(values[0]);
        const b = parseFloat(values[1]);
        return Math.atan2(b, a) * (180 / Math.PI);
    }

    function getTextWidth(item) {
        const style = window.getComputedStyle(item);
        const fontSize = parseFloat(style.fontSize);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.font = `${fontSize}px Anton, sans-serif`;
        return ctx.measureText(item.textContent.trim()).width;
    }

    function moveTriangle(item) {
        const rect = item.getBoundingClientRect();
        const angle = getAngle(item);
        const textWidth = getTextWidth(item);

        const width = textWidth / 1.5;
        const height = 50;

        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const rad = angle * Math.PI / 180;
        const hw = rect.width / 2;

        const blX = cx + (-hw) * Math.cos(rad) - (0) * Math.sin(rad);
        const blY = cy + (-hw) * Math.sin(rad) + (0) * Math.cos(rad);

        triangle.style.width = width + "px";
        triangle.style.height = height + "px";
        triangle.style.left = blX + "px";
        triangle.style.top = blY + "px";
        triangle.style.transformOrigin = "0 0";
        triangle.style.transform = `rotate(${angle}deg)`;
    }

    window.moveTriangleExternal = moveTriangle;

    document.querySelectorAll('#menu li').forEach(item => {
        item.addEventListener("mouseenter", () => moveTriangle(item));
    });

    document.querySelectorAll('#contact li').forEach(item => {
        item.addEventListener("mouseenter", () => moveTriangle(item));
    });

    const observer = new MutationObserver(() => {
        if (!menu.classList.contains("cache")) {
            triangle.style.opacity = "1";
            const actif = document.querySelector("#menu li.actif");
            if (actif) moveTriangle(actif);
        }
        if (!contact.classList.contains("cache")) {
            triangle.style.opacity = "1";
            const firstContact = document.querySelector("#contact li");
            if (firstContact) moveTriangle(firstContact);
        }
    });

    observer.observe(menu, { attributes: true });
    observer.observe(contact, { attributes: true });
}

initVideo();
initVideoPlaylist();
initMenu();
initTriangle();