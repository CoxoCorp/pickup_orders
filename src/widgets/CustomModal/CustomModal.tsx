import React, {useState} from 'react';
import Box from "@mui/material/Box";
import {Modal, Typography} from "@mui/material";
interface propsType {
    children: React.ReactNode,
    isOpen: boolean,
    closeModal: ()=>void,
    title?: string,
    width?: number
}
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};


export const CustomModal = (props: propsType) => {
    const {isOpen, closeModal, children, title, width=400} = props;

    return (
        <Modal
            open={isOpen}
            onClose={closeModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{ ...style, width: width }}>
                {
                    title &&
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                }

                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {children}
                </Typography>
            </Box>
        </Modal>
    );
};