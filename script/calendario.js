document.addEventListener("DOMContentLoaded", function () {

    const CALENDAR_ID = "coro10.sanvito@gmail.com";
    const API_KEY = "AIzaSyDvHmfDyvs6duqIfbGoIQV8CMF9hQf2jYQ";

    const calendario = document.getElementById("calendar");

    const calendar = new FullCalendar.Calendar(calendario, {
        locale: "it",
        initialView: "listYear",
        initialDate: new Date(),
        firstDay: 1,
        height: "auto",
        headerToolbar: false,

        visibleRange: {
            start: new Date(),
            end: new Date(new Date().getFullYear() + 10, 11, 31)
        },

        views: {
            listYear: {
                titleFormat: { month: 'long' },
                listDayFormat: { weekday: 'long', month: 'long', day: 'numeric' },
                listDaySideFormat: false, // nasconde l'ora a destra (la mostriamo a sinistra)
                displayEventTime: false // disabilita il rendering automatico dell'ora
            }
        },

        // Personalizza il contenuto di ogni evento: ora + titolo
        eventContent: function (info) {
            let timeStr = '';
            if (!info.event.allDay) {
                // Formatta l'ora (es. "10:30")
                const start = info.event.start;
                if (start) {
                    timeStr = start.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
                }
            }
            // Crea un elemento span per l'ora e uno per il titolo
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.gap = '8px';

            if (timeStr) {
                const timeSpan = document.createElement('span');
                timeSpan.textContent = timeStr;
                timeSpan.style.fontWeight = 'bold';
                timeSpan.style.color = 'inherit'; // per ereditare il colore dell'hover
                container.appendChild(timeSpan);
            }

            const titleSpan = document.createElement('span');
            titleSpan.textContent = info.event.title;
            titleSpan.style.color = 'inherit';
            container.appendChild(titleSpan);

            return { domNodes: [container] };
        },

        events: function (fetchInfo, successCallback, failureCallback) {
            const now = new Date();
            const future = new Date(now.getFullYear() + 10, 11, 31);

            const url = new URL("https://www.googleapis.com/calendar/v3/calendars/"
                + encodeURIComponent(CALENDAR_ID) + "/events");

            url.searchParams.set("key", API_KEY);
            url.searchParams.set("timeMin", now.toISOString());
            url.searchParams.set("timeMax", future.toISOString());
            url.searchParams.set("singleEvents", "true");
            url.searchParams.set("orderBy", "startTime");
            url.searchParams.set("maxResults", "500");

            fetch(url)
                .then(res => {
                    if (!res.ok) throw new Error("Errore HTTP " + res.status);
                    return res.json();
                })
                .then(data => {
                    const eventi = (data.items || [])
                        .filter(item => {
                            const start = new Date(item.start.dateTime || item.start.date);
                            return start >= now;
                        })
                        .map(item => ({
                            id: item.id,
                            title: item.summary || "(senza titolo)",
                            start: item.start.dateTime || item.start.date,
                            end: item.end.dateTime || item.end.date,
                            description: item.description || "",
                            location: item.location || "",
                            allDay: !item.start.dateTime
                        }));
                    successCallback(eventi);
                })
                .catch(err => {
                    console.error("Errore caricamento calendario:", err);
                    failureCallback(err);
                });
        },

        eventClick: function (info) {
            let evento = info.event;
            let testo = evento.title;

            if (evento.start) {
                const opzioni = evento.allDay
                    ? { weekday: "long", day: "numeric", month: "long", year: "numeric" }
                    : { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" };
                testo += "\n\nQuando: " + evento.start.toLocaleString("it-IT", opzioni);
            }

            if (evento.extendedProps.location) {
                testo += "\nDove: " + evento.extendedProps.location;
            }

            if (evento.extendedProps.description) {
                testo += "\n\n" + evento.extendedProps.description;
            }

            alert(testo);
        },

        eventDisplay: "block"
    });

    calendar.render();

});