document.addEventListener("DOMContentLoaded", () => {
    new Swiper(".swiper-container", {
        loop: true, // Бесконечная прокрутка
        navigation: {
            nextEl: ".swiper-button-next", // Кнопка "вперед"
            prevEl: ".swiper-button-prev", // Кнопка "назад"
        },
        slidesPerView: 1, // Один слайд за раз
    });
});
