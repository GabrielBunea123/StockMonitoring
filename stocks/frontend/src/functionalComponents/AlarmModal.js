import React, { useEffect, useState, useRef } from 'react'
import { FormControl, TextField, Alert, AlertTitle } from '@mui/material';


const AlarmModal = ({ indicators, companyProfile, companySymbol, getUserAlerts }) => {

    const [condition, setCondition] = useState('');
    const [trigger, setTrigger] = useState('Crossing')
    const [value, setValue] = useState(0)
    const [checkBoxPopUp, setCheckBoxPopUp] = useState('')
    const [checkBoxEmail, setCheckBoxEmail] = useState('')
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const [avaliableIndicators, setAvaliableIndicators] = useState([])
    const [errorMsg, setErrorMsg] = useState("")
    const [alarmTriggersPrice, setAlarmTriggersPrice] = useState([
        // { name: 'Is equal to', acceptedConditions: ['ticker', 'Volume'] },
        { name: 'Crossing', acceptedConditions: ['ticker', 'Volume'] },
        { name: 'Crossing up', acceptedConditions: ['ticker', 'Volume'] },
        { name: 'Crossing down', acceptedConditions: ['ticker', 'Volume'] },
        { name: 'Greater than', acceptedConditions: ['ticker', 'Volume'] },
        { name: 'Less than', acceptedConditions: ['ticker', 'Volume'] },
    ]) // the triggers are crossing up/down/ greater than/ less than

    const [alarmTriggersSupertrend, setAlarmTriggersSupetrend] = useState([
        { name: 'On direction change', acceptedConditions: ['Supertrend', 'Buy/Sell'] },
    ])

    const bootstrapModalRef = useRef()
    //the accepted conditions are for the specific selected values

    const handleChangeCondition = (event) => {
        setCondition(event.target.value) // "AAPL"(ticker example), Supertrend, Buy/Sell, Volume
    };

    const handleChangeTrigger = (event) => {
        setTrigger(event.target.value)
    };

    const handleValueChange = (event) => {
        setValue(parseFloat(event.target.value))
    }

    const handleCheckboxClick = (event) => {
        // for pop up
        if (event.target.id === 'pop-up' && event.target.checked) {
            setCheckBoxPopUp(event.target.id)
        }
        else if (event.target.id === 'pop-up' && event.target.checked === false) {
            setCheckBoxPopUp('')
        }
        // for email
        if (event.target.id === 'email' && event.target.checked) {
            setCheckBoxEmail(event.target.id)
        }
        else if (event.target.id === 'email' && event.target.checked === false) {
            setCheckBoxEmail('')
        }
    }

    const handleNameChange = (event) => {
        setName(event.target.value)
    }

    const handleMessageChange = (event) => {
        setMessage(event.target.value)
    }

    const CreateAlert = () => {
        var authToken = localStorage.getItem('tokenAuth')
        if (name.length == 0 || !name || message.length == 0 || !message) {
            setErrorMsg("The alert name and message must be provided")
        }
        else {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `${authToken}` },
                body: JSON.stringify({
                    condition: condition,
                    symbol: companySymbol,
                    trigger: trigger,
                    value: value,
                    notificationType: checkBoxPopUp + '|' + checkBoxEmail,
                    name: name,
                    message: message,
                    isActive: true
                })
            }
            fetch("/api/create-alert", requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    getUserAlerts()
                    setErrorMsg('')
                })
                .catch(err => console.error(err))
        }
    }

    useEffect(() => {
        setAvaliableIndicators(indicators)
        setCondition(companyProfile.ticker)

    }, [companyProfile])

    useEffect(() => {
        const checkExisting = avaliableIndicators.filter(item => item.name == companyProfile.ticker)// add the stock to the alarm props
        if (checkExisting.length == 0)
            setAvaliableIndicators(prev => [
                {
                    name: companyProfile.ticker,
                    value: true
                },
                ...prev])
    }, [avaliableIndicators])

    useEffect(() => {
        bootstrapModalRef.current.addEventListener('hidden.bs.modal', function (event) {
            setErrorMsg('')
        });
    }, [])


    return (
        <div class="modal fade" ref={bootstrapModalRef} id="alarmModal" tabindex="-1" aria-labelledby="alarmModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content modal-content-bg">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Create new alert</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-4">
                                Conditions
                            </div>
                            <div class="col-8">
                                <div>
                                    <SelectAlarm alarmProps={avaliableIndicators} handleChange={handleChangeCondition} />
                                </div>
                                <div className="mt-3">
                                    <SelectAlarm alarmProps={condition == "Supertrend" || condition == 'Buy/Sell' ? alarmTriggersSupertrend : alarmTriggersPrice} handleChange={handleChangeTrigger} />
                                </div>
                                <div className="mt-3">
                                    {condition == "Supertrend" || condition == 'Buy/Sell' ? null :
                                        <FormControl fullWidth>
                                            <TextField
                                                onChange={handleValueChange}
                                                size="small"
                                                type="number"
                                                label="Value"
                                                variant="outlined"
                                            />
                                        </FormControl>
                                    }
                                </div>
                            </div>
                        </div>
                        <div class="row pt-5">
                            <div class="col-4">
                                Notification type
                            </div>
                            <div class="col-8">
                                <div class="form-check pb-2">
                                    <input onClick={handleCheckboxClick} class="form-check-input" type="checkbox" id="pop-up"></input>
                                    <label class="form-check-label" for="flexCheckDefault">
                                        Show pop-up alert
                                    </label>
                                    {/* handle here for a default value */}
                                </div>
                                {/* <div class="form-check pt-2 pb-2">
                                    <input onClick={handleCheckboxClick} class="form-check-input" type="checkbox" id="email"></input>
                                    <label class="form-check-label" for="flexCheckDefault">
                                        Send email
                                    </label>
                                </div> */}
                            </div>
                        </div>
                        <div class="row pt-4">
                            <div class="col-4">
                                Name
                            </div>
                            <div class="col-8">
                                <div>
                                    <FormControl fullWidth>
                                        <TextField onChange={handleNameChange} size="small" id="outlined-basic" label="Alert name" variant="outlined" />
                                    </FormControl>
                                </div>
                            </div>
                        </div>
                        <div class="row pt-4">
                            <div class="col-4">
                                Message
                            </div>
                            <div class="col-8">
                                <div>
                                    <FormControl fullWidth>
                                        <TextField onChange={handleMessageChange} id="outlined-multiline-static" label="Alert message" multiline rows={4} defaultValue="" />
                                    </FormControl>
                                </div>
                            </div>
                        </div>
                        {errorMsg.length > 0 &&
                            <Alert className="mt-3" severity="error">
                                <AlertTitle>Error</AlertTitle>
                                {errorMsg}
                            </Alert>
                        }
                    </div>
                    <div class="modal-footer">
                        <button onClick={() => { CreateAlert() }} data-bs-dismiss="modal" aria-label="Close" type="button" class="btn fw-bold" style={{ backgroundColor: "#0D90FF", color: "#E4F0FF" }}>Create alert</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const SelectAlarm = ({ alarmProps, handleChange }) => {
    return (
        <select class="form-select" aria-label="Default select example" onChange={handleChange}>
            {alarmProps.map(item => (
                <>
                    {item.name != "Supertrend" && item.name != 'Buy/Sell' ?
                        <option className="select-options" value={item.name}>{item.name}</option>
                        : null}
                </>
            ))}
        </select>
    )
}



export default AlarmModal