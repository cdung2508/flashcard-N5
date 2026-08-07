export const getCurrentLevel = () => {
    const VALID_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
    const level = localStorage.getItem('currentLevel');

    return VALID_LEVELS.includes(level) ? level : 'N5';
}