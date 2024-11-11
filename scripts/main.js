(function () {
    const startTime = performance.now();

    window.addEventListener("load", function () {
        const loadTime = performance.now() - startTime;

        const footer = document.querySelector("footer");
        if (footer) {
            const loadInfo = document.createElement("p");
            loadInfo.textContent = `Время загрузки страницы: ${loadTime} мс`;
            footer.appendChild(loadInfo);
        }
    });

    document.addEventListener("DOMContentLoaded", function () {
        const navLinks = document.querySelectorAll(".navigation a");

        const currentPath = window.location.pathname.split("/").pop();

        navLinks.forEach(link => {
            const linkPath = link.getAttribute("href").split("/").pop();

            if (linkPath === currentPath) {
                link.classList.add("active");
            }
        });
    });
})();
