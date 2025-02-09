const imageUrls = [
    "https://i.postimg.cc/TYwRFYtL/image-1.png",
    "https://i.postimg.cc/6pPTYGwp/image-10.png",
    "https://i.postimg.cc/CM4192Yt/image-11.png",
    "https://i.postimg.cc/kXf2Rpp8/image-12.png",
    "https://i.postimg.cc/QCjMHQg0/image-13.png",
    "https://i.postimg.cc/Wz7hnWpB/image-14.png",
    "https://i.postimg.cc/J07111mF/image-15.png",
    "https://i.postimg.cc/0Q0kR6gm/image-16.png",
    "https://i.postimg.cc/3JKyRTnY/image-17.png",
    "https://i.postimg.cc/zGvVCFsQ/image-18.png",
    "https://i.postimg.cc/tgPRkS2B/image-19.png",
    "https://i.postimg.cc/QxyX3Gz6/image-2.png",
    "https://i.postimg.cc/3R5NH5kM/image-20.png",
    "https://i.postimg.cc/NFNQFWjj/image-21.png",
    "https://i.postimg.cc/P5C5prZs/image-22.png",
    "https://i.postimg.cc/fLm33WGT/image-23.png",
    "https://i.postimg.cc/y88SfHZv/image-24.png",
    "https://i.postimg.cc/7ZtJdW1D/image-25.png",
    "https://i.postimg.cc/SKXYhfV9/image-26.png",
    "https://i.postimg.cc/MHtpRndx/image-27.png",
    "https://i.postimg.cc/R0j6VJbD/image-28.png",
    "https://i.postimg.cc/cCWvfyW7/image-29.png",
    "https://i.postimg.cc/wxFqwsQY/image-3.png",
    "https://i.postimg.cc/nVKjpzK3/image-30.png",
    "https://i.postimg.cc/9XyT012t/image-31.png",
    "https://i.postimg.cc/Hs2y4xVr/image-32.png",
    "https://i.postimg.cc/vTwVXxrV/image-33.png",
    "https://i.postimg.cc/WzmJyp8f/image-35.png",
    "https://i.postimg.cc/15PFq65x/image-36.png",
    "https://i.postimg.cc/CLHjP76L/image-37.png",
    "https://i.postimg.cc/fThcfpCr/image-38.png",
    "https://i.postimg.cc/zfMWbc3p/image-39.png",
    "https://i.postimg.cc/MKPGpjnm/image-4.png",
    "https://i.postimg.cc/L8xjRXpc/image-40.png",
    "https://i.postimg.cc/BvtHv0ZX/image-41.png",
    "https://i.postimg.cc/fRzY6d67/image-42.png",
    "https://i.postimg.cc/26ZW47ZY/image-43.png",
    "https://i.postimg.cc/C13jtQgd/image-44.png",
    "https://i.postimg.cc/fyYxhfzC/image-45.png",
    "https://i.postimg.cc/HWM05dwM/image-46.png",
    "https://i.postimg.cc/7LQ11Lt3/image-48.png",
    "https://i.postimg.cc/DZJrxKRt/image-49.png",
    "https://i.postimg.cc/kXX4Cyg5/image-5.png",
    "https://i.postimg.cc/9fftq9bX/image-51.png",
    "https://i.postimg.cc/sgm4Xmp0/image-52.png",
    "https://i.postimg.cc/g2mKmQ6Z/image-53.png",
    "https://i.postimg.cc/bNQTXpdP/image-54.png",
    "https://i.postimg.cc/d121sHCh/image-6.png",
    "https://i.postimg.cc/d0T3Xttm/image-7.png",
    "https://i.postimg.cc/HkFsQD4J/image-8.png",
    "https://i.postimg.cc/gJWzTV7m/image-9.png"
];
const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
let currentImageIndex = 0;
let shuffledUrls = [];
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
function createImageElement(url, index) {
    const container = document.createElement('div');
    container.className = 'img-container';
    const img = document.createElement('img');
    img.setAttribute('data-src', url);
    img.alt = 'Gallery Image';
    container.appendChild(img);
    container.addEventListener('click', () => openLightbox(index));
    return container;
}
function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.style.display = 'flex';
}
function closeLightbox() {
    lightbox.style.display = 'none';
}
function updateLightboxImage() {
    lightboxImage.src = shuffledUrls[currentImageIndex];
}
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % shuffledUrls.length;
    updateLightboxImage();
}
function previousImage() {
    currentImageIndex = (currentImageIndex - 1 + shuffledUrls.length) % shuffledUrls.length;
    updateLightboxImage();
}
function initializeGallery() {
    shuffledUrls = shuffleArray(imageUrls);
    shuffledUrls.forEach((url, index) => {
        gallery.appendChild(createImageElement(url, index));
    });
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target.querySelector('img');
                if (img && img.dataset.src) {
		    img.src = img.dataset.src;
		    img.removeAttribute('data-src');
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: "50px 0px",
        threshold: 0.01
    });
    const containers = document.querySelectorAll('.img-container');
    containers.forEach(container => {
        observer.observe(container);
    });
}
lightbox.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
        switch (e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowRight':
            nextImage();
            break;
        case 'ArrowLeft':
            previousImage();
            break;
        }
    }
});
initializeGallery();
