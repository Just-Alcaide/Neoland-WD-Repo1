/* eslint-disable no-undef */
import { suma, toUpperCase, filterClubsByName, addUserToClub } from "../utils/tests.js";
import { getLoggedUserData } from "../utils/authService.js";


// test math
describe("we are gonna test if it adds correctly", () => {
    it("should add 1 + 2 equals 3", () => {
        expect(suma(1, 2)).toBe(3);
    });
});

// test string methods
describe("we are gonna test if it changes case of a string correctly", () => {
    it("should convert string 'hello' to 'HELLO'", () => {
        expect(toUpperCase("hello")).toBe("HELLO");
    });
});

// test auth
describe("we are gonna test if it gets the user data correctly", () => {
    beforeEach(() => {
        sessionStorage.setItem("loggedUser", JSON.stringify({ name: "Paco", email: "paco@email.com" }));
    });

    it("should get the logged user data from session storage", () => {
        const user = getLoggedUserData();
        expect(user).not.toBeNull();
        expect(user.name).toBe("Paco");
        expect(user.email).toBe("paco@email.com");
    });
});

// test filter
describe("we are gonna test if it filters the clubs correctly", () => {
    const clubs = [
        { name: "Literature Lovers" },
        { name: "Sci-Fi Enthusiasts" },
        { name: "Mystery Readers" }
    ];

    it("should return clubs that match the search term", () => {
        expect(filterClubsByName(clubs, "literature")).toEqual([{ name: "Literature Lovers" }]);
        expect(filterClubsByName(clubs, "sci")).toEqual([{ name: "Sci-Fi Enthusiasts" }]);
        expect(filterClubsByName(clubs, "mystery")).toEqual([{ name: "Mystery Readers" }]);
    });

    it("should return an empty array if no clubs match", () => {
        expect(filterClubsByName(clubs, "romance")).toEqual([]);
    });

    it("should return all clubs if search term is empty", () => {
        expect(filterClubsByName(clubs, "")).toEqual(clubs);
    });

    it("should be case insensitive", () => {
        expect(filterClubsByName(clubs, "LITERATURE")).toEqual([{ name: "Literature Lovers" }]);
        expect(filterClubsByName(clubs, "SCI")).toEqual([{ name: "Sci-Fi Enthusiasts" }]);
    });
});

// test addUserToClub
describe("we are gonna test if it adds a user to a club correctly", () => {
    const club = { name: "Book Club", members: ["123", "456"] };

    it("should add a new user to the club's members list", () => {
        const updatedClub = addUserToClub(club, "789");
        expect(updatedClub.members).toContain("789");
        expect(updatedClub.members.length).toBe(3);
    });

    it("should not add a user if they are already a member", () => {
        const updatedClub = addUserToClub(club, "123");
        expect(updatedClub.members.length).toBe(2);
    });

    it("should return the same club if no user ID is provided", () => {
        const updatedClub = addUserToClub(club, "");
        expect(updatedClub).toEqual(club);
    });

    it("should return the same club if null is passed as club", () => {
        const updatedClub = addUserToClub(null, "789");
        expect(updatedClub).toBe(null);
    });
});

