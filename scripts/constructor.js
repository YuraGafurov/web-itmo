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
        <div>Дата</div>
        <div>Время</div>
    `;
    interviewsTable.appendChild(headerRow);

    const savedInterviews = JSON.parse(localStorage.getItem("interviewsList")) || [];
    sortInterviews(savedInterviews);
    savedInterviews.forEach(addInterviewRow);

    // Обработка формы
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const company = form.elements["company"].value;
        const date = form.elements["date"].value;
        const time = form.elements["time"].value;

        const interview = { company, date, time };

        savedInterviews.push(interview);
        sortInterviews(savedInterviews);

        localStorage.setItem("interviewsList", JSON.stringify(savedInterviews));

        renderInterviewsTable();

        form.reset();
    });

    function sortInterviews(interviews) {
        interviews.sort((a, b) => {
            const dateTimeA = new Date(`${a.date}T${a.time}`);
            const dateTimeB = new Date(`${b.date}T${b.time}`);
            return dateTimeA - dateTimeB;
        });
    }

    function renderInterviewsTable() {
        interviewsTable.innerHTML = '';
        interviewsTable.appendChild(headerRow);
        savedInterviews.forEach(addInterviewRow);
    }

    function addInterviewRow({ company, date, time }) {
        const row = document.createElement("div");
        row.classList.add("interview-row");
        row.innerHTML = `
            <div>${company}</div>
            <div>${date}</div>
            <div>${time}</div>
        `;
        interviewsTable.appendChild(row);
    }

    clearTableButton.addEventListener("click", () => {
        localStorage.removeItem("interviewsList");
        savedInterviews.length = 0;
        renderInterviewsTable();
    });

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
            const todosArrays = await Promise.all(
                responses.map(response => {
                    if (!response.ok) {
                        throw new Error(`Ошибка при запросе userId: ${response.url}`);
                    }
                    return response.json();
                })
            );

            // Объединяем все массивы задач
            const todos = todosArrays.flat();

            // Отображаем данные
            preloader.style.display = "none";
            todos.forEach((todo) => {
                const row = document.createElement("div");
                row.classList.add("interview-row");
                row.innerHTML = `
                <div>Задача для userId: ${todo.id}</div>
                <div>${todo.name}</div>
                <div>${todo.username}</div>
            `;
                interviewsTable.appendChild(row);
            });
        } catch (error) {
            preloader.style.display = "none";
            errorMessage.style.display = "block";
        }
    }

    // Инициализация Fetch
    fetchData();
});
