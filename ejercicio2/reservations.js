class Customer {

    constructor(id, name, email){
        this.id= id; //Identificador del cliente.
        this.name= name; //Nombre del cliente.
        this.email= email; //Correo electrónico del cliente.
    }
    get info(){
        return `nombre: ${this.name}, email: ${this.email}`;        
    }
}

class Reservation {
    constructor(id, Customer, date, guests){
        this.id= id; //`: Identificador de la reserva.
        this.customer= Customer; //`: instancia de la clase `Customer` que realiza la reserva.
        this.date= date; //Fecha y hora de la reserva.
        this.guests= guests; // Número de comensales de la reserva.
    }

    get info(){
        return `Fecha y Hora: ${this.date},
                cliente: ${this.customer.info},
                Comensales: ${this.guests}`;
    }
    static validateReservation(reservation){
        const newReservacion= new Date();
        const reservationdate= new Date(reservation.date);

        if (reservationdate < newReservacion || reservation.guests <= 0){
            return false;
        }else{
            return true;
        }
        
    }
}

class Restaurant {
    constructor(name) {
        this.name = name;
        this.reservations = [];
    }

    addReservation(reservation) {
        this.reservations.push(reservation);
    }

    render() {
        const container = document.getElementById("reservations-list");
        container.innerHTML = "";
        this.reservations.forEach((reservation) => {
            const reservationCard = document.createElement("div");
            reservationCard.className = "box";
            reservationCard.innerHTML = `
                    <p class="subtitle has-text-primary">
                        Reserva ${
                            reservation.id
                        } - ${reservation.date.toLocaleString()}
                    </p>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                ${reservation.info}
                            </p>
                        </div>
                    </div>
              `;
            container.appendChild(reservationCard);
        });
    }
}

document
    .getElementById("reservation-form")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const customerName = document.getElementById("customer-name").value;
        const customerEmail = document.getElementById("customer-email").value;
        const reservationDate =
            document.getElementById("reservation-date").value;
        const guests = parseInt(document.getElementById("guests").value);

        if (Reservation.validateReservation(reservationDate, guests)) {
            const customerId = restaurant.reservations.length + 1;
            const reservationId = restaurant.reservations.length + 1;

            const customer = new Customer(
                customerId,
                customerName,
                customerEmail
            );
            const reservation = new Reservation(
                reservationId,
                customer,
                reservationDate,
                guests
            );

            restaurant.addReservation(reservation);
            restaurant.render();
        } else {
            alert("Datos de reserva inválidos");
            return;
        }
    });

const restaurant = new Restaurant("El Lojal Kolinar");

const customer1 = new Customer(1, "Shallan Davar", "shallan@gmail.com");
const reservation1 = new Reservation(1, customer1, "2024-12-31T20:00:00", 4);

if (Reservation.validateReservation(reservation1.date, reservation1.guests)) {
    restaurant.addReservation(reservation1);
    restaurant.render();
} else {
    alert("Datos de reserva inválidos");
}
