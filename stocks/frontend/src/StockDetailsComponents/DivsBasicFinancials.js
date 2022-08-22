import React from 'react'

const DivsBasicFinancials = ({ name, data }) => {
    return (
        <div>
            <div>
                <p style={{color:"white"}} className="fw-normal">{name}</p>
                <h5 className="mt-0 fw-bold">{data}</h5>
            </div>
            <hr></hr>
        </div>
    )
}

export default DivsBasicFinancials