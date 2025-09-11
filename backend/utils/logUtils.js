// backend/utils/logUtils.js

/**
 * Affiche un encadré lisible dans la console avec message, date/heure et métadonnées (dept, semaine, année).
 *
 * @param {string} message - Message principal à afficher
 * @param {number|null} [week=null] - Semaine concernée
 * @param {number|null} [year=null] - Année concernée
 * @param {string|null} [dept=null] - Département concerné (ex: INFO)
 * @returns {void}
 */
function logBox(message, week = null, year = null, dept = null) {
    const borderChar = '═';
    const cornerTopLeft = '╔';
    const cornerTopRight = '╗';
    const cornerBottomLeft = '╚';
    const cornerBottomRight = '╝';
    const verticalChar = '║';

    const now = new Date();
    const dateTime = now.toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });

    let header = `${message} (Date: ${dateTime})`;
    if (dept) header += ` (Département: ${dept})`;
    if (week && year) header += ` (Semaine: ${week}, Année: ${year})`;

    const maxLength = header.length + 4; // 2 pour l'espace, 2 pour les bordures
    const horizontalBorder = borderChar.repeat(maxLength);

    console.log(`
    ${cornerTopLeft}${horizontalBorder}${cornerTopRight}
    ${verticalChar}  ${header}  ${verticalChar}
    ${cornerBottomLeft}${horizontalBorder}${cornerBottomRight}
    `);
}

module.exports = {
    logBox
}; 