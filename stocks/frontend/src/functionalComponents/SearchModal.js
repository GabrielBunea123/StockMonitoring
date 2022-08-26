import React, { useEffect, useRef, useState } from 'react'
import { TextField } from "@mui/material"
import InputAdornment from '@mui/material/InputAdornment';

const SearchModal = ({ }) => {
    const [filterSymbols, setFilterSymbols] = useState([])

    const bootstrapModalRef = useRef()


    const handleSearchChange = (e) => {
        if (e.target.value.length > 0)
            setTimeout(() => {
                filterStocks(e.target.value)
            }, 1000)
        else {
            setFilterSymbols([])
        }
    }

    const filterStocks = (quote) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                quote: quote
            })
        }
        fetch("/api/filter-all-companies-ticker", requestOptions)
            .then(res => res.json())
            .then(data => {
                setFilterSymbols(data)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        if (bootstrapModalRef && bootstrapModalRef.current)//when the modal is closed make the array emty so the candlestick doesn't have lag
            bootstrapModalRef.current.addEventListener('hidden.bs.modal', function (event) {
                setFilterSymbols([])
            });
    }, [])


    return (
        <div class="modal fade" ref={bootstrapModalRef} id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content modal-content-bg">
                    <div class="modal-body">
                        <TextField
                            variant="outlined"
                            margin="dense"
                            className="w-100"
                            label="Search quote"
                            placeholder='Search'
                            onChange={handleSearchChange}
                            autoComplete='off'
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <i class="fa-solid fa-magnifying-glass"></i>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <div className="pt-2">
                            <div>
                                <div class="data-result">
                                    {filterSymbols.length > 0 && filterSymbols.map(item => (
                                        <a class="data-item" href={window.location.href.slice(21, 28) == "/chart/" ? `/chart/${item.quote}` : `/stock-details/${item.quote}`}>
                                            <div>
                                                <h6>{item.quote}</h6>
                                                <p>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchModal
