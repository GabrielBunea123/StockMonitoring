import React from 'react'


const IndicatorsModal = ({ avaliableIndicators, setAvaliableIndicators }) => {

    const handleCheckboxClick = (item, index) => {
        let newState = [...avaliableIndicators]
        newState[index].value = !newState[index].value
        setAvaliableIndicators(newState)
    }


    return (
        <div class="modal fade" id="indicatorsModal" role="dialog" data-keyboard="false" data-backdrop="static" aria-labelledby="indicatorsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content modal-content-bg">
                    <div class="modal-header">
                        <h4 >Avaliable indicators</h4>
                    </div>
                    <div class="modal-body">
                        {avaliableIndicators.length > 0 && avaliableIndicators.map((item, index) => (
                            <div class="form-check pt-2 pb-2">
                                <input onClick={() => { handleCheckboxClick(item, index) }} class="form-check-input" checked={item.value} type="checkbox" id={index}></input>
                                <label class="form-check-label" for="flexCheckDefault">
                                    {item.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IndicatorsModal