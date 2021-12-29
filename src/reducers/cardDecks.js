
import { SHUFFLE_ALL_DECKS, DEAL_HEROES_TO_TOWN, DEAL_INITIAL_CARDS, BUILD_DUNGEON, DEAL_ROOM_CARD, BAIT_HEROES, HERO_KILLED, SET_HERO_START_OF_DUNGEON, RESET_PLAYER_CARDS, HERO_SURVIVED } from "../actions/types"
import { dungeonBack } from "../assets/cards"

const initialState = {
    bossDeck: [],
    heroDeck: [],
    epicHeroDeck: [],
    roomDeck: [],
    heroesInTown: [],
    heroesAtStartOfDungeon: [],
    playerBoss: {},
    playerRooms: [],
    playerDungeon: [

        // [{
        //     id: "R47",
        //     name: "Bottomless Pit",
        //     subtitle: "Trap Room",
        //     dmg: 1,
        //     treasure: "Thief",
        //     description: "Destroy this room: Kill a Hero in this room.",
        //     image: "/card-images/rooms/bottomless-pit.svg",
        // }],
        // [{
        //     id: "R58",
        //     name: "Recycling Center",
        //     subtitle: "Advanced Trap Room",
        //     dmg: 3,
        //     treasure: "Thief",
        //     description: "When another room in your dungeon is destroyed, you may draw two Room cards.",
        //     image: "/card-images/rooms/recycling-center.svg",
        // }],
        // [{
        //     id: "R29",
        //     name: "Monster's Ballroom",
        //     subtitle: "Advanced Monster Room",
        //     dmg: "*",
        //     treasure: "Fighter",
        //     description:
        //         "This room's damage is equal to the number of Monster rooms in your dungeon.",
        //     image: "/card-images/rooms/monsters-ballroom.svg",
        // }],
        // [{
        //     id: "R28",
        //     name: "Beast Menagerie",
        //     subtitle: "Advanced Monster Room",
        //     dmg: 4,
        //     treasure: "Fighter",
        //     description:
        //         "Once per turn when you build another Monster room, draw a Room card.",
        //     image: "/card-images/rooms/beast-menagerie.svg",
        // }],
        [dungeonBack], [dungeonBack],
        [dungeonBack], [dungeonBack],
        [dungeonBack], [dungeonBack]
    ]
}

