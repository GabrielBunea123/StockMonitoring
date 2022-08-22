import React from 'react'

const SearchRecommendations = ({ searchData }) => {
    return (
        <div class="d-flex flex-row-reverse">
            <div class="data-result">
                {searchData.result && searchData.result.map(item => (
                    <>
                        {item.type == "Common Stock" ?
                            <a class="data-item" href={item.type == "Common Stock" ? `/stock-details/${item.symbol}` : "#"}>
                                <div>
                                    <h6>{item.symbol}</h6>
                                    <p>{item.description}</p>
                                </div>
                            </a>
                            : null}
                    </>
                ))}
            </div>
        </div>
    )
}

export default SearchRecommendations