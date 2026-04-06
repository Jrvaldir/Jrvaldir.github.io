// --- MOCK DATA ---
const mockData = {
    professionals: [
        {
            id: 1,
            name: 'Barbearia do João',
            category: 'Barbearia',
            rating: 4.9,
            imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400',
            coverUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800',
            description: 'Especialista em cortes clássicos e barboterapia com toalha quente.',
            address: 'Rua das Flores, 123 - Centro',
            services: [
                { id: 101, name: 'Corte Social', price: 45.00, duration: 30 },
                { id: 102, name: 'Barba Completa', price: 35.00, duration: 30 },
                { id: 103, name: 'Combo (Corte + Barba)', price: 70.00, duration: 60 }
            ],
            portfolio: [
                'https://images.unsplash.com/photo-1599351431247-f132778811bc?w=200',
                'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200',
                'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=200'
            ]
        },
        {
            id: 2,
            name: 'Espaço Beleza Real',
            category: 'Estética',
            rating: 4.8,
            imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
            coverUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
            description: 'Sua beleza é nossa prioridade. Tratamentos faciais e corporais.',
            address: 'Av. Central, 456 - Jardim Paulista',
            services: [
                { id: 201, name: 'Limpeza de Pele', price: 120.00, duration: 60 },
                { id: 202, name: 'Drenagem Linfática', price: 150.00, duration: 90 },
                { id: 203, name: 'Massagem Relaxante', price: 100.00, duration: 60 }
            ],
            portfolio: [
                'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200',
                'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200'
            ]
        }
    ],
    appointments: [
        {
            id: 1,
            professionalName: 'Studio Fit & Flow',
            serviceName: 'Aula de Yoga',
            date: '2026-04-05',
            time: '09:00',
            status: 'confirmed',
            professionalImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100'
        }
    ]
};

// --- ROUTER ---
const router = {
    history: ['login'],
    navigate: function(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(`screen-${screenId}`);
        if (target) {
            target.classList.add('active');
            this.history.push(screenId);
            window.scrollTo(0,0);
            
            // Render specific screen data
            if (screenId === 'home') app.renderProfessionals();
            if (screenId === 'appointments') app.renderAppointments();
        }
    },
    back: function() {
        if (this.history.length > 1) {
            this.history.pop();
            const prevScreen = this.history[this.history.length - 1];
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.getElementById(`screen-${prevScreen}`).classList.add('active');
        }
    }
};

