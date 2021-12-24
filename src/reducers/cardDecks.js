
import { SHUFFLE_ALL_DECKS, DEAL_HEROES_TO_TOWN, DEAL_INITIAL_CARDS, BUILD_DUNGEON, DEAL_ROOM_CARD, BAIT_HEROES } from "../actions/types"
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
    playerDungeon: [ [dungeonBack], [dungeonBack], [dungeonBack], [dungeonBack], [dungeonBack], [dungeonBack]
        // [{
        //     id: "R47",
        //     name: "Bottomless Pit",
        //     subtitle: "Trap Room",
        //     dmg: 1,
        //     treasure: "Thief",
        //     description: "Destroy this room: Kill a Hero in this room.",
        //     image: "/card-images/rooms/bottomless-pit.svg",
        // },
        // {
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
        //     description:"When another room in your dungeon is destroyed, you may draw two Room cards.",
        //     image: "/card-images/rooms/recycling-center.svg",
        // }],
        // [{
        //     id: "R58",
        //     name: "Recycling Center",
        //     subtitle: "Advanced Trap Room",
        //     dmg: 3,
        //     treasure: "Thief",
        //     description:"When another room in your dungeon is destroyed, you may draw two Room cards.",
        //     image: "/card-images/rooms/recycling-center.svg",
        // }]
    ]
}

const cardDecks = (state = initialState, action) => {

    switch(action.type){
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
            console.log('dealing heroes to town', action.data.number)
            let chosenHeroes = state.heroDeck.slice(0, action.data.number);
            let newHeroDeck = state.heroDeck.slice(0, - (action.data.number/2))
            console.log('chosenHeroes', chosenHeroes)
            console.log('newHeroDeck', newHeroDeck)
            return {
                ...state,
                heroesInTown: [...chosenHeroes],
                // not sure why this works since it should not need to be divided by 2 ( i think this runs twice is why? )
                heroDeck: state.heroDeck.slice(0, - (action.data.number))
            }
        case DEAL_INITIAL_CARDS:

            return {
                ...state,
                bossDeck: state.bossDeck.slice(0, -1),
                roomDeck: state.roomDeck.slice(0, -5),
                playerBoss: action.data.chosenBoss,
                playerRooms: [...action.data.chosenRooms]
            }
        case BUILD_DUNGEON:
            console.log("BUILD_DUNGEON state.playerDungeon", state.playerDungeon)
            console.log("BUILD_DUNGEON action.id", action.card.id)
            console.log("BUILD_DUNGEON ction.targetID", action.targetID)
            // adds new room to dungeon if blank spot is available
            if(action.targetID === "D1"){
                console.log("BUILD_DUNGEON inside if-statement")
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
            // adds new room on top of other room in dungeon
            else{
                console.log("BUILD_DUNGEON inside else statement")
                let newPlayerDungeon = state.playerDungeon.map(roomArr=>{ //[[{}], [{}], [{}]]
                    console.log("roomArr[0].id", roomArr[0].id)
                    if(roomArr[0].id === action.targetID){
                        console.log("roomArr inside", roomArr)
                        // using tempArr so current roomArr in state.playerDungeon is not mutated
                        let tempArr = [...roomArr]
                        tempArr.unshift(action.card)
                        console.log("roomArr after unshift", tempArr)
                        return tempArr
                    }
                    else{
                        return roomArr
                    }
                })

                console.log("BUILD_DUNGEON newPlayerDungeon", newPlayerDungeon)
                console.log("BUILD_DUNGEON state.playerDungeon", state.playerDungeon)
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


            // accidentally did baiting based off hero treasures instead of room treasures (not removing bc could potentially reference in future)
            let heroesToPlayerDungeon = state.heroesInTown.filter(hero=> {
                console.log(hero)
                console.log(action.data)
                
                if(hero.subtitle === "Ordinary-Hero"){
                    if(hero.treasure === "Thief" && action.data.treasureThief>1){
                        return true
                    }
                    if(hero.treasure === "Cleric" && action.data.treasureCleric>1){
                        return true
                    }
                    if(hero.treasure === "Fighter" && action.data.treasureFighter>1){
                        return true
                    }
                }
                else{
                    if(hero.treasure === "Thief" && action.data.treasureThief>3){
                        return true
                    }
                    if(hero.treasure === "Cleric" && action.data.treasureCleric>3){
                        return true
                    }
                    if(hero.treasure === "Fighter" && action.data.treasureFighter>3){
                        return true
                    }
                }
                // if no case matches then the hero stays in town
                return false
            })
            console.log(heroesToPlayerDungeon)
            return {
                ...state,
                heroesInTown: state.heroesInTown.filter(hero=> !heroesToPlayerDungeon.includes(hero)),
                heroesAtStartOfDungeon: [...heroesToPlayerDungeon]
            }
        default:
            return state
    }
}

export default cardDecks