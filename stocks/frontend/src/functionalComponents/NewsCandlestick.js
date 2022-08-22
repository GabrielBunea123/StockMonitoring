import React from 'react'

const NewsCandlestick = ({ news }) => {
    return (
        <div style={{ paddingLeft: 5 }}>
            <hr></hr>
            {news.slice(0, 15).map((item, index) => (
                <a href={item.url} style={{color:'white', textDecoration: 'none'}}>
                    <div style={{ paddingTop: 5, paddingBottom: 5 }}>
                        <h6>{item.headline}</h6>
                        <p className="pt-2">{item.summary.slice(0, 90)}</p>
                        <hr></hr>
                    </div>
                </a>
            ))}
        </div>
    )
}

export default NewsCandlestick