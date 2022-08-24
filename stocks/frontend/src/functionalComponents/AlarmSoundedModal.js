import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};



const AlarmSoundedModal = ({alarmSoundedProps, alertSounded, handleAlertSoundedClose}) => {
    return (
        <div>
            <Modal
                open={alertSounded}
                onClose={handleAlertSoundedClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Alert on {alarmSoundedProps.symbol}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {alarmSoundedProps.condition} {alarmSoundedProps.trigger} {alarmSoundedProps.value}
                    </Typography>
                </Box>
            </Modal>
        </div>
    )
}

export default AlarmSoundedModal