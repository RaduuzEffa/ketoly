document.addEventListener('DOMContentLoaded', () => {
    // 0. Load Admin & Profile Logic
    window.isAdmin = localStorage.getItem('kspAdmin') === 'true';

    // Membership Logic via Firebase
    window.checkMembership = function() {
        // Will be called when auth state is resolved by Firebase observer
    };

    window.logout = function() {
        firebase.auth().signOut().then(() => {
            window.location.reload();
        });
    };

    // ------------- FIREBASE AUTH & FIRESTORE LOGIC -------------
    const authOverlay = document.getElementById('auth-overlay');
    const mainContainer = document.getElementById('main-app-container');

    const loginForm = document.getElementById('auth-login-form');
    const registerForm = document.getElementById('auth-register-form');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');

    if (switchToRegister && switchToLogin) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'flex';
        });
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'flex';
        });
    }

    const authLoginBtn = document.getElementById('auth-login-submit-btn');
    const authRegisterBtn = document.getElementById('auth-register-submit-btn');

    // LOGOVÁNÍ VYPNUTO (Dočasně pro lokální používání bez nutnosti přihlášení)
    authOverlay.style.display = 'none';
    mainContainer.style.display = 'block';
    
    window.userProfile = {
        email: 'local-admin',
        role: 'admin',
        validUntil: 0
    };
    window.isAdmin = true;
    window.isPro = true;

    // Update User Badge UI
    const badgeObj = document.getElementById('user-badge-text');
    if (badgeObj) {
        badgeObj.innerHTML = '👑 ADMIN';
        badgeObj.parentElement.style.color = '#fbbf24';
        badgeObj.parentElement.style.borderColor = '#fbbf24';
    }
    
    // Initialize rendering
    if (window.renderTables) renderTables(document.getElementById('table-search-input')?.value || '');
    if (window.renderRecipes) renderRecipes(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');

    /* Původní Firebase Auth - VYPNUTO
    firebase.auth().onAuthStateChanged(async (user) => { ... });
    */

    authLoginBtn.addEventListener('click', () => {
        const email = document.getElementById('login-email').value.trim();
        const pwd = document.getElementById('login-password').value;
        const msg = document.getElementById('login-error-msg');
        if (!email || !pwd) return;
        
        authLoginBtn.textContent = "Přihlašuji...";
        msg.style.display = "none";
        
        firebase.auth().signInWithEmailAndPassword(email, pwd)
            .catch(error => {
                msg.textContent = "Chyba: " + (error.code === 'auth/invalid-credential' ? 'Špatný e-mail nebo heslo.' : error.message);
                msg.style.display = "block";
                authLoginBtn.textContent = "Přihlásit se";
            });
    });

    authRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.getElementById('register-email').value.trim();
        const pwd = document.getElementById('register-password').value;
        const pwdConf = document.getElementById('register-password-confirm').value;
        const msg = document.getElementById('register-error-msg');
        
        if (!email || !pwd || !pwdConf) return;
        
        if (pwd !== pwdConf) {
            msg.textContent = "Chyba: Zadaná hesla se neshodují!";
            msg.style.display = "block";
            return;
        }
        if (pwd.length < 6) {
            msg.textContent = "Chyba: Heslo musí mít minimálně 6 znaků.";
            msg.style.display = "block";
            return;
        }
        
        authRegisterBtn.textContent = "Vytvářím...";
        msg.style.display = "none";
        
        firebase.auth().createUserWithEmailAndPassword(email, pwd)
            .catch(error => {
                msg.textContent = "Chyba: " + (error.code === 'auth/email-already-in-use' ? 'Tento e-mail je již zaregistrován.' : error.message);
                msg.style.display = "block";
                authRegisterBtn.textContent = "Zaregistrovat";
            });
    });

    window.openProfileModal = async function() {
        const modal = document.getElementById('profile-modal');
        const modalBody = document.getElementById('profile-modal-body');
        
        let qrCodeUrl = '';
        try {
            // Fetch global QR code from Cloud for all users
            const configDoc = await window.db.collection('config').doc('settings').get();
            if (configDoc.exists && configDoc.data().qrCode) {
                qrCodeUrl = configDoc.data().qrCode;
            }
        } catch (e) {
            console.error('Error fetching global QR:', e);
        }
        
        let content = `
            <div style="font-size: 4rem; margin-bottom: 10px;">${window.isPro ? '🌟' : '👤'}</div>
            <h2 style="margin-top: 0;">Osobní Profil</h2>
            <div style="font-size: 0.9rem; color: #a1a1aa; margin-top: -5px; margin-bottom: 20px;">${firebase.auth().currentUser?.email}</div>
            
            <div style="margin-top: 20px; padding: 20px; background: rgba(0,0,0,0.2); border-radius: 15px; border: 1px solid rgba(255,255,255,0.05);">
                <h3 style="margin-top:0; font-size: 1.3rem;">Stav: <span style="color: ${window.isPro ? 'var(--accent)' : '#ef4444'}">${window.isPro ? 'Aktivní (PRO Verze)' : 'Zkušební náhled'}</span></h3>
                <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 0;">${window.isPro ? 'Máš natrvalo odemčené všechny prémiové recepty, funkce deníku a kompletní databáze na tomto zařízení.' : 'Aktuálně prohlížíš omezenou verzi aplikace. Pro zobrazení prémiových receptů a plnohodnotného kalorického deníku je potřeba zakoupit členství.'}</p>
            </div>
        `;

        content += `
            <div style="margin-top: 20px; text-align: left; background: rgba(0,0,0,0.3); padding: 25px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.08);">
                <h3 style="color: #fff; margin-top: 0; font-size: 1.2rem; text-align: center;">Záloha & Lokální Data</h3>
                <p style="font-size: 0.9rem; color: rgba(255,255,255,0.85); margin-bottom: 20px; text-align: center;">Aplikace ukládá tvé záznamy pouze do tohoto zařízení. Pro přenos na nový telefon nebo počítač si vytvoř záložní soubor.</p>
                <div style="display:flex; gap:15px; flex-direction:column;">
                    <button onclick="window.exportUserData()" style="background: var(--accent); color: #fff; border: none; padding:16px; border-radius:12px; font-weight:bold; font-size:1.05rem; cursor:pointer; box-shadow: 0 4px 15px var(--accent-glow); transition: 0.3s; width: 100%;"><span class="icon" style="font-size: 1.2rem; margin-right: 8px;">💾</span> Uložit zálohu do zařízení</button>
                    <label style="background: #3b82f6; color: #fff; border: none; text-align:center; padding:16px; border-radius:12px; cursor:pointer; font-weight:bold; font-size:1.05rem; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); transition: 0.3s; display:block; width: 100%;"><span class="icon" style="font-size: 1.2rem; margin-right: 8px;">📂</span> Nahrát zálohu z disku
                        <input type="file" id="import-data-file" accept=".json" style="display:none;" onchange="window.importUserData(event)">
                    </label>
                </div>
            </div>
        `;


        
        if (window.isAdmin) {
            content += `
                <div style="margin-top: 30px; text-align: left; background: rgba(251, 191, 36, 0.1); padding: 20px; border-radius: 15px; border: 1px solid rgba(251, 191, 36, 0.3);">
                    <h3 style="color: #fbbf24; margin-top: 0;">👑 Administrace (Centrální Cloud Control)</h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 15px;">Spravuj licence všech uživatelů, kteří se do aplikace zaregistrovali přes e-mail.</p>
                    <button onclick="window.openAdminDashboard()" class="btn" style="width: 100%; margin-bottom: 10px; background: #fbbf24; color: #000; border-color: #fbbf24;">👥 Otevřít Seznam Klientů</button>
                    <hr style="border-color: rgba(255,255,255,0.1); margin: 20px 0;">
                    <button onclick="window.setQRCode()" class="btn" style="width: 100%; background: #3b82f6; color: #fff; border-color: #3b82f6; font-size:0.8rem;">[⚙️] Nastavit Platební QR Kód pro uživatele</button>
                </div>
            `;
        } else if (!window.isPro) {
            content += `
                <div style="margin-top: 25px; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 15px;">
                    <h3 style="margin-top:0; color:var(--text-light);">🎁 Pořídit Plnou Verzi</h3>
                    <p style="color:var(--text-muted); font-size:0.9rem;">Naskenuj QR kód ve svém bankovnictví a zašli částku za prodloužení.</p>
                </div>
                <button class="btn" style="margin-top: 15px; width: 100%; height: 50px; font-size: 1.1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.3);" onclick="alert('Výborně! Nyní kontaktuj Administrátora nebo vyčkej na spárování platby. Poté systém manuálně odemkneme posláním příkazu.')">Zaplaceno, požádat o odemčení</button>
            `;
        }

        content += `
            <button onclick="window.logout()" style="width:100%; margin-top: 25px; background: transparent; border: 1px solid #71717a; color: #71717a; font-weight: bold; cursor: pointer; padding: 12px; border-radius: 12px; font-size: 0.9rem;">Odhlásit se / Změnit uživatele</button>
        `;
        
        modalBody.innerHTML = content;
        modal.classList.remove('hidden');
    };

    window.exportUserData = async function() {
        const dataToExport = {
            ketoCustomDb: localStorage.getItem('ketoCustomDb'),
            ketoCustomRecipes: localStorage.getItem('ketoCustomRecipes'),
            kspMealDiaryDb: localStorage.getItem('kspMealDiaryDb'),
            kspImageOverrides: localStorage.getItem('kspImageOverrides'),
            kspCustomSupps: localStorage.getItem('kspCustomSupps'),
            kspFavItems: localStorage.getItem('kspFavItems'),
            targetGoals: localStorage.getItem('targetGoals')
        };
        const jsonString = JSON.stringify(dataToExport);
        const dateStr = new Date().toISOString().split('T')[0];
        const defaultFileName = `meal_builder_moje_data_${dateStr}.json`;

        try {
            if (window.showSaveFilePicker) {
                const handle = await window.showSaveFilePicker({
                    suggestedName: defaultFileName,
                    types: [{
                        description: 'JSON Záloha',
                        accept: {'application/json': ['.json']},
                    }],
                });
                const writable = await handle.createWritable();
                await writable.write(jsonString);
                await writable.close();
            } else {
                throw new Error("File System Access API není plně podporováno.");
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);
                const anchor = document.createElement('a');
                anchor.href = dataStr;
                anchor.download = defaultFileName;
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
            }
        }
    };

    window.importUserData = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (data.ketoCustomDb) localStorage.setItem('ketoCustomDb', data.ketoCustomDb);
                if (data.ketoCustomRecipes) localStorage.setItem('ketoCustomRecipes', data.ketoCustomRecipes);
                if (data.kspMealDiaryDb) localStorage.setItem('kspMealDiaryDb', data.kspMealDiaryDb);
                if (data.kspImageOverrides) localStorage.setItem('kspImageOverrides', data.kspImageOverrides);
                if (data.kspCustomSupps) localStorage.setItem('kspCustomSupps', data.kspCustomSupps);
                if (data.kspFavItems) localStorage.setItem('kspFavItems', data.kspFavItems);
                if (data.targetGoals) localStorage.setItem('targetGoals', data.targetGoals);
                
                alert('Data byla úspěšně nahrána! Aplikace se nyní restartuje s nově načtenou databází.');
                location.reload();
            } catch (err) {
                alert('Omlouváme se, soubor se nepodařilo přečíst. Zkontrolujte, zda jde o platný záložní soubor.');
            }
        };
        reader.readAsText(file);
    };

    window.setQRCode = function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = async function(event) {
                const base64String = event.target.result;
                try {
                    // Nahrání jako centrální Global Config do Firestore
                    await window.db.collection('config').doc('settings').set({ qrCode: base64String }, { merge: true });
                    alert('QR kód byl úspěšně nahrán do Cloudu! Nyní se bude zobrazovat všem klientům.');
                } catch (err) {
                    alert('Chyba při nahrávání do Cloudu: ' + err.message);
                }
            };
            reader.readAsDataURL(file);
        };
        input.click();
    };

    window.openAdminDashboard = async function() {
        document.getElementById('profile-modal').classList.add('hidden');
        const modal = document.getElementById('admin-dash-modal');
        const list = document.getElementById('admin-user-list');
        modal.classList.remove('hidden');
        list.innerHTML = '<div style="text-align:center; padding: 20px;">Načítám klienty z Cloudu... ⏳</div>';
        
        try {
            const snapshot = await window.db.collection('users').orderBy('createdAt', 'desc').get();
            let html = '';
            snapshot.forEach(doc => {
                const u = doc.data();
                const uid = doc.id;
                
                let statusHtml = '';
                if (u.role === 'admin') {
                    statusHtml = '<span style="color:#fbbf24; font-weight:bold;">👑 Administrátor</span>';
                } else if (u.role === 'pro' && u.validUntil > Date.now()) {
                    const daysBlock = Math.ceil((u.validUntil - Date.now()) / (1000 * 60 * 60 * 24));
                    statusHtml = `<span style="color:var(--accent); font-weight:bold;">🌟 PRO (Zbývá ${daysBlock} dní)</span>`;
                } else {
                    statusHtml = '<span style="color:var(--text-muted);">👤 Free (Náhled)</span>';
                }
                
                html += `
                    <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
                        <div>
                            <div style="font-weight: 600; font-size: 1.1rem; color: #fff;">${u.email}</div>
                            <div style="font-size: 0.85rem; margin-top: 5px;">${statusHtml}</div>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:5px;">
                            <button onclick="window.grantCloudPro('${uid}', 30)" class="btn" style="padding: 8px 12px; font-size: 0.8rem; background: #10b981; border-color: #10b981;">+ Zaktivovat Měsíc</button>
                            <button onclick="window.grantCloudPro('${uid}', 0)" class="btn" style="padding: 8px 12px; font-size: 0.8rem; background: transparent; border-color: #ef4444; color: #ef4444;">- Zrušit PRO</button>
                        </div>
                    </div>
                `;
            });
            list.innerHTML = html;
        } catch (err) {
            list.innerHTML = `<div style="color:#ef4444; text-align:center;">Chyba při čtení databáze: ${err.message}</div>`;
        }
    };

    window.grantCloudPro = async function(uid, days) {
        if (!confirm(`Opravdu chceš ${days > 0 ? 'přidat 30 dní PRO verze' : 'zrušit licenci'} tomuto uživateli?`)) return;
        
        try {
            if (days === 0) {
                await window.db.collection('users').doc(uid).update({ role: 'free', validUntil: 0 });
                alert('Licence byla úspěšně odebrána.');
            } else {
                const targetDoc = await window.db.collection('users').doc(uid).get();
                let existingTime = Date.now();
                if (targetDoc.exists && targetDoc.data().role === 'pro' && targetDoc.data().validUntil > Date.now()) {
                    existingTime = targetDoc.data().validUntil;
                }
                const newExpiration = existingTime + (days * 24 * 60 * 60 * 1000);
                await window.db.collection('users').doc(uid).update({ role: 'pro', validUntil: newExpiration });
                alert('Třicetidenní PRO licence byla úspěšně odeslána na zařízení klienta!');
            }
            window.openAdminDashboard(); // Refresh
        } catch (err) {
            alert('Chyba při updatování: ' + err.message);
        }
    };

    // Stále ponecháno pro kompatibilitu Local Storage, ale nově používáme Cloud
    window.grantPro = function(days) {
        if (days === 0) {
            localStorage.setItem('kspMembership', 'free');
            localStorage.removeItem('kspValidUntil');
            alert('Licence byla úspěšně odstraněna.');
        } else {
            localStorage.setItem('kspMembership', 'pro');
            localStorage.setItem('kspValidUntil', Date.now() + (days * 24 * 60 * 60 * 1000));
            alert('Přístroj byl úspěšně aktivován na 30 dní!');
        }
        location.reload();
    };

    window.checkMembership();

    const customDb = JSON.parse(localStorage.getItem('kspCustomDb') || '[]');
    const customRecipes = JSON.parse(localStorage.getItem('kspCustomRecipes') || '[]');
    const customSupps = JSON.parse(localStorage.getItem('kspCustomSupps') || '[]');
    
    if (window.foodDatabase) window.foodDatabase = window.foodDatabase.concat(customDb);
    if (window.ketoRecipes) window.ketoRecipes = window.ketoRecipes.concat(customRecipes);
    if (window.ketoSupplements) window.ketoSupplements = window.ketoSupplements.concat(customSupps);

    let db = [];
    function refreshDb() {
        if (!window.foodDatabase) return;
        if (state && state.globalMode === 'keto') {
            db = window.foodDatabase.filter(x => x.strict !== 'lc');
        } else {
            db = window.foodDatabase;
        }
    }
    
    // UI Elements
    const searchInput = document.getElementById('food-search');
    const autocompleteList = document.getElementById('autocomplete-list');
    const resultsSection = document.getElementById('results-section');
    const baseFoodsGrid = document.getElementById('base-foods-grid');
    const recommendationsGrid = document.getElementById('recommendations-grid');
    
    const modeKetoBtn = document.getElementById('mode-keto');
    const modeLcBtn = document.getElementById('mode-lc');
    
    const dailyGoalInput = document.getElementById('daily-kcal');
    const dailyPInput = document.getElementById('daily-p');
    const dailySInput = document.getElementById('daily-s');
    const dailyTInput = document.getElementById('daily-t');
    const clearBasesBtn = document.getElementById('clear-bases');
    
    const progressContainer = document.getElementById('progress-bars-container');

    // Stats Elements
    const elKcal = document.getElementById('total-kcal');
    const elP = document.getElementById('total-p');
    const elC = document.getElementById('total-c');
    const elF = document.getElementById('total-f');
    const elScore = document.getElementById('total-score');

    let currentFocus = -1;

    const state = {
        globalMode: 'keto',
        diary: JSON.parse(localStorage.getItem('kspDiary') || '{}'),
        currentDate: new Date().toISOString().split('T')[0],
        complements: [],
        rejectedComplements: [],
        get dailyGoal() { return parseInt(dailyGoalInput.value) || 2300; },
        get dailyP() { return parseInt(dailyPInput.value) || 140; },
        get dailyC() { return parseInt(dailySInput.value) || 30; },
        get dailyF() { return parseInt(dailyTInput.value) || 170; }
    };

    state.getDailySlots = function() {
        if (!state.diary[state.currentDate]) {
            state.diary[state.currentDate] = { breakfast: [], lunch: [], dinner: [], snacks: [] };
        }
        return state.diary[state.currentDate];
    };

    window.pushToBase = function(itemObj) {
        const targetSlot = document.getElementById('target-meal-slot').value || 'lunch';
        state.getDailySlots()[targetSlot].push(itemObj);
        state.rejectedComplements = []; // Reset rejected on structural change
    };

    window.getAllDayFoods = function() {
        const slots = state.getDailySlots();
        return [...slots.breakfast, ...slots.lunch, ...slots.dinner, ...slots.snacks];
    };

    const dpCurrent = document.getElementById('current-diary-date');
    const dateInput = document.getElementById('calendar-date-input');
    const btnPrevDay = document.getElementById('btn-prev-day');
    const btnNextDay = document.getElementById('btn-next-day');
    const dailyBurnedInput = document.getElementById('daily-burned');
    
    function renderDiaryDate() {
        const d = new Date(state.currentDate);
        const today = new Date();
        const isToday = d.toDateString() === today.toDateString();
        
        let prefix = '';
        if (isToday) prefix = 'Dnes';
        else {
            const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
            const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
            if (d.toDateString() === yesterday.toDateString()) prefix = 'Včera';
            else if (d.toDateString() === tomorrow.toDateString()) prefix = 'Zítra';
            else {
                const days = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
                prefix = days[d.getDay()];
            }
        }
        dpCurrent.innerText = prefix;
        if(dateInput) dateInput.value = state.currentDate;
    }

    if(dateInput) {
        dateInput.addEventListener('change', (e) => {
            if (e.target.value) {
                state.currentDate = e.target.value;
                renderDiaryDate();
                generateMeal();
            }
        });
    }
    
    btnPrevDay.addEventListener('click', () => {
        const d = new Date(state.currentDate);
        d.setDate(d.getDate() - 1);
        state.currentDate = d.toISOString().split('T')[0];
        renderDiaryDate();
        generateMeal();
    });
    
    btnNextDay.addEventListener('click', () => {
        const d = new Date(state.currentDate);
        d.setDate(d.getDate() + 1);
        state.currentDate = d.toISOString().split('T')[0];
        renderDiaryDate();
        generateMeal();
    });

    renderDiaryDate();

    function saveSettings() {
        const pfx = state.globalMode;
        localStorage.setItem(`${pfx}DailyKcal`, dailyGoalInput.value);
        localStorage.setItem(`${pfx}DailyP`, dailyPInput.value);
        localStorage.setItem(`${pfx}DailyS`, dailySInput.value);
        localStorage.setItem(`${pfx}DailyT`, dailyTInput.value);
        localStorage.setItem('globalMode', state.globalMode);
    }

    function loadSettings(mode) {
        const pfx = mode;
        if(localStorage.getItem(`${pfx}DailyKcal`)) dailyGoalInput.value = localStorage.getItem(`${pfx}DailyKcal`);
        else dailyGoalInput.value = '2300';
        if(localStorage.getItem(`${pfx}DailyP`)) dailyPInput.value = localStorage.getItem(`${pfx}DailyP`);
        else dailyPInput.value = mode === 'keto' ? '144' : '173';
        if(localStorage.getItem(`${pfx}DailyS`)) dailySInput.value = localStorage.getItem(`${pfx}DailyS`);
        else dailySInput.value = mode === 'keto' ? '29' : '86';
        if(localStorage.getItem(`${pfx}DailyT`)) dailyTInput.value = localStorage.getItem(`${pfx}DailyT`);
        else dailyTInput.value = mode === 'keto' ? '179' : '141';
    }

    function updateMacroDefaults(mode) {
        const kcal = state.dailyGoal;
        if (mode === 'keto') {
            dailyPInput.value = Math.round((kcal * 0.25) / 4);
            dailySInput.value = Math.round((kcal * 0.05) / 4);
            dailyTInput.value = Math.round((kcal * 0.70) / 9);
        } else {
            dailyPInput.value = Math.round((kcal * 0.30) / 4);
            dailySInput.value = Math.round((kcal * 0.15) / 4);
            dailyTInput.value = Math.round((kcal * 0.55) / 9);
        }
        saveSettings();
    }

    function applyGlobalMode(mode) {
        if (state.globalMode !== mode && localStorage.getItem('globalMode')) {
            saveSettings();
        }
        state.globalMode = mode;
        
        if (mode === 'lc') {
            document.body.classList.add('theme-lc');
            modeKetoBtn.classList.remove('active');
            modeLcBtn.classList.add('active');
        } else {
            document.body.classList.remove('theme-lc');
            modeLcBtn.classList.remove('active');
            modeKetoBtn.classList.add('active');
        }

        loadSettings(mode);
        if (!localStorage.getItem(`${mode}DailyKcal`)) {
            updateMacroDefaults(mode);
        }
        refreshDb();
        if (window.reloadFavorites) {
            window.reloadFavorites();
            if (document.getElementById('fav-base-grid')) {
                if (!window.isPro) {
            container.innerHTML += `
               <div style="text-align:center; padding: 40px 20px; background: rgba(0,0,0,0.2); border-radius: 15px; margin-top: 20px; border: 1px dashed rgba(255,255,255,0.1);">
                   <div style="font-size:3rem; margin-bottom:15px; filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));">🔒</div>
                   <h2 style="color:var(--text-light); margin-top:0;">Odemkni stovky dalších surovin</h2>
                   <p style="color:var(--text-muted); margin-bottom:25px; line-height: 1.5; font-size: 0.95rem;">V bezplatném náhledu je dostupná pouze vybraná sekce a tvá oblíbená jídla. Pro kompletní přístup k databázi potřebuješ PRO licenci.</p>
                   <button onclick="window.openProfileModal()" class="btn" style="box-shadow: 0 5px 15px rgba(0,0,0,0.3);">Chci zakoupit PRO verzi</button>
               </div>
            `;
        }

        if (typeof renderFavBaseGrid === 'function') renderFavBaseGrid();
    }        }
        if (window.getAllDayFoods().length > 0) generateMeal();
    }

    modeKetoBtn.addEventListener('click', () => { if(state.globalMode !== 'keto') applyGlobalMode('keto'); });
    modeLcBtn.addEventListener('click', () => { if(state.globalMode !== 'lc') applyGlobalMode('lc'); });

    // Init
    const savedMode = localStorage.getItem('globalMode') || 'keto';
    state.globalMode = savedMode;
    applyGlobalMode(savedMode);
    dailyGoalInput.addEventListener('change', () => { saveSettings(); generateMeal(); });
    dailyBurnedInput.addEventListener('change', generateMeal);

    [dailyPInput, dailySInput, dailyTInput].forEach(inp => {
        inp.addEventListener('change', () => { saveSettings(); generateMeal(); });
    });

    document.getElementById('clear-bases').addEventListener('click', () => {
        const slots = state.getDailySlots();
        slots.breakfast = []; slots.lunch = []; slots.dinner = []; slots.snacks = [];
        generateMeal();
    });

    window.addComplement = function(index) {
        if (state.complements[index]) {
            window.pushToBase(state.complements[index]);
            generateMeal();
        }
    };

    window.rejectComplement = function(index) {
        const item = state.complements[index];
        if (item) {
            state.rejectedComplements.push(item.name);
            generateMeal();
        }
    };

    window.updateComplementAmount = function(index, value) {
        const amt = parseFloat(value);
        if (isNaN(amt) || amt <= 0) return;
        const item = state.complements[index];
        if (item) {
            const newScale = amt / (parseFloat((item.originalBase.amount.match(/[0-9.,]+/) || [1])[0]) || 1);
            state.complements[index] = scaleFood(item.originalBase, newScale);
            renderResults(state.complements);
        }
    };

    window.removeBase = function(slotId, index) {
        state.getDailySlots()[slotId].splice(index, 1);
        generateMeal();
    };

    window.updateBaseAmount = function(slotId, index, newGrams) {
        const num = parseFloat(newGrams);
        if (isNaN(num) || num < 0) return;
        
        const item = state.getDailySlots()[slotId][index];
        if(item) {
            const origAmountStr = (item.originalBase && item.originalBase.amount) ? item.originalBase.amount : item.amount;
            const match = origAmountStr.match(/[0-9.,]+/);
            const origGrams = match ? parseFloat(match[0].replace(',','.')) : 100;
            if (origGrams === 0) return;
            const newScale = num / origGrams;
            state.getDailySlots()[slotId][index] = scaleFood(item.originalBase || item, newScale);
            generateMeal();
        }
    };

    // Autocomplete Logic
    searchInput.addEventListener('input', function(e) {
        const val = this.value;
        closeAllLists();
        if (!val) return false;
        currentFocus = -1;

        autocompleteList.classList.remove('hidden');

        // Filter database properly with diacritics mapping
        const charMap = {"ě":"e","š":"s","č":"c","ř":"r","ž":"z","ý":"y","á":"a","í":"i","é":"e","ů":"u","ú":"u","ď":"d","ť":"t","ň":"n","ó":"o"};
        const removeDiacritics = str => str.toLowerCase().replace(/[ěščřžýáíéůúďťňó]/g, m => charMap[m] || m);
        const searchVal = removeDiacritics(val);
        // Fetch active recipes
        let activeRecipes = [];
        if (window.ketoRecipes) {
            activeRecipes = window.ketoRecipes.filter(r => r.mode === state.globalMode || r.mode === 'keto');
        }
        const allItems = [...db, ...activeRecipes];

        const matches = allItems.filter(item => {
            const textToSearch = item.name ? removeDiacritics(item.name) : removeDiacritics(item.title || '');
            return textToSearch.includes(searchVal);
        }).slice(0, 10);
        
        matches.forEach(match => {
            const li = document.createElement('li');
            const displayName = match.name || match.title;
            const displayCat = match.name ? match.category : `🥘 Recept (${match.category})`;
            li.innerHTML = `<span class="ac-name">${highlightMatch(displayName, val)}</span>
                            <span class="ac-category" style="color:${match.name ? 'var(--text-muted)' : 'var(--accent)'}">${displayCat}</span>`;
            li.addEventListener('click', () => {
                searchInput.value = '';
                closeAllLists();
                if (match.title && !match.name) {
                    const clonedRecipe = JSON.parse(JSON.stringify(match));
                    clonedRecipe.name = clonedRecipe.title;
                    clonedRecipe.amount = "1 porce";
                    window.pushToBase(clonedRecipe);
                } else {
                    window.pushToBase(scaleFood(match, computeMultiplier(match)));
                }
                generateMeal();
            });
            autocompleteList.appendChild(li);
        });
    });

    function highlightMatch(word, query) {
        // Safe insensitive highlight
        const queryNorm = removeDiacriticsExp(query); // Use the global one
        const wordNorm = removeDiacriticsExp(word); // Use the global one
        const idx = wordNorm.indexOf(queryNorm);
        if (idx >= 0) {
            return word.substring(0, idx) + '<strong>' + word.substring(idx, idx + query.length) + '</strong>' + word.substring(idx + query.length);
        }
        return word;
    }

    const removeDiacriticsExp = str => {
        const charMap = {"ě":"e","š":"s","č":"c","ř":"r","ž":"z","ý":"y","á":"a","í":"i","é":"e","ů":"u","ú":"u","ď":"d","ť":"t","ň":"n","ó":"o"};
        return str.toLowerCase().replace(/[ěščřžýáíéůúďťňó]/g, m => charMap[m] || m);
    };

    searchInput.addEventListener('keydown', function(e) {
        let x = autocompleteList.getElementsByTagName('li');
        if (e.keyCode == 40) { // Down
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) { // Up
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) { // Enter
            e.preventDefault();
            if (currentFocus > -1 && x && x[currentFocus]) {
                x[currentFocus].click();
            } else {
                searchBtn.click();
            }
        }
    });

    const searchBtn = document.getElementById('search-btn');
    searchBtn.addEventListener('click', () => {
        const val = searchInput.value.trim();
        if (!val) return;
        
        const searchVal = removeDiacriticsExp(val);
        let activeRecipes = [];
        if (window.ketoRecipes) {
            activeRecipes = window.ketoRecipes.filter(r => r.mode === state.globalMode || r.mode === 'keto');
        }
        const allItems = [...db, ...activeRecipes];
        const matches = allItems.filter(item => {
            const textToSearch = item.name ? removeDiacriticsExp(item.name) : removeDiacriticsExp(item.title || '');
            return textToSearch.includes(searchVal);
        });
        
        if (matches.length > 0) {
            const match = matches[0];
            if (match.title && !match.name) {
                const clonedRecipe = JSON.parse(JSON.stringify(match));
                clonedRecipe.name = clonedRecipe.title;
                clonedRecipe.amount = "1 porce";
                window.pushToBase(clonedRecipe);
            } else {
                window.pushToBase(scaleFood(match, computeMultiplier(match)));
            }
            searchInput.value = '';
            closeAllLists();
            navBuilder.click(); // Ensure builder view is open
            generateMeal();
        } else {
            alert("Potravina nebyla v databázi nalezena. Zkus jiný výraz nebo vyber z Tabulek.");
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add('autocomplete-active');
    }
    function removeActive(x) {
        for (let i = 0; i < x.length; i++) x[i].classList.remove('autocomplete-active');
    }
    function closeAllLists(elmnt) {
        autocompleteList.innerHTML = '';
        autocompleteList.classList.add('hidden');
    }
    document.addEventListener('click', (e) => {
        if (e.target !== searchInput) closeAllLists();
    });

    // -----------------------------------------
    // MEAL COMPOSITION LOGIC
    // -----------------------------------------
    
    function computeMultiplier(baseFood) {
        let multiplier = 1;
        if (baseFood.protein > 2) {
            multiplier = Math.ceil(25 / baseFood.protein);
        } else if (baseFood.fat > 5) {
            multiplier = Math.ceil(300 / baseFood.kcal);
        } else {
            multiplier = 3;
        }
        return Math.max(1, Math.min(5, multiplier));
    }

    function generateMeal() {
        const allDayFoods = window.getAllDayFoods();
        
        if (allDayFoods.length === 0) {
            resultsSection.classList.add('hidden');
            // Switch back to empty state
            navBuilder.click();
            return;
        }

        // 1. Calculate Target Meal Macros based on Target Goals
        const burned = parseInt(document.getElementById('daily-burned').value) || 0;
        const targetKcal = state.dailyGoal + burned;
        const targetP = state.dailyP;
        const targetC = state.dailyC;
        const targetF = state.dailyF;

        // 2. Sum Base Foods
        let currentP = 0, currentC = 0, currentF = 0;
        allDayFoods.forEach(f => {
            currentP += f.protein;
            currentC += f.carbs;
            currentF += f.fat;
        });

        // 3. Find missing values
        let reqP = targetP - currentP;
        let reqC = targetC - currentC;
        let reqF = targetF - currentF;

        state.complements = [];

        // 4. Fill dynamically - Smart Exact Gram Algorithm
        // Prefer common household staples
        const isCommonP = (name) => /vejce (l|m)|šunka nej|cottage|bílý plnotučný|tvaroh|kuřecí prsa|uzený tempeh/i.test(name);
        const isCommonC = (name) => /brokolice|špenát|okurka|paprika|zelí|borůvky|maliny|avokádo/i.test(name);
        const isCommonF = (name) => /olivový olej extra|máslo \(82|vlašské ořechy|mandle |mandle,/i.test(name);

        if (reqP > 10) {
            let candidates = db.filter(f => isCommonP(f.name) && f.protein > 0.05 && !state.rejectedComplements.includes(f.name)); // at least 5% protein
            if (!candidates.length) candidates = db.filter(f => (f.category.includes('Vejce') || f.category.includes('Sýry') || f.category.includes('Uzeniny')) && !state.rejectedComplements.includes(f.name));
            if (candidates.length) {
                const add = randChoice(candidates);
                let scale = Math.ceil(reqP / add.protein);
                // Apply carb limiting ceiling to protein scaler
                if (reqC > 0 && add.carbs > 0.02) {
                    const carbScaleLimit = Math.ceil((reqC + 5) / add.carbs); // Allow a small overshoot
                    scale = Math.min(scale, carbScaleLimit);
                }
                scale = Math.max(10, scale); // exact grams needed
                const item = scaleFood(add, scale);
                state.complements.push(item);
                reqP -= item.protein; reqC -= item.carbs; reqF -= item.fat;
            }
        }
        
        if (reqC > 2) {
            let candidates = db.filter(f => isCommonC(f.name) && (f.category.includes('Zelenina') || f.category.includes('Ovoce')) && !state.rejectedComplements.includes(f.name));
            if (!candidates.length) candidates = db.filter(f => f.category.includes('Zelenina') && !state.rejectedComplements.includes(f.name));
            if (candidates.length) {
                const add = randChoice(candidates);
                // require at least 1g carbs per 100g to avoid Infinity bounds
                const divisor = add.carbs > 0.01 ? add.carbs : 0.05; 
                let scale = Math.ceil(reqC / divisor);
                scale = Math.max(20, Math.min(300, scale)); // Max 300g of veggies
                const item = scaleFood(add, scale);
                state.complements.push(item);
                reqP -= item.protein; reqC -= item.carbs; reqF -= item.fat;
            }
        } else if (currentC < 5) {
            const greens = db.filter(f => /okurka|špenát|salát/i.test(f.name) && !state.rejectedComplements.includes(f.name));
            if (greens.length) {
                const add = randChoice(greens);
                const item = scaleFood(add, 100); // 100g salad base
                state.complements.push(item);
                reqP -= item.protein; reqC -= item.carbs; reqF -= item.fat;
            }
        }

        if (reqF > 10) {
            let candidates = db.filter(f => isCommonF(f.name) && f.fat > 0.3 && !state.rejectedComplements.includes(f.name));
            if (!candidates.length) candidates = db.filter(f => (f.category.includes('Oleje') || f.category.includes('Ořechy')) && !state.rejectedComplements.includes(f.name));
            if (candidates.length) {
                const add = randChoice(candidates);
                const scale = Math.max(5, Math.ceil(reqF / add.fat));
                const item = scaleFood(add, scale);
                state.complements.push(item);
                reqP -= item.protein; reqC -= item.carbs; reqF -= item.fat;
            }
        }

        localStorage.setItem('kspDiary', JSON.stringify(state.diary));
        renderResults(state.complements);
    }

    function scaleFood(food, multiplier) {
        const orig = food.originalBase || food;
        const match = orig.amount.match(/[0-9.,]+/);
        const origGrams = match ? parseFloat(match[0].replace(',','.')) : 100;
        
        return {
            ...orig,
            amount: parseAmount(orig.amount, multiplier),
            kcal: orig.kcal * multiplier,
            protein: orig.protein * multiplier,
            carbs: orig.carbs * multiplier,
            fat: orig.fat * multiplier,
            score: orig.score,
            currentGrams: Math.round(origGrams * multiplier),
            originalBase: orig
        };
    }

    function parseAmount(amtStr, m) {
        return amtStr.replace(/\d+(?:[.,]\d+)?/g, match => {
            const num = parseFloat(match.replace(',', '.'));
            return Math.round(num * m);
        });
    }

    function randChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function createFoodCard(food, isBase = false, index = null, slotId = null) {
        const fallGrams = parseFloat((food.amount.match(/[0-9.,]+/) || [100])[0]);
        const displayGrams = food.currentGrams !== undefined ? food.currentGrams : fallGrams;
        
        const fkcal = Number(food.kcal.toFixed(2));
        const fp = Number(food.protein.toFixed(2));
        const fc = Number(food.carbs.toFixed(2));
        const ff = Number(food.fat.toFixed(2));
        
        const isSpecialFixed = food.name.startsWith("[Recept]") || food.name.startsWith("[Suplement]");
        
        return `
            <div class="fc-header">
                <div>
                    <div class="fc-title">${food.name}</div>
                    <div class="fc-cat">${food.category}</div>
                </div>
                ${isBase ? `<button class="remove-btn" onclick="window.removeBase('${slotId}', ${index})" title="Odebrat z jídla">&#10005;</button>` : `
                    <div style="display:flex; gap:5px;">
                        <button onclick="window.addComplement(${index})" class="btn-primary" style="padding: 5px 8px; font-size: 0.8rem; border-radius: 6px;">+ Přidat</button>
                        <button class="remove-btn" onclick="window.rejectComplement(${index})" title="Zahodit návrh a vygenerovat jiný" style="background:rgba(255,0,0,0.2); padding: 5px 8px; border-radius: 6px;">&#10005;</button>
                    </div>`}
            </div>
            ${(!isSpecialFixed) ? `
            <div style="margin-bottom:12px; margin-top:5px; display:flex; align-items:center; gap:8px;">
                <input type="number" min="0" step="5" value="${displayGrams}" 
                       onchange="${isBase ? `window.updateBaseAmount('${slotId}', ${index}, this.value)` : `window.updateComplementAmount(${index}, this.value)`}"
                       onkeyup="if(event.key === 'Enter') this.blur();"
                       title="Změnit množství v gramech"
                       style="width: 75px; padding: 6px; background: rgba(255,255,255,0.9); border: 1px solid var(--accent); color: var(--text-main); border-radius: 6px; text-align:center; font-size:1rem; outline:none; transition:0.3s; box-shadow: 0 1px 4px rgba(0,0,0,0.08);">
                <span style="font-size:0.9rem; color:var(--text-muted); font-weight:400;">g</span>
            </div>` : (`<div class="fc-amount" style="margin-bottom:12px; margin-top:5px; display:inline-block; color:var(--accent); font-weight:bold; background: rgba(0,0,0,0.05); padding: 5px 10px; border-radius: 5px;">${food.amount}</div>`)}
            <div class="fc-macros">
                <span><strong>${fkcal}</strong> kcal</span>
                <span><strong>${fp}g</strong> B</span>
                <span><strong>${fc}g</strong> S</span>
                <span><strong>${ff}g</strong> T</span>
            </div>
        `;
    }

    function renderResults(complements) {
        resultsSection.classList.remove('hidden');
        
        const slotsObj = state.getDailySlots();
        ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(slotId => {
            const grid = document.getElementById(`grid-${slotId}`);
            const macrosEl = document.getElementById(`macros-${slotId}`);
            
            if(!grid) return;
            
            grid.innerHTML = '';
            let sKcal = 0, sP = 0, sC = 0, sF = 0;
            
            slotsObj[slotId].forEach((food, idx) => {
                const el = document.createElement('div');
                el.className = 'food-card base-card';
                el.innerHTML = createFoodCard(food, true, idx, slotId);
                grid.appendChild(el);
                
                sKcal += food.kcal; sP += food.protein; sC += food.carbs; sF += food.fat;
            });
            
            if(slotsObj[slotId].length > 0) {
                macrosEl.innerHTML = `<strong>${Math.round(sKcal)}</strong> kcal &nbsp;|&nbsp; <strong>${Math.round(sP)}</strong>g B &nbsp;|&nbsp; <strong>${Math.round(sC)}</strong>g S &nbsp;|&nbsp; <strong>${Math.round(sF)}</strong>g T`;
            } else {
                macrosEl.innerText = "0 kcal";
            }
        });
        
        recommendationsGrid.innerHTML = '';
        complements.forEach((c, idx) => {
            const el = document.createElement('div');
            el.className = 'food-card';
            el.innerHTML = createFoodCard(c, false, idx);
            recommendationsGrid.appendChild(el);
        });

        // Totals
        const allDayFoods = window.getAllDayFoods();
        
        const tKcal = allDayFoods.reduce((s, x) => s + x.kcal, 0);
        const tP = allDayFoods.reduce((s, x) => s + x.protein, 0);
        const tC = allDayFoods.reduce((s, x) => s + x.carbs, 0);
        const tF = allDayFoods.reduce((s, x) => s + x.fat, 0);
        const tScore = Math.round(allDayFoods.reduce((s, x) => s + x.score, 0) / Math.max(1, allDayFoods.length));

        elKcal.innerText = Number(tKcal.toFixed(1));
        elP.innerText = Number(tP.toFixed(2)) + 'g';
        elC.innerText = Number(tC.toFixed(2)) + 'g';
        elF.innerText = Number(tF.toFixed(2)) + 'g';
        elScore.innerText = tScore;
        
        const burned = parseInt(document.getElementById('daily-burned').value) || 0;
        const targetKcal = state.dailyGoal + burned;
        
        renderProgressBars(tKcal, tP, tC, tF, targetKcal);
    }

    function renderProgressBars(tKcal, tP, tC, tF) {
        progressContainer.innerHTML = '';
        
        const makeBar = (label, current, max, unit, color) => {
            current = Number(current.toFixed(2));
            max = Number(max.toFixed(2));
            const pct = Math.min(100, Math.round((current / Math.max(1, max)) * 100));
            let diff = max - current;
            diff = Math.round(diff * 100) / 100; // Oprava nekonečných desetinných míst
            const isOver = diff < 0;
            
            let statusText = '';
            if (isOver) {
                statusText = `Přes limit o ${Math.abs(diff)}${unit}`;
            } else if (diff === 0) {
                statusText = `Splněno (100%)`;
            } else {
                statusText = `Chybí ${diff}${unit} pro denní cíl`;
            }

            return `
                <div class="progress-container">
                    <div class="progress-labels">
                        <span style="color: ${color}; font-weight: 700;">${label}</span>
                        <span>${current}${unit} / ${max}${unit} (${Math.round((current / Math.max(1, max)) * 100)}%)</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-fill" style="width: ${pct}%; background-color: ${isOver ? '#cc0000' : color};"></div>
                    </div>
                    <div class="progress-status ${isOver ? 'over' : ''}">${statusText}</div>
                </div>
            `;
        };

        progressContainer.innerHTML += makeBar('Energie (Kcal)', tKcal, state.dailyGoal, '', '#f59e0b');
        progressContainer.innerHTML += makeBar('Bílkoviny', tP, state.dailyP, 'g', '#3b82f6');
        progressContainer.innerHTML += makeBar('Sacharidy', tC, state.dailyC, 'g', '#10b981');
        progressContainer.innerHTML += makeBar('Tuky', tF, state.dailyF, 'g', '#ef4444');
    }

    // -----------------------------------------
    // TABLES / RECIPES / SUPPS VIEW LOGIC
    // -----------------------------------------
    const tablesSection = document.getElementById('tables-section');
    const recipesSection = document.getElementById('recipes-section');
    const supplementsSection = document.getElementById('supplements-section');
    const mainControls = document.querySelector('.controls');
    
    const navBuilder = document.getElementById('nav-builder');
    const navTables = document.getElementById('nav-tables');
    const navRecipes = document.getElementById('nav-recipes');
    const navSupplements = document.getElementById('nav-supplements');

    function switchTab(tabId) {
        if (!window.isPro && (tabId === 'builder' || tabId === 'supplements')) {
            window.openProfileModal();
            return;
        }
        navBuilder.classList.toggle('active', tabId === 'builder');
        navTables.classList.toggle('active', tabId === 'tables');
        navRecipes.classList.toggle('active', tabId === 'recipes');
        navSupplements.classList.toggle('active', tabId === 'supplements');

        tablesSection.classList.toggle('hidden', tabId !== 'tables');
        recipesSection.classList.toggle('hidden', tabId !== 'recipes');
        supplementsSection.classList.toggle('hidden', tabId !== 'supplements');
        mainControls.classList.toggle('hidden', tabId !== 'builder');
        
        if (tabId === 'builder') {
            renderFavBaseGrid();
            if (state.baseFoods.length > 0) resultsSection.classList.remove('hidden');
        } else {
            resultsSection.classList.add('hidden');
            if (tabId === 'tables') renderTables();
            if (tabId === 'recipes') renderRecipes('all');
            if (tabId === 'supplements') renderSupplements();
        }
    }

    navBuilder.addEventListener('click', () => switchTab('builder'));
    navTables.addEventListener('click', () => switchTab('tables'));
    navRecipes.addEventListener('click', () => switchTab('recipes'));
    navSupplements.addEventListener('click', () => switchTab('supplements'));

    // -----------------------------------------
    // RECIPES RENDER LOGIC
    // -----------------------------------------
    const recipesContainer = document.getElementById('recipes-container');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const recipeModal = document.getElementById('recipe-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('close-modal');

    let favorites = [];
    let favBaseItems = [];

    window.reloadFavorites = function() {
        const recKey = state.globalMode === 'lc' ? 'lcFavorites' : 'ketoFavorites';
        const baseKey = state.globalMode === 'lc' ? 'lcFavBaseItems' : 'favBaseItems';
        favorites = JSON.parse(localStorage.getItem(recKey) || '[]');
        favBaseItems = JSON.parse(localStorage.getItem(baseKey) || '[]');
    };
    window.reloadFavorites();
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderRecipes(btn.dataset.filter);
        });
    });

    window.toggleFav = function(e, id) {
        if(e) e.stopPropagation();
        const recKey = state.globalMode === 'lc' ? 'lcFavorites' : 'ketoFavorites';
        if (favorites.includes(id)) {
            favorites = favorites.filter(fid => fid !== id);
        } else {
            favorites.push(id);
        }
        localStorage.setItem(recKey, JSON.stringify(favorites));
        renderRecipes(document.querySelector('.filter-btn.active').dataset.filter);
    };

    window.toggleBaseFav = function(e, id) {
        if(e) e.stopPropagation();
        const baseKey = state.globalMode === 'lc' ? 'lcFavBaseItems' : 'favBaseItems';
        if (favBaseItems.includes(id)) {
            favBaseItems = favBaseItems.filter(fid => fid !== id);
        } else {
            favBaseItems.push(id);
        }
        localStorage.setItem(baseKey, JSON.stringify(favBaseItems));
        if (typeof tablesRendered !== 'undefined' && tablesRendered) {
            const tableSearchInput = document.getElementById('table-search-input');
            renderTables(tableSearchInput ? tableSearchInput.value.trim().toLowerCase() : '');
        }
        renderFavBaseGrid();
    };

    window.addFavToBase = function(id) {
        const item = window.foodDatabase.find(x => (x.id || x.name) === id);
        if(item) {
            window.pushToBase(scaleFood(item, computeMultiplier(item)));
            navBuilder.click();
            generateMeal();
        }
    };
    
    function renderFavBaseGrid() {
        const grid = document.getElementById('fav-base-grid');
        if (!grid) return;
        
        if (favBaseItems.length === 0) {
            grid.innerHTML = '<span style="color:var(--text-muted); font-size:0.9rem;">Zatím nemáš žádné oblíbené potraviny.<br>Kliknutím na hvězdičku v záložce Databáze potravin si je sem rovnou přidáš!</span>';
            return;
        }
        
        let favItemsObj = [];
        favBaseItems.forEach(fid => {
            const item = window.foodDatabase.find(x => (x.id || x.name) === fid);
            if (item) favItemsObj.push(item);
        });
        
        favItemsObj.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
        
        let html = '';
        favItemsObj.forEach(item => {
            html += `
                <div style="flex: 0 0 auto; background: rgba(255,255,255,0.05); padding: 10px 15px; border-radius: 8px; border: 1px solid var(--glass-border); cursor:pointer; min-width:120px; transition:0.2s;" 
                     onmouseover="this.style.background='rgba(255,255,255,0.1)'" 
                     onmouseout="this.style.background='rgba(255,255,255,0.05)'"
                     title="${item.name}"
                     onclick="window.addFavToBase('${item.id || item.name}')">
                    <div style="font-weight:600; font-size:0.9rem; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.name}</div>
                    <div style="font-size:0.75rem; color:var(--accent); margin-top:2px;">+ Přidat do základu</div>
                </div>
            `;
        });
        grid.innerHTML = html;
    }
    
    function renderRecipes(filterCategory) {
        if (typeof filterCategory !== 'string') {
            const activeBtn = document.querySelector('.filter-btn.active');
            filterCategory = activeBtn ? activeBtn.dataset.filter : 'all';
        }

        let searchTerm = '';
        const searchInput = document.getElementById('recipes-search-input');
        if (searchInput) {
            searchTerm = searchInput.value.trim().toLowerCase();
        }

        recipesContainer.innerHTML = '';
        if (!window.ketoRecipes) return;
        
        let filtered = window.ketoRecipes.filter(r => r.mode === state.globalMode || r.mode === 'keto');
        
        if (filterCategory === 'favorites') {
            filtered = filtered.filter(r => favorites.includes(r.id));
        } else if (filterCategory !== 'all') {
            filtered = filtered.filter(r => r.category === filterCategory);
        }

        if (searchTerm) {
            const st = window.removeDiacriticsExp ? window.removeDiacriticsExp(searchTerm) : searchTerm;
            filtered = filtered.filter(r => {
                const title = window.removeDiacriticsExp ? window.removeDiacriticsExp(r.title) : r.title.toLowerCase();
                const ingStr = r.ingredients ? (window.removeDiacriticsExp ? window.removeDiacriticsExp(r.ingredients.join(' ')) : r.ingredients.join(' ').toLowerCase()) : '';
                return title.includes(st) || ingStr.includes(st);
            });
        }
        
        if (filtered.length === 0 && !window.isAdmin) {
            recipesContainer.innerHTML = '<p style="color:var(--text-muted); width: 100%; text-align: center;">V této kategorii zatím nejsou žádné recepty nebo vyhledávání nic nenašlo.</p>';
            return;
        }

        if (window.isAdmin && (filterCategory === 'all' || filterCategory === 'Hlavní jídlo')) {
            recipesContainer.innerHTML += `
               <div class="recipe-card fade-in" style="justify-content:center; align-items:center; min-height:250px; background: rgba(255,255,255,0.02); border:2px dashed var(--glass-border); cursor:pointer;" onclick="window.openAdminForm('recipe')">
                   <h3 style="color:var(--accent);">+ Přidat vlastní recept</h3>
               </div>
            `;
        }
        
        let recipeCount = 0;
        filtered.forEach(r => {
            if (!window.isPro && recipeCount >= 3 && !favorites.includes(r.id)) return;
            if (!favorites.includes(r.id)) recipeCount++;
            
            const isFav = favorites.includes(r.id);
            const finalImage = imageOverrides[r.id] || r.image;
            const imgSrc = (finalImage.startsWith('http') || finalImage.startsWith('data:')) ? finalImage : 'img/' + finalImage;
            


            let icon = '🍽️';
            if (r.category.includes('Snídaně')) icon = '🥣';
            if (r.category.includes('Polévka')) icon = '🍲';
            if (r.category.includes('Smoothie')) icon = '🥤';
            if (r.category.includes('Hlavní')) icon = '🍛';
            if (r.category.includes('Základ')) icon = '🥖';
            if (r.category.includes('sladkého')) icon = '🍰';

            const card = document.createElement('div');
            card.className = 'recipe-card fade-in';
            card.onclick = () => openRecipeModal(r);
            card.innerHTML = `
                <div style="font-size: 2.2rem; background: rgba(0,0,0,0.04); border-radius: 12px; min-width: 60px; height: 60px; display:flex; justify-content:center; align-items:center;">
                    ${icon}
                </div>
                <div style="flex: 1;">
                    <button class="fav-btn ${isFav ? 'is-fav' : ''}" onclick="window.toggleFav(event, '${r.id}')" style="top: 15px; right: 15px;">★</button>

                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px; padding-right: 30px;">
                        <div class="recipe-title" style="margin-bottom: 0; font-size: 1.05rem; font-weight: 400;">${r.title}</div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 2px;">
                        <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; white-space: nowrap;">⏱ ${r.time} min</span>
                        <span style="color: var(--glass-border); font-size: 0.8rem;">|</span>
                        <div style="display: flex; align-items: center; gap: 12px; font-size: 0.8rem; white-space: nowrap;">
                            <span><b>${r.kcal}</b> kcal</span>
                            <span style="color:#4299e1;"><b>B</b> ${r.protein}g</span>
                            <span style="color:#e53e3e;"><b>S</b> ${r.carbs}g</span>
                            <span style="color:#ecc94b;"><b>T</b> ${r.fat}g</span>
                        </div>
                    </div>
                </div>
            `;
            recipesContainer.appendChild(card);
        });
        
        if (!window.isPro && filtered.length > 3) {
            recipesContainer.innerHTML += `
               <div style="grid-column: 1 / -1; text-align:center; padding: 40px 20px; background: rgba(93,168,71,0.04); border-radius: 15px; border: 1px dashed var(--glass-border); display:flex; flex-direction:column; align-items:center;">
                   <div style="font-size:3rem; margin-bottom:15px; filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));">🔒</div>
                   <h2 style="color:var(--text-light); margin-top:0;">Přístup ke všem prémiovým receptům</h2>
                   <p style="color:var(--text-muted); margin-bottom:25px; max-width: 400px; line-height: 1.5; font-size: 0.95rem;">Zkušební verze umožňuje náhled pouze prvních tří základních receptů. Získej plný přístup ke stovkám špičkových jídel.</p>
                   <button onclick="window.openProfileModal()" class="btn" style="box-shadow: 0 5px 15px rgba(0,0,0,0.3);">Získat PRO verzi aplikace</button>
               </div>
            `;
        }
    }

    function openRecipeModal(r) {
        const isFav = favorites.includes(r.id);
        const finalImage = imageOverrides[r.id] || r.image;
        const imgSrc = (finalImage.startsWith('http') || finalImage.startsWith('data:')) ? finalImage : 'img/' + finalImage;
        
        let adminImgBtn = '';
        if (window.isAdmin) {
            adminImgBtn = `<button onclick="document.getElementById('img-edit-overlay').style.display='flex';" style="position:absolute; top:15px; left:15px; background:rgba(0,0,0,0.8); font-size:0.9rem; border:1px solid var(--accent); color:var(--accent); padding:8px 12px; border-radius:8px; z-index:20; cursor:pointer; font-weight:bold;">✎ Změnit Foto</button>`;
        }
        
        modalBody.innerHTML = `
            <div style="position:relative; width: 100%;">
                ${adminImgBtn}
                <div id="img-edit-overlay" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:30; align-items:center; justify-content:center; flex-direction:column; padding:20px; text-align:center;">
                     <h4 style="color:#fff; margin-top:0; margin-bottom:15px;">Změna Fotografie</h4>
                     
                     <div style="display:flex; flex-direction:column; gap:8px; width:100%; max-width:300px; margin-bottom:15px;">
                         <label style="background:rgba(255,255,255,0.9); color:#111; padding:10px; border-radius:8px; cursor:pointer; font-weight:bold; border:1px solid rgba(255,255,255,0.2);">
                             📸 Vybrat z disku / Vyfotit
                             <input type="file" id="new-img-file-input" accept="image/*" style="display:none;" onchange="document.getElementById('new-img-input').value = 'Místní soubor vybrán...';">
                         </label>
                         <span style="color:var(--text-muted); font-size:0.8rem;">NEBO vložit odkaz / název v img:</span>
                         <input type="text" id="new-img-input" value="${finalImage}" placeholder="moje_foto.jpg nebo http..." style="width:100%; box-sizing:border-box; padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.1); color:#fff; text-align:center; outline:none;">
                     </div>
                     
                     <div style="display:flex; gap:10px;">
                         <button onclick="window.saveRecipeImage('${r.id}')" style="background:var(--accent); color:#fff; padding:10px 20px; border-radius:8px; font-weight:bold; border:none; cursor:pointer;">Uložit</button>
                         <button onclick="document.getElementById('img-edit-overlay').style.display='none';" style="background:#555; color:#fff; padding:10px 20px; border-radius:8px; border:none; cursor:pointer;">Zrušit</button>
                     </div>
                </div>
                <img src="${imgSrc}" class="modal-hero">
            </div>
            <div class="modal-padding">
                <h2 style="margin-top:0; font-size: 1.6rem;">${r.title}</h2>
                <div style="color:var(--accent); margin-bottom: 25px; font-weight: 600;">⏱ Příprava: ${r.time} min &nbsp; | &nbsp; Kcal: ${r.kcal} (B: ${r.protein}g, S: ${r.carbs}g, T: ${r.fat}g)</div>
                
                <h3 style="border-bottom: 1px solid var(--glass-border); padding-bottom: 5px;">Ingredience:</h3>
                <ul style="color:var(--text-muted); padding-left: 20px; line-height: 1.8; margin-bottom: 25px;">
                    ${(r.ingredients || []).map(ing => `<li>${ing}</li>`).join('')}
                </ul>
                
                <h3 style="border-bottom: 1px solid var(--glass-border); padding-bottom: 5px;">Postup přípravy:</h3>
                <p style="color:var(--text-muted); line-height: 1.8;">${r.instructions || 'Detailní postup nebyl u tohoto receptu zaznamenán.'}</p>
                
                <div class="modal-actions">
                    <button class="btn-select" onclick="window.selectRecipe('${r.id}')">Vybrat jídlo (Započítat do Deníku)</button>
                    <button class="btn-fav" onclick="window.toggleFavModal('${r.id}')" style="background:var(--card-hover); color:var(--text-main); border: 1px solid var(--glass-border);">${isFav ? 'Odebrat z Oblíbených' : '★ Přidat do oblíbených'}</button>
                </div>
            </div>
        `;
        recipeModal.classList.remove('hidden');
    }

    window.selectRecipe = function(id) {
        const r = window.ketoRecipes.find(x => x.id === id);
        if (r) {
            window.pushToBase({
                name: "[Recept] " + r.title,
                category: r.category,
                amount: "1 Porce",
                kcal: r.kcal,
                protein: r.protein,
                carbs: r.carbs,
                fat: r.fat,
                score: 10
            });
            localStorage.setItem('kspDiary', JSON.stringify(state.diary));
            recipeModal.classList.add('hidden');
            navBuilder.click();
            generateMeal();
        }
    };

    window.toggleFavModal = function(id) {
        window.toggleFav(null, id);
        const r = window.ketoRecipes.find(x => x.id === id);
        if(r) openRecipeModal(r);
    };

    closeModalBtn.addEventListener('click', () => {
        recipeModal.classList.add('hidden');
    });
    recipeModal.addEventListener('click', (e) => {
        if (e.target === recipeModal) recipeModal.classList.add('hidden');
    });

    let tablesRendered = false;
    const tablesSearch = document.getElementById('tables-search');
    
    if (tablesSearch) {
        tablesSearch.addEventListener('input', (e) => {
            renderTables(e.target.value.trim().toLowerCase());
        });
    }

    function renderTables(searchTerm = '') {
        const searchInput = document.getElementById('db-search-input');
        if (!searchTerm && searchInput) {
            searchTerm = searchInput.value.trim().toLowerCase();
        }

        const container = document.getElementById('tables-container');
        container.innerHTML = '';
        
        if (window.isAdmin) {
            const btn = document.createElement('button');
            btn.className = 'accordion-btn';
            btn.style.color = 'var(--accent)';
            btn.innerHTML = `+ Přidat Vlastní Potravinu (Admin) <span class="icon">✏️</span>`;
            btn.onclick = () => window.openAdminForm('db');
            container.appendChild(btn);
        }

        // 1. Filter and Sort DB
        let filteredDb = [...db];
        
        // Seřadit názvy potravin abecedně (A-Z) dle české abecedy
        filteredDb.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
        
        if (searchTerm) {
            const st = removeDiacriticsExp ? removeDiacriticsExp(searchTerm) : searchTerm.toLowerCase();
            filteredDb = filteredDb.filter(item => {
                const n = removeDiacriticsExp ? removeDiacriticsExp(item.name) : item.name.toLowerCase();
                const c = item.category ? (removeDiacriticsExp ? removeDiacriticsExp(item.category) : item.category.toLowerCase()) : '';
                return n.includes(st) || c.includes(st);
            });
            if (filteredDb.length === 0) {
                container.innerHTML += '<p style="color:var(--text-muted); text-align:center; margin-top:20px;">Žádné potraviny neodpovídají hledání.</p>';
                return;
            }
        }

        // 2. Map into subcategories
        const catMap = {};
        filteredDb.forEach(item => {
            const cat = item.category || 'Ostatní';
            if (!catMap[cat]) catMap[cat] = [];
            catMap[cat].push(item);
        });

        // 3. Define SuperCategories logic
        const superMap = {
            'Maso / Mořské plody / Zvěřina': ['Hovězí', 'Vepřové', 'Drůbež', 'Ryby', 'Zvěřina', 'Uzenin', 'Maso', 'Mořské'],
            'Mléčné výrobky / Vejce': ['Vejc', 'Sýr', 'Smetan', 'Tvaroh', 'Mléčn', 'Kefír', 'Jogurt'],
            'Přílohy / Pečivo / Luštěniny': ['Příloh', 'Pečiv', 'Luštěnin', 'Rýž', 'Těstovin', 'Brambor'],
            'Ořechy / Ovoce / Zelenina': ['Zelenin', 'Ovoc', 'Ořech', 'Semínk', 'Mandl'],
            'Alternativy / Sladidla': ['Sacharidové', 'Sladidla', 'Kaka', 'Čokolád'],
            'Oleje / Tuky': ['Olej', 'Tuk', 'Sádl'],
            'Doplňky / Ostatní / Různé': ['Doplňk', 'Rostlinné', 'Speciál', 'Řasy']
        };

        // Assign subcategories to SuperCategories
        const structuredData = {};
        for (const [subCat, items] of Object.entries(catMap)) {
            let placed = false;
            for (const [superCat, mappingKeys] of Object.entries(superMap)) {
                if (mappingKeys.some(m => subCat.toLowerCase().includes(m.toLowerCase()))) {
                    if (!structuredData[superCat]) structuredData[superCat] = {};
                    structuredData[superCat][subCat] = items;
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                if (!structuredData['Doplňky / Ostatní / Různé']) structuredData['Doplňky / Ostatní / Různé'] = {};
                structuredData['Doplňky / Ostatní / Různé'][subCat] = items;
            }
        }

        // 4. Render SuperCategories UI sorted A-Z
        const superEntries = Object.entries(structuredData).sort((a, b) => a[0].localeCompare(b[0], 'cs'));
        
        let renderedCount = 0;
        for (const [superCat, subCatDict] of superEntries) {
            if (!window.isPro && renderedCount > 0 && superCat !== '⭐ Tvé oblíbené suroviny') {
                continue; // Omezit náhled na jednu sekci
            }
            if (superCat !== '⭐ Tvé oblíbené suroviny') renderedCount++;

            const accordionBtn = document.createElement('button');
            accordionBtn.className = 'accordion-btn';
            accordionBtn.innerHTML = `🌟 ${superCat} <span class="icon">${searchTerm ? '-' : '+'}</span>`;
            
            // Inicializace (otevřené složky svítí, zavřené jsou standardní)
            accordionBtn.style.color = searchTerm ? 'var(--accent)' : 'var(--text-color)';
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'accordion-content ' + (searchTerm ? '' : 'hidden');
            
            accordionBtn.addEventListener('click', function() {
                const icon = this.querySelector('.icon');
                if (contentDiv.classList.contains('hidden')) {
                    contentDiv.classList.remove('hidden');
                    icon.innerText = '-';
                    this.style.color = 'var(--accent)';
                    this.setAttribute('data-open', 'true');
                } else {
                    contentDiv.classList.add('hidden');
                    icon.innerText = '+';
                    this.style.color = 'var(--text-color)';
                    this.removeAttribute('data-open');
                }
            });
            
            // Render subcategories inside contentDiv (nested accordion) sorted A-Z
            const subEntries = Object.entries(subCatDict).sort((a, b) => a[0].localeCompare(b[0], 'cs'));
            for (const [subCatName, items] of subEntries) {
                
                const subAccBtn = document.createElement('button');
                subAccBtn.className = 'sub-accordion-btn';  // ← new colored class
                subAccBtn.style.paddingLeft = '22px';
                subAccBtn.innerHTML = `${subCatName} <span class="icon">${searchTerm ? '-' : '+'}</span>`;
                // color is handled by CSS class now
                
                const subContentDiv = document.createElement('div');
                subContentDiv.className = 'accordion-content ' + (searchTerm ? '' : 'hidden');
                
                subAccBtn.addEventListener('click', function() {
                    const icon = this.querySelector('.icon');
                    if (subContentDiv.classList.contains('hidden')) {
                        subContentDiv.classList.remove('hidden');
                        icon.innerText = '-';
                        this.setAttribute('data-open', 'true');
                    } else {
                        subContentDiv.classList.add('hidden');
                        icon.innerText = '+';
                        this.removeAttribute('data-open');
                    }
                });

                const table = document.createElement('table');
                table.className = 'category-table';
                table.style.marginTop = '5px';
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th width="30"></th>
                            <th>Potravina</th>
                            <th>Množství</th>
                            <th>Kcal</th>
                            <th>B / S / T</th>
                            <th>Skóre</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map((item, idx) => {
                            const itemId = item.id || item.name;
                            const isFav = favBaseItems.includes(itemId);
                            return `
                            <tr data-dbid="${itemId}">
                                <td style="text-align:center; font-size:1.2rem; cursor:pointer; color: ${isFav ? 'var(--accent)' : 'var(--text-muted)'};" onclick="window.toggleBaseFav(event, '${itemId}')">★</td>
                                <td>${item.name}</td>
                                <td>${item.amount}</td>
                                <td>${Number(item.kcal.toFixed(2))}</td>
                                <td>${Number(item.protein.toFixed(2))} / ${Number(item.carbs.toFixed(2))} / ${Number(item.fat.toFixed(2))}</td>
                                <td style="color:var(--accent);">★ ${item.score || 10}</td>
                            </tr>
                            `;
                        }).join('')}
                    </tbody>
                `;
                
                table.querySelectorAll('tr').forEach(tr => {
                    tr.addEventListener('click', function() {
                        const targetId = this.getAttribute('data-dbid');
                        const selectedItem = items.find(x => (x.id || x.name) === targetId);
                        if(selectedItem) {
                            window.pushToBase(scaleFood(selectedItem, computeMultiplier(selectedItem)));
                            navBuilder.click();
                            generateMeal();
                        }
                    });
                });

                subContentDiv.appendChild(table);
                contentDiv.appendChild(subAccBtn);
                contentDiv.appendChild(subContentDiv);
            }
            
            container.appendChild(accordionBtn);
            container.appendChild(contentDiv);
        }
        
        tablesRendered = true;
    }



    // -----------------------------------------
    // SUPPLEMENTS RENDER LOGIC
    // -----------------------------------------
    const suppsContainer = document.getElementById('supplements-container');
    
    function renderSupplements() {
        suppsContainer.innerHTML = '';
        if (!window.ketoSupplements) return;

        let searchTerm = '';
        const searchInput = document.getElementById('supps-search-input');
        if (searchInput) {
            searchTerm = searchInput.value.trim().toLowerCase();
        }
        
        let filteredSupps = window.ketoSupplements;
        if (searchTerm) {
            const st = window.removeDiacriticsExp ? window.removeDiacriticsExp(searchTerm) : searchTerm;
            filteredSupps = filteredSupps.filter(s => {
                const name = window.removeDiacriticsExp ? window.removeDiacriticsExp(s.name) : s.name.toLowerCase();
                const desc = s.desc ? (window.removeDiacriticsExp ? window.removeDiacriticsExp(s.desc) : s.desc.toLowerCase()) : '';
                return name.includes(st) || desc.includes(st);
            });
        }
        
        if (window.isAdmin) {
             const acard = document.createElement('div');
             acard.className = 'food-card fade-in';
             acard.style.display = 'flex';
             acard.style.justifyContent = 'center';
             acard.style.alignItems = 'center';
             acard.style.minHeight = '150px';
             acard.style.border = '2px dashed var(--glass-border)';
             acard.style.background = 'rgba(255,255,255,0.02)';
             acard.style.cursor = 'pointer';
             acard.innerHTML = `<h3 style="color:var(--accent);">+ Přidat vlastní suplement</h3>`;
             acard.onclick = () => window.openAdminForm('supp');
             suppsContainer.appendChild(acard);
        }

        if (filteredSupps.length === 0) {
            suppsContainer.innerHTML += '<p style="color:var(--text-muted); width: 100%; text-align: center; margin-top:20px;">Vyhledávání nic nenašlo.</p>';
        }

        filteredSupps.forEach(sup => {
            const card = document.createElement('div');
            card.className = 'food-card fade-in';
            card.style.position = 'relative';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.gap = '15px';
            
            // Dynamic macro calculation
            const getMacros = (amt) => ({
                k: (sup.macros.kcal * amt).toFixed(1),
                p: (sup.macros.p * amt).toFixed(1),
                c: (sup.macros.c * amt).toFixed(1),
                f: (sup.macros.f * amt).toFixed(1)
            });
            
            card.innerHTML = `
                <div>
                    <h3 style="margin-top:0; font-size:1.1rem; border-bottom:1px solid var(--glass-border); padding-bottom:8px;">${sup.name}</h3>
                    <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.4;">${sup.desc}</p>
                </div>
                
                <div style="display: flex; gap: 15px; align-items: center; justify-content:space-between; background: rgba(93,168,71,0.05); padding: 10px; border-radius: 8px;">
                    <div style="display:flex; flex-direction:column; gap: 5px;">
                        <label style="font-size:0.85rem; color:var(--text-muted);">Dávkování (${sup.unitName}):</label>
                        <input type="number" id="sup-amt-${sup.id}" value="${sup.defaultAmount}" step="${sup.step}" min="0" style="width: 70px; padding:5px; background:#ffffff; border:1px solid var(--glass-border); color:var(--text-main); border-radius:5px; text-align:center;">
                    </div>
                    <div id="sup-mac-${sup.id}" style="font-size:0.85rem; text-align:right;">
                        <strong style="color:var(--accent); font-size:1rem;">${getMacros(sup.defaultAmount).k} kcal</strong><br>
                        <span style="color:var(--text-muted);">B: ${getMacros(sup.defaultAmount).p}g, S: ${getMacros(sup.defaultAmount).c}g, T: ${getMacros(sup.defaultAmount).f}g</span>
                    </div>
                </div>
                
                <button class="btn-select" id="sup-btn-${sup.id}" style="border:none; border-radius:8px; padding:10px; cursor:pointer; font-weight:600; background:var(--accent); color:#fff; width:100%; transition:0.2s;">Zapít / Zkonzumovat (Přidat)</button>
            `;
            suppsContainer.appendChild(card);
            
            // Interaction
            const inputAmt = card.querySelector('#sup-amt-' + sup.id);
            const macDisplay = card.querySelector('#sup-mac-' + sup.id);
            const addBtn = card.querySelector('#sup-btn-' + sup.id);
            
            inputAmt.addEventListener('input', () => {
                const v = parseFloat(inputAmt.value) || 0;
                const m = getMacros(v);
                macDisplay.innerHTML = `
                    <strong style="color:var(--accent); font-size:1rem;">${m.k} kcal</strong><br>
                    <span style="color:var(--text-muted);">B: ${m.p}g, S: ${m.c}g, T: ${m.f}g</span>
                `;
            });
            
            addBtn.addEventListener('click', () => {
                const v = parseFloat(inputAmt.value) || 0;
                if(v <= 0) return;
                const m = getMacros(v);
                
                window.pushToBase({
                    name: "[Suplement] " + sup.name,
                    category: "Doplněk",
                    amount: v + " " + sup.unitName,
                    kcal: parseFloat(m.k),
                    protein: parseFloat(m.p),
                    carbs: parseFloat(m.c),
                    fat: parseFloat(m.f),
                    score: 10
                });
                navBuilder.click();
                generateMeal();
            });
        });
    }

    // -----------------------------------------
    // ADMIN && CUSTOM DB HYDRATION
    // -----------------------------------------
    const adminLoginBtn = document.getElementById('admin-login-btn');
    if (window.isAdmin && adminLoginBtn) adminLoginBtn.style.color = '#f59e0b';
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', () => {
            if (window.isAdmin) {
                localStorage.removeItem('kspAdmin'); location.reload();
            } else {
                if (prompt("Zadejte heslo administrátora (výchozí: admin):") === "admin") {
                    localStorage.setItem('kspAdmin', 'true'); location.reload();
                } else alert("Nesprávné heslo.");
            }
        });
    }

    const imageOverrides = JSON.parse(localStorage.getItem('kspImageOverrides') || '{}');

    // -----------------------------------------
    // ADMIN FORM DEFINITION & IMAGE OVERRIDES
    // -----------------------------------------
    const adminModal = document.getElementById('admin-modal');
    const adminForm = document.getElementById('admin-form');
    const afTarget = document.getElementById('admin-target');
    const lblCat = document.getElementById('lbl-cat');
    const lblAmt = document.getElementById('lbl-amt');
    const descContainer = document.getElementById('desc-container');
    const lblDesc = document.getElementById('lbl-desc');
    const imgContainer = document.getElementById('img-container');

    window.saveRecipeImage = function(id) {
        const fileInput = document.getElementById('new-img-file-input');
        const textInput = document.getElementById('new-img-input');
        
        const saveAndRender = (imgString) => {
            const overrides = JSON.parse(localStorage.getItem('kspImageOverrides') || '{}');
            overrides[id] = imgString;
            localStorage.setItem('kspImageOverrides', JSON.stringify(overrides));
            imageOverrides[id] = imgString;
            const imgSrc = imgString.startsWith('http') || imgString.startsWith('data:') ? imgString : 'img/' + imgString;
            document.querySelector('.modal-hero').src = imgSrc;
            document.getElementById('img-edit-overlay').style.display = 'none';
            window.renderRecipes(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
        };

        if (fileInput && fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 600;
                    const MAX_HEIGHT = 600;
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > height) {
                        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                    } else {
                        if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    saveAndRender(dataUrl);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            const newImg = textInput ? textInput.value.trim() : '';
            if (newImg && newImg !== '' && newImg !== 'Místní soubor vybrán...') {
                saveAndRender(newImg);
            } else {
                document.getElementById('img-edit-overlay').style.display = 'none';
            }
        }
    };

    window.openAdminForm = function(type) {
        afTarget.value = type;
        const titleMap = {'db': 'Nová Potravina', 'recipe': 'Nový Recept', 'supp': 'Nový Suplement'};
        document.getElementById('admin-modal-title').innerText = titleMap[type] || 'Nová položka';
        
        lblCat.innerText = 'Kategorie (např. Snídaně / Vitamíny / Maso):';
        lblAmt.innerText = type === 'supp' ? 'Jednotka (g/sáček/kapsle):' : (type === 'recipe' ? 'Příprava (čas min):' : 'Množství (např. 100g):');
        
        if (type === 'db') {
            descContainer.style.display = 'none';
        } else {
            descContainer.style.display = 'flex';
            lblDesc.innerText = type === 'recipe' ? 'Detailní postup přípravy (nepovinné):' : 'Bližší účinky doplňku (nepovinné):';
        }

        if (type === 'recipe') {
            imgContainer.style.display = 'flex';
        } else {
            imgContainer.style.display = 'none';
        }

        if(type === 'supp') document.getElementById('af-kcal').value = '0';
        else document.getElementById('af-kcal').value = '';
        
        adminModal.classList.remove('hidden');
    };

    if (document.getElementById('close-admin-modal')) {
        document.getElementById('close-admin-modal').addEventListener('click', () => adminModal.classList.add('hidden'));
    }

    if (adminForm) {
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const t = afTarget.value;
            const o = {
                id: 'cust_' + Date.now().toString(36),
                name: document.getElementById('af-name').value,
            };
            
            const k = parseFloat(document.getElementById('af-kcal').value) || 0;
            const p = parseFloat(document.getElementById('af-p').value) || 0;
            const c = parseFloat(document.getElementById('af-c').value) || 0;
            const f = parseFloat(document.getElementById('af-f').value) || 0;
            
            const catOrDesc = document.getElementById('af-cat').value;
            const amtStr = document.getElementById('af-amt').value;
            const extendedDesc = document.getElementById('af-desc').value;
            const customImg = document.getElementById('af-image').value;

            if (t === 'db') {
                o.kcal = k; o.protein = p; o.carbs = c; o.fat = f;
                o.category = catOrDesc; o.amount = amtStr; o.score = 10;
                customDb.push(o); localStorage.setItem('kspCustomDb', JSON.stringify(customDb));
                alert("Potravina úspěšně přidána do tabulek!");
            } else if (t === 'recipe') {
                o.title = o.name; delete o.name; o.category = catOrDesc; o.time = parseInt(amtStr) || 15;
                o.mode = "keto"; o.image = customImg ? customImg.trim() : "keto_main.png"; o.ingredients = [];
                o.instructions = extendedDesc ? extendedDesc : "Vlastní ručně přidaný recept.";
                o.kcal = k; o.protein = p; o.carbs = c; o.fat = f;
                customRecipes.push(o); localStorage.setItem('kspCustomRecipes', JSON.stringify(customRecipes));
                alert("Vlastní recept přidán!");
            } else if (t === 'supp') {
                o.desc = extendedDesc ? extendedDesc : catOrDesc; 
                o.unitName = amtStr; o.defaultAmount = 1; o.step = 1; o.macros = { kcal: k, p: p, c: c, f: f };
                customSupps.push(o); localStorage.setItem('kspCustomSupps', JSON.stringify(customSupps));
                alert("Suplement zaevidován!");
            }
            location.reload();
        });
    }
    
    // Export render functions for inline HTML attributes (search filters, etc.)
    window.renderTables = renderTables;
    window.renderRecipes = renderRecipes;
    window.renderSupplements = renderSupplements;

    renderFavBaseGrid();
});