const cardDecks = (state = initialState, action) => {

    switch (action.type) {
        case SHUFFLE_ALL_DECKS:
            console.log('shuffling deck')
            return {
                ...state,
                bossDeck: [...action.data.bossDeck],
                heroDeck: [...action.data.heroDeck],
                epicHeroDeck: [...action.data.epicHeroDeck],
                roomDeck: [...action.data.roomDeck],
            }
        case DEAL_HEROES_TO_TOWN:
            if (action.data.heroType === "ordinary") {
                console.log('dealing heroes to town', action.data.number)
                let chosenHeroes = state.heroDeck.slice(-action.data.number);
                let newHeroDeck = state.heroDeck.slice(0, - (action.data.number));
                console.log('chosenHeroes', chosenHeroes)
                console.log('newHeroDeck', newHeroDeck)
                return {
                    ...state,
                    heroesInTown: [...chosenHeroes],
                    heroDeck: state.heroDeck.slice(0, - (action.data.number))
                }
            }
            else{
                console.log('dealing heroes to town', action.data.number)
                let chosenHeroes = state.epicHeroDeck.slice(-action.data.number);
                let newHeroDeck = state.epicHeroDeck.slice(0, - (action.data.number));
                console.log('chosenHeroes', chosenHeroes)
                console.log('newHeroDeck', newHeroDeck)
                return {
                    ...state,
                    heroesInTown: [...chosenHeroes],
                    epicHeroDeck: state.epicHeroDeck.slice(0, - (action.data.number))
                }
            }

        case DEAL_INITIAL_CARDS:
            return {
                ...state,
                bossDeck: state.bossDeck.slice(0, -1),
                roomDeck: state.roomDeck.slice(0, -5),
                playerBoss: action.data.chosenBoss,
                playerRooms: [...action.data.chosenRooms]
            }
        case RESET_PLAYER_CARDS:
            return {
                ...state,
                playerRooms: [],
                playerDungeon: [[dungeonBack], [dungeonBack], [dungeonBack], [dungeonBack], [dungeonBack], [dungeonBack]],
                heroesInTown: [],
                heroesAtStartOfDungeon: []
            }
        case BUILD_DUNGEON:
            action.card.durability = 100
            // adds new room to dungeon if blank spot is clicked
            if(action.targetID === "D1"){

                let newPlayerDungeon = []

                // custom filter function to filter out cards with id of "D1"
                for(let i = 0; i < state.playerDungeon.length; i ++){
                    if(state.playerDungeon[i][0].id !== "D1"){
                        newPlayerDungeon.push(state.playerDungeon[i])
                    }
                }
                    
                newPlayerDungeon.push([action.card])

                for(let i = newPlayerDungeon.length; i < 6; i++){
                    newPlayerDungeon.push([dungeonBack])
                }

                return {
                    ...state,
                    playerDungeon: newPlayerDungeon,
                    playerRooms: state.playerRooms.filter(cardObj=>cardObj.id !== action.card.id)
                }
            }
            // adds new room on top of current room in dungeon
            else{

                let newPlayerDungeon = state.playerDungeon.map(roomArr=>{ //[[{}], [{}], [{}]]

                    if(roomArr[0].id === action.targetID){
                        // using tempArr so current roomArr in state.playerDungeon is not mutated
                        let tempArr = [...roomArr]
                        tempArr.unshift(action.card)
                        return tempArr
                    }
                    else{
                        return roomArr
                    }
                })
                return{
                    ...state,
                    playerDungeon: newPlayerDungeon,
                    playerRooms: state.playerRooms.filter(cardObj=>cardObj.id !== action.card.id)
                }
            }
        case DEAL_ROOM_CARD:
            return {
                ...state,
                roomDeck: state.roomDeck.slice(0, -1),
                playerRooms: state.playerRooms.concat(state.roomDeck.slice(-1))
            }
        case BAIT_HEROES:
            console.log("boss treasure", state.playerBoss.treasure)
            let bossTreasure = state.playerBoss.treasure;
            let thiefTreasure = action.data.treasureThief;
            let clericTreasure = action.data.treasureCleric;
            let fighterTreasure = action.data.treasureFighter;
            console.log("thiefTreasure", thiefTreasure, "clericTreasure", clericTreasure, "fighterTreasure", fighterTreasure)
            // adding the boss treasure to the treasure type depending on the boss
            switch (bossTreasure) {
                case "Thief":
                    thiefTreasure++
                    break
                case "Cleric":
                    clericTreasure++
                    break
                case "Fighter":
                    fighterTreasure++
                    break
                default:
                    break;
            }
            console.log("thiefTreasure", thiefTreasure, "clericTreasure", clericTreasure, "fighterTreasure", fighterTreasure)
            // accidentally did baiting based off hero treasures instead of room treasures (not removing bc could potentially reference in future)
            let heroesToPlayerDungeon = state.heroesInTown.filter(hero => {
                console.log(hero)
                console.log(action.data)

                // if the hero is the fool he always goes to the dungeon
                if (hero.treasure === "?") {
                    return true
                }
                // if the hero is ordinary
                if (hero.subtitle === "Ordinary-Hero") {
                    console.log('ordinary hero')
                    if (hero.treasure === "Thief" && thiefTreasure > 1) {
                        return true
                    }
                    if (hero.treasure === "Cleric" && clericTreasure > 1) {
                        return true
                    }
                    if (hero.treasure === "Fighter" && fighterTreasure > 1) {
                        return true
                    }
                }
                // if the hero is epic
                else {
                    if (hero.treasure === "Thief" && thiefTreasure > 3) {
                        return true
                    }
                    if (hero.treasure === "Cleric" && clericTreasure > 3) {
                        return true
                    }
                    if (hero.treasure === "Fighter" && fighterTreasure > 3) {
                        return true
                    }
                }
                // if no case matches then the hero stays in town
                return false
            })
            console.log(heroesToPlayerDungeon)
            return {
                ...state,
                heroesInTown: state.heroesInTown.filter(hero => !heroesToPlayerDungeon.includes(hero)),
                heroesAtStartOfDungeon: [...heroesToPlayerDungeon]
            }
        case HERO_KILLED:
            return {
                ...state,
                heroesAtStartOfDungeon: state.heroesAtStartOfDungeon.slice(1),
            }
        case HERO_SURVIVED:
            return {
                ...state,
                heroesAtStartOfDungeon: state.heroesAtStartOfDungeon.slice(1),
            }
        case SET_HERO_START_OF_DUNGEON:
            return {
                ...state,
                heroesInTown: [],
            }
        default:
            return state
    }
}

export default cardDecks