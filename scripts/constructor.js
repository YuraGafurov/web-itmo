document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("interviewForm");
    const interviewsTable = document.getElementById("interviewsTable");
    const clearTableButton = document.getElementById("clearTableButton");
    const preloader = document.getElementById("preloader");
    const errorMessage = document.getElementById("errorMessage");

    const headerRow = document.createElement("div");
    headerRow.classList.add("interview-header-row");
    headerRow.innerHTML = `
        <div>Компания</div>
        <div>Стаж(мес)</div>
    `;
    interviewsTable.appendChild(headerRow);

    function addInterviewRow({ company, time }) {
        const row = document.createElement("div");
        row.classList.add("interview-row");
        row.innerHTML = `
            <div>${company}</div>
            <div>${time}</div>
        `;
        interviewsTable.appendChild(row);
    }

    // Fetch API: Загрузка данных
    async function fetchData() {
        preloader.style.display = "block";
        errorMessage.style.display = "none";

        try {
            // Псевдослучайная фильтрация
            const userIds = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10) + 1);
            const uniqueUserIds = [...new Set(userIds)]; // Убираем дубликаты

            // Создаем массив промисов для каждого запроса
            const requests = uniqueUserIds.map(id => fetch(`https://jsonplaceholder.typicode.com/users?id=${id}`));

            // Выполняем все запросы параллельно
            const responses = await Promise.all(requests);

            // Проверяем статусы запросов
            const usersArray = await Promise.all(
                responses.map(response => {
                    if (!response.ok) {
                        throw new Error(`Ошибка при запросе userId: ${response.url}`);
                    }
                    return response.json();
                })
            );

            // Объединяем все массивы задач
            const users = usersArray.flat();

            // Отображаем данные
            preloader.style.display = "none";
            users.forEach((user) => {
                const company = user.company.name;
                const time = user.id
                addInterviewRow( { company, time })
            });
        } catch (error) {
            preloader.style.display = "none";
            errorMessage.style.display = "block";
        }
    }

    // Инициализация Fetch
    fetchData();
});
