document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. GESTION DE LA VIDÉO ET DE SON ACCUEIL
    // ==========================================
    function initVideo() {
        const video = document.querySelector('video');
        if (!video) return;

        // Anti Picture-in-Picture
        video.addEventListener('enterpictureinpicture', async () => {
            await document.exitPictureInPicture();
        });

        // Désactivation du clic droit sur la vidéo
        video.addEventListener('contextmenu', e => e.preventDefault());

        // Clic sur le gros titre d'accueil
        const titre = document.getElementById('titre');
        if (titre) {
            titre.addEventListener('click', () => {
                video.classList.toggle('centre');
                titre.style.opacity = '0';
                
                setTimeout(() => {
                    titre.style.display = 'none';
                    const menu = document.getElementById('menu');
                    if (menu) menu.classList.remove('cache');
                }, 100);
            });
        }
    }

    // Playlist / Boucle de la vidéo
    const videoElement = document.querySelector('video');
    function jouerVideo() {
        if (!videoElement) return;
        videoElement.loop = false;
        videoElement.src = "../../assets/image/boucle.mp4";
        videoElement.play().catch(err => console.log("Attente d'interaction utilisateur pour la vidéo"));

        videoElement.onended = () => {
            videoElement.src = "../../assets/image/boucle.mp4";
            videoElement.loop = true;
            videoElement.play().catch(() => {});
        };
    }

    // Lance la vidéo directement au chargement
    jouerVideo();

    // ==========================================
    // 2. LOGIQUE DU TRIANGLE PERSONA 5
    // ==========================================
    const triangle = document.getElementById("triangle");
    const menu = document.getElementById("menu");
    const contact = document.getElementById("contact");

    function getAngle(item) {
        const style = window.getComputedStyle(item);
        const transform = style.transform;
        if (transform === "none" || !transform) return 0;
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
        if (!ctx) return 100; // Largeur par défaut en cas d'erreur
        ctx.font = `${fontSize}px Anton, sans-serif`;
        return ctx.measureText(item.textContent.trim()).width;
    }

    function moveTriangle(item) {
        if (!triangle || !item) return;
        const rect = item.getBoundingClientRect();
        const angle = getAngle(item);
        const textWidth = getTextWidth(item);

        const width = textWidth / 1.5;
        const height = 50;

        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const rad = angle * Math.PI / 180;
        const hw = rect.width / 2;

        const blX = cx + (-hw) * Math.cos(rad);
        const blY = cy + (-hw) * Math.sin(rad);

        triangle.style.width = width + "px";
        triangle.style.height = height + "px";
        triangle.style.left = blX + "px";
        triangle.style.top = blY + "px";
        triangle.style.transformOrigin = "0 0";
        triangle.style.transform = `rotate(${angle}deg)`;
    }

    // Événements survol pour déplacer le triangle
    document.querySelectorAll('#menu li, #contact li').forEach(item => {
        item.addEventListener("mouseenter", () => {
            if (triangle && triangle.style.opacity !== '0') {
                moveTriangle(item);
            }
        });
    });

    // Observer pour caler automatiquement le triangle lors des changements d'onglets
    if (menu && contact && triangle) {
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

    // ==========================================
    // 3. SECTIONS : NAVIGATION ET PANNEAU STAGES (onglet AP)
    // ==========================================
    const stages = document.getElementById('stages');
    const stagesAnnees = document.getElementById('stages-annees');
    const stagesRetourAnnees = document.getElementById('stages-retour-annees');
    const presentation = document.getElementById('presentation');
    const btnRetour = document.getElementById('retour');

    const missions = {
        '1': document.getElementById('stages-annee-1'),
        '2': document.getElementById('stages-annee-2')
    };

    function resetStagesState() {
        if (!stagesAnnees) return;
        stagesAnnees.classList.remove('cache');
        Object.values(missions).forEach(m => m && m.classList.remove('actif'));
        if (stagesRetourAnnees) stagesRetourAnnees.classList.remove('actif');
    }

    // Événements internes au bloc Stage (Année 1 / Année 2) - onglet AP
    if (stagesAnnees && stagesRetourAnnees) {
        stagesAnnees.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', () => {
                const annee = item.getAttribute('data-annee');
                stagesAnnees.classList.add('cache');
                Object.values(missions).forEach(m => m && m.classList.remove('actif'));
                if (missions[annee]) missions[annee].classList.add('actif');
                stagesRetourAnnees.classList.add('actif');
            });
        });

        stagesRetourAnnees.addEventListener('click', resetStagesState);
    }

    // ==========================================
    // 3bis. SECTIONS : NAVIGATION ET PANNEAU STAGE (bouton STAGE du menu)
    // ==========================================
    const stages2 = document.getElementById('stages2');
    const stages2Annees = document.getElementById('stages2-annees');
    const stages2RetourAnnees = document.getElementById('stages2-retour-annees');

    const missions2 = {
        '1': document.getElementById('stages2-annee-1'),
        '2': document.getElementById('stages2-annee-2')
    };

    function resetStages2State() {
        if (!stages2Annees) return;
        stages2Annees.classList.remove('cache');
        Object.values(missions2).forEach(m => m && m.classList.remove('actif'));
        if (stages2RetourAnnees) stages2RetourAnnees.classList.remove('actif');
    }

    // Événements internes au bloc STAGE (Année 1 / Année 2)
    if (stages2Annees && stages2RetourAnnees) {
        stages2Annees.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', () => {
                const annee = item.getAttribute('data-annee');
                stages2Annees.classList.add('cache');
                Object.values(missions2).forEach(m => m && m.classList.remove('actif'));
                if (missions2[annee]) missions2[annee].classList.add('actif');
                stages2RetourAnnees.classList.add('actif');
            });
        });

        stages2RetourAnnees.addEventListener('click', resetStages2State);
    }

    // ==========================================
    // 4. MENU PRINCIPAL
    // ==========================================
    function initMenu() {
        const items = document.querySelectorAll('#menu li');
        if (!menu || !btnRetour) return;

        items.forEach(item => {
            item.addEventListener('click', () => {
                const texte = item.textContent.trim();
                jouerVideo();

                // Gestion des onglets principaux
                if (texte === 'A PROPOS DE MOI') {
                    menu.classList.add('cache');
                    if (presentation) presentation.classList.remove('cache');
                    btnRetour.classList.remove('cache');
                    if (triangle) triangle.style.opacity = '0';
                    return;
                }

                if (texte === 'STAGE') {
                    menu.classList.add('cache');
                    if (presentation) presentation.classList.add('cache');
                    if (contact) contact.classList.add('cache');
                    if (triangle) triangle.style.opacity = '0';

                    resetStages2State();
                    if (stages2) stages2.classList.remove('cache');
                    btnRetour.classList.remove('cache');
                    return;
                }

                if (texte === 'AP') {
                    menu.classList.add('cache');
                    if (presentation) presentation.classList.add('cache');
                    if (contact) contact.classList.add('cache');
                    if (triangle) triangle.style.opacity = '0';
                    
                    resetStagesState();
                    if (stages) stages.classList.remove('cache');
                    btnRetour.classList.remove('cache');
                    return;
                }

                if (texte === 'CONTACT') {
                    menu.classList.add('cache');
                    if (presentation) presentation.classList.add('cache');
                    if (contact) contact.classList.remove('cache');
                    btnRetour.classList.remove('cache');
                    
                    if (triangle) {
                        triangle.style.opacity = '1';
                        const firstContact = contact ? contact.querySelector('li') : null;
                        if (firstContact) moveTriangle(firstContact);
                    }
                    return;
                }

                // Pour les autres onglets textuels simples
                items.forEach(i => i.classList.remove('actif'));
                item.classList.add('actif');
            });
        });

        // Bouton global de Retour au Menu principal
        btnRetour.addEventListener('click', () => {
            if (contact) contact.classList.add('cache');
            if (presentation) presentation.classList.add('cache');
            if (stages) stages.classList.add('cache');
            if (stages2) stages2.classList.add('cache');
            
            btnRetour.classList.add('cache');
            menu.classList.remove('cache');
            if (triangle) triangle.style.opacity = '0';
            jouerVideo();
        });
    }

    // Initialisation globale
    initVideo();
    initMenu();
});