
import React from 'react'
import { useDispatch } from 'react-redux'
import { selectCard } from '../../actions/miscActions'

function Card({cardObj, className}) {

  const dispatch = useDispatch()

  return (
    <>
      <img id={cardObj.id} src={cardObj.image} className={className} onClick={()=>dispatch(selectCard(cardObj, className, cardObj.id))}/>
      <div></div>
    </>
  )
}

export default Card
