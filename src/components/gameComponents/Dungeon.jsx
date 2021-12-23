import React from 'react'
import '../css/Dungeon.css'
import { bossDeck, heroDeck } from "../../assets/cards"
import { useSelector, useDispatch } from 'react-redux';
import { selectCard, buildingMode } from '../../actions/miscActions';
import { buildDungeon } from '../../actions/sampleActions';
import Card from './Card'
import { cardBack } from '../../assets/cards';

function Dungeon() {

    const dispatch = useDispatch()

    const playerDungeon = useSelector(state => state.cardDecks.playerDungeon)
    const heroesAtStartOfDungeon = useSelector(state => state.cardDecks.heroesAtStartOfDungeon)
    const heroRoomPosition = useSelector(state => state.heroStats.heroRoomPosition)
    const buildingModeState = useSelector(state => state.misc.buildingMode)
    const selectedCard = useSelector(state => state.misc.card)

    console.log(heroRoomPosition);

    const renderHeroAtPosition = () => {
        // return [<Card cardObj={heroesAtStartOfDungeon[0]} className="hero"/>,<Card cardObj={heroesAtStartOfDungeon[0]} className="hero"/>]
        let renderHeroArray = []
        for (let roomIndex = 5; roomIndex >= 0; roomIndex--) {
            if (heroRoomPosition===roomIndex) {
                renderHeroArray.push(<Card cardObj={heroesAtStartOfDungeon[0]} className="hero"/>)
            }
            else{
                renderHeroArray.push(<Card cardObj={cardBack} className="hero hero_blank"/>)
            }
        }
        return renderHeroArray;
    }

    const handleBuild = (cardObj) => {
        if(buildingModeState){
            dispatch(buildDungeon(cardObj))
            // keeps players from building the same repeatedly
            dispatch(selectCard(cardObj, "builtRoom"))
            // turns buildingMode off after building room
            dispatch(buildingMode())
        }
    }

    return (
        <div className='dungeonBody'>
            {/* -- HERO AREA -- */}
            <div className='heroDisplay' >
                {heroesAtStartOfDungeon.length ? 
                renderHeroAtPosition()
                // <Card cardObj={heroesAtStartOfDungeon[0]} className="hero"/>
                :null}
            </div>
            {/* -- DUNGEON AREA -- */}
            <div className='dungeonDisplay'>
                <div  className={buildingModeState ? 'roomAreaBuilding' : 'roomArea'} onClick={()=>handleBuild(selectedCard)}>
                    {playerDungeon && playerDungeon.map((roomCard, index)=>{
                            return <Card cardObj={roomCard[0]} className="room" key={index}/>
                        })
                    }
                </div>
                <div className='bossArea'>
                <Card cardObj={bossDeck[0]} className="boss"/>
                </div>
            </div>
        </div>
    )
}

export default Dungeon
