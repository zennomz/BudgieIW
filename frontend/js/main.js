// Configuration de l'API
const API_BASE_URL = process.env.API_URL || 'http://api.budgie.local/api';

/**
 * Fetch wrapper pour les requêtes API
 */
async function apiCall(endpoint, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

    const finalOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, finalOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Initialisation de l'application
 */
function init() {
    console.log('Budgie Application - Initialisation');
    
    // Exemple d'appel API
    // loadData();
}

/**
 * Exemple de fonction pour charger des données
 */
async function loadData() {
    try {
        const data = await apiCall('/data');
        console.log('Data:', data);
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
}

// Initialiser l'app au chargement du DOM
document.addEventListener('DOMContentLoaded', init);
