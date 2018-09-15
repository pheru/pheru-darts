export function sortPlayerByNameAsc(a, b) {
    if (a.name > b.name) {
        return 1;
    }
    if (a.name < b.name) {
        return -1;
    }
    return 0;
}

export function sortDartDataByScoreDesc(a, b) {
    let scoreA = parseInt(a.score, 10);
    let scoreB = parseInt(b.score, 10);
    if (scoreA < scoreB) {
        return 1;
    }
    if (scoreA > scoreB) {
        return -1;
    }
    return 0;
}

export function sortGameDataByOpponentAsc(a, b) {
    if (a.opponent > b.opponent) {
        return 1;
    }
    if (a.opponent < b.opponent) {
        return -1;
    }
    return 0;
}