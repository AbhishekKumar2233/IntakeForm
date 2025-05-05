import React from 'react'
import { Card } from 'react-bootstrap'

const IncapacitatedList = () => {

    const cardDetails = [
        {
            header: 'One',
            title: "Dark Card Title",
            description: "Some quick example text to build on the card title and make up the bulk of the card's content."
        },
        {
            header: 'One',
            title: "Dark Card Title",
            description: "Some quick example text to build on the card title and make up the bulk of the card's content."
        },
        {
            header: 'One',
            title: "Dark Card Title",
            description: "Some quick example text to build on the card title and make up the bulk of the card's content."
        }
        , {
            header: 'One',
            title: "Dark Card Title",
            description: "Some quick example text to build on the card title and make up the bulk of the card's content."
        },
        {
            header: 'One',
            title: "Dark Card Title",
            description: "Some quick example text to build on the card title and make up the bulk of the card's content."
        }
    ]

    const cardRenderFun = (index) => {
        return <>
            <Card bg='gray' key='dark' text='black' style={{ width: '25rem', flex: '0 0 auto' }} className={`${(index==0) ? "ms-1":"ms-4"} mb-2`} >
                <Card.Header>Header{index}</Card.Header>
                <Card.Body>
                    <Card.Title>Dark Card Title</Card.Title>
                    <Card.Text>Some quick example text to build on the card title and make up the bulk of the card's content.</Card.Text>
                </Card.Body>
            </Card>
        </>
    }
    return (
        <>
            <div className='d-flex justify-content-start ' style={{ overflowX: 'auto' }}>
                {cardDetails.map((item, index) => {
                    return cardRenderFun(index)
                })}
            </div>
        </>
    )
}

export default IncapacitatedList