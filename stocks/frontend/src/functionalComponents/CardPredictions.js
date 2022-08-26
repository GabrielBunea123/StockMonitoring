import React from 'react'

const CardPredictions = ({ logo, ticker, company_name }) => {
    return (
        <a href={`/stock-prediction/${ticker}`} className="predictions-card">
            <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                    <img src={logo} alt="..." className='img-stock-predictions' />
                </div>
                <div class="flex-grow-1 ms-3">
                    <h6>{ticker}</h6>
                    <div>{company_name}</div>
                </div>
            </div >
        </a>
    )
}

export default CardPredictions