export function suma(a, b) {
    return a + b;
}

export function toUpperCase(str) {
    return str.toUpperCase();
}

export function filterClubsByName(clubs, searchTerm) {
    if (!searchTerm.trim()) return clubs; 
    return clubs.filter(club =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

export function addUserToClub(club, userId) {
    if (!club || !userId) return club; 
    if (!club.members.includes(userId)) {
        return { ...club, members: [...club.members, userId] };
    }
    return club; 
}