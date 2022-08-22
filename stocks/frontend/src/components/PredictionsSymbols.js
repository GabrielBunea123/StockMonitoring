import React, { useEffect, useState } from 'react'
import CardPredictions from '../PredictionsComponents/CardPredictions'

const PredictionsSymbols = () => {

    const [companies, setCompanies] = useState([])

    const GetCompanies = () => {
        fetch('/api/get-company-profile')
            .then(res => res.json())
            .then(data => {
                setCompanies(data)
                console.log(data)
            })
            .catch(error => console.error(error))
    }

    useEffect(() => {
        GetCompanies()
    }, [])

    return (
        <div className="container" style={{ marginTop: 30 }}>
            <h4 className="fw-bold pb-4">Avaliable predictions</h4>
            <div className="d-flex flex-wrap justify-content-around">
                {companies.length > 0 && companies.map((item, index) => (
                    <CardPredictions logo={item.logo} ticker={item.ticker} company_name={item.name} />
                ))}
            </div>
        </div>
    )
}

export default PredictionsSymbols