window.translations = {
    "cs": {
        "nav_builder": "Ketoly",
        "nav_tables": "Databáze potravin",
        "nav_recipes": "Hotová Jídla",
        "nav_supps": "Suplementy",
        "mode_keto": "KETO Zóna",
        "mode_lc": "LOW CARB Zóna",
        "subtitle": "Zadej potraviny a sestav si dokonalá makra pro svůj režim.",
        "profile": "Profil"
    },
    "en": {
        "nav_builder": "Ketoly",
        "nav_tables": "Food Database",
        "nav_recipes": "Ready Meals",
        "nav_supps": "Supplements",
        "mode_keto": "KETO Zone",
        "mode_lc": "LOW CARB Zone",
        "subtitle": "Enter foods and build perfect macros for your diet.",
        "profile": "Profile"
    },
    "de": {
        "nav_builder": "Ketoly",
        "nav_tables": "Lebensmitteldatenbank",
        "nav_recipes": "Fertiggerichte",
        "nav_supps": "Ergänzungen",
        "mode_keto": "KETO-Zone",
        "mode_lc": "LOW CARB-Zone",
        "subtitle": "Geben Sie Lebensmittel ein und erstellen Sie perfekte Makros.",
        "profile": "Profil"
    },
    "es": {
        "nav_builder": "Ketoly",
        "nav_tables": "Base de datos",
        "nav_recipes": "Comidas preparadas",
        "nav_supps": "Suplementos",
        "mode_keto": "Zona CETO",
        "mode_lc": "Zona BAJA EN CARBOHIDRATOS",
        "subtitle": "Introduce alimentos y crea los macros perfectos.",
        "profile": "Perfil"
    },
    "it": {
        "nav_builder": "Ketoly",
        "nav_tables": "Database degli Alimenti",
        "nav_recipes": "Pasti Pronti",
        "nav_supps": "Integratori",
        "mode_keto": "Zona KETO",
        "mode_lc": "Zona LOW CARB",
        "subtitle": "Inserisci gli alimenti e crea macro perfetti.",
        "profile": "Profilo"
    },
    "fr": {
        "nav_builder": "Ketoly",
        "nav_tables": "Base de données",
        "nav_recipes": "Plats cuisinés",
        "nav_supps": "Suppléments",
        "mode_keto": "Zone KETO",
        "mode_lc": "Zone LOW CARB",
        "subtitle": "Saisissez des aliments et créez des macros parfaits.",
        "profile": "Profil"
    },
    "pt": {
        "nav_builder": "Ketoly",
        "nav_tables": "Banco de Dados de Alimentos",
        "nav_recipes": "Refeições Prontas",
        "nav_supps": "Suplementos",
        "mode_keto": "Zona KETO",
        "mode_lc": "Zona LOW CARB",
        "subtitle": "Insira alimentos e construa macros perfeitos.",
        "profile": "Perfil"
    },
    "ru": {
        "nav_builder": "Ketoly",
        "nav_tables": "База продуктов",
        "nav_recipes": "Готовые блюда",
        "nav_supps": "Добавки",
        "mode_keto": "КЕТО Зона",
        "mode_lc": "LOW CARB Зона",
        "subtitle": "Введите продукты и составьте идеальные макросы.",
        "profile": "Профиль"
    },
    "zh": {
        "nav_builder": "Ketoly",
        "nav_tables": "食品数据库",
        "nav_recipes": "即食餐",
        "nav_supps": "补充剂",
        "mode_keto": "生酮区",
        "mode_lc": "低碳水区",
        "subtitle": "输入食物并建立完美的宏量营养素。",
        "profile": "个人资料"
    }
};

window.setLanguage = function(lang) {
    if (!window.translations[lang]) lang = 'cs';
    localStorage.setItem('kspAppLang', lang);
    const dict = window.translations[lang];
    
    // UI Překlady
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            if (el.tagName === 'INPUT' && el.type === 'text') {
                el.placeholder = dict[key];
            } else {
                // zachováme child elementy jako icony pokud jsou uvnitř (vyžaduje složitější logiku, proto jen textContent nebo innerHTML)
                // Pokud má ikonu, překládáme jen specifický span, lepší přistupovat přes ID nebo strukturu.
                if(el.id === 'user-badge-text') {
                    el.textContent = dict[key];
                } else if(el.tagName === 'BUTTON' && el.querySelector('.icon')) {
                    // ignore for now
                } else {
                    el.textContent = dict[key];
                }
            }
        }
    });

    // DB Přepnutí (Příprava)
    window.currentLang = lang;
    
    // Obnovit zobrazení
    if(window.renderFavBaseGrid) window.renderFavBaseGrid();
    if(window.renderRecommendations) window.renderRecommendations();
    if(window.renderTables) window.renderTables();
    if(window.renderRecipes) window.renderRecipes(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
    if(window.renderSupplements) window.renderSupplements();
    
    // Upravit barvu aktivní vlaječky
    document.querySelectorAll('.lang-flag').forEach(f => f.style.opacity = '0.3');
    document.querySelectorAll(`.lang-flag[data-lang="${lang}"]`).forEach(f => {
        f.style.opacity = '1';
    });
};

// Auto-init po načtení DOMu
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('kspAppLang') || 'cs';
    window.setLanguage(savedLang);
});