// --- APP LOGIC ---
const app = {
    selectedPro: null,
    selectedServices: new Set(),
    selectedTime: null,

    renderProfessionals: function() {
        const container = document.getElementById('professionals-list');
        container.innerHTML = '';
        mockData.professionals.forEach(pro => {
            const card = document.createElement('div');
            card.className = 'pro-card';
            card.onclick = () => this.openProProfile(pro);
            card.innerHTML = `
                <img src="${pro.imageUrl}" alt="${pro.name}">
                <div class="pro-card-info">
                    <div class="pro-card-name">${pro.name}</div>
                    <div class="pro-card-cat">${pro.category}</div>
                    <div class="pro-card-rating"><i class="fa-solid fa-star"></i> ${pro.rating}</div>
                </div>
            `;
            container.appendChild(card);
        });
    },

    openProProfile: function(pro) {
        this.selectedPro = pro;
        this.selectedServices.clear();
        this.updateBookingBar();

        document.getElementById('pro-name').innerText = pro.name;
        document.getElementById('pro-cat').innerText = pro.category;
        document.getElementById('pro-rating').innerText = pro.rating;
        document.getElementById('pro-desc').innerText = pro.description;
        document.getElementById('pro-address').innerText = pro.address;
        document.getElementById('pro-cover').src = pro.coverUrl;
        document.getElementById('pro-avatar').src = pro.imageUrl;

        // Render Services
        const sList = document.getElementById('services-list');
        sList.innerHTML = '';
        pro.services.forEach(s => {
            const sItem = document.createElement('div');
            sItem.className = 'service-item';
            sItem.onclick = () => this.toggleService(s, sItem);
            sItem.innerHTML = `
                <div>
                    <span class="service-name">${s.name}</span>
                    <span class="service-meta">${s.duration} min</span>
                </div>
                <div class="service-price">R$ ${s.price.toFixed(2)}</div>
            `;
            sList.appendChild(sItem);
        });

        // Render Portfolio
        const pGrid = document.getElementById('portfolio-grid');
        pGrid.innerHTML = '';
        pro.portfolio.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            pGrid.appendChild(img);
        });

        router.navigate('pro-profile');
    },

    toggleService: function(service, element) {
        if (this.selectedServices.has(service)) {
            this.selectedServices.delete(service);
            element.classList.remove('selected');
        } else {
            this.selectedServices.add(service);
            element.classList.add('selected');
        }
        this.updateBookingBar();
    },

    updateBookingBar: function() {
        const bar = document.getElementById('booking-bar');
        if (this.selectedServices.size > 0) {
            bar.classList.remove('hidden');
            let total = 0;
            this.selectedServices.forEach(s => total += s.price);
            document.getElementById('selected-count').innerText = `${this.selectedServices.size} serviço(s)`;
            document.getElementById('total-price').innerText = `R$ ${total.toFixed(2)}`;
        } else {
            bar.classList.add('hidden');
        }
    },

    switchProTab: function(tabId) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        event.target.classList.add('active');
        document.getElementById(`pro-tab-${tabId}`).classList.add('active');
    },

    startBooking: function() {
        this.renderTimeSlots();
        router.navigate('scheduling');
    },

    renderTimeSlots: function() {
        const container = document.getElementById('time-slots');
        container.innerHTML = '';
        const slots = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '16:00'];
        
        slots.forEach(time => {
            const btn = document.createElement('div');
            btn.className = 'slot';
            btn.innerText = time;
            btn.onclick = () => {
                document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedTime = time;
                document.getElementById('confirm-booking-btn').classList.remove('disabled');
            };
            container.appendChild(btn);
        });
    },

    completeBooking: function() {
        if (!this.selectedTime) return;

        // Add to mock appointments
        const services = Array.from(this.selectedServices).map(s => s.name).join(' + ');
        mockData.appointments.push({
            id: Date.now(),
            professionalName: this.selectedPro.name,
            serviceName: services,
            date: '2026-04-05',
            time: this.selectedTime,
            status: 'confirmed',
            professionalImage: this.selectedPro.imageUrl
        });

        router.navigate('appointments');
        this.showSnackbar();
    },

    renderAppointments: function() {
        const container = document.getElementById('appointments-list');
        container.innerHTML = '';
        
        if (mockData.appointments.length === 0) {
            container.innerHTML = '<p class="text-center mt-2">Nenhum agendamento.</p>';
            return;
        }

        mockData.appointments.forEach(appt => {
            const card = document.createElement('div');
            card.className = 'pro-card';
            card.innerHTML = `
                <img src="${appt.professionalImage}">
                <div class="pro-card-info">
                    <div class="pro-card-name">${appt.serviceName}</div>
                    <div class="pro-card-cat">${appt.professionalName}</div>
                    <div class="pro-card-rating" style="color:var(--primary)">${appt.time} - Hoje</div>
                </div>
                <div style="display:flex; align-items:center;">
                    <button class="icon-btn text-danger" onclick="app.cancelAppt(${appt.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            container.appendChild(card);
        });
    },

    cancelAppt: function(id) {
        mockData.appointments = mockData.appointments.filter(a => a.id !== id);
        this.renderAppointments();
    },

    showSnackbar: function() {
        const snack = document.getElementById('snackbar');
        snack.classList.add('show');
        setTimeout(() => snack.classList.remove('show'), 3500);
    },

    showTelegramInfo: function() {
        alert("Simulação: Sua conta está vinculada ao Telegram ID: @AdminBoraAgendar");
    }
};

// Initial Render
app.renderProfessionals();
