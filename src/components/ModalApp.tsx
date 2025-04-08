import { Modal, Box } from "@mui/material";
import { useModalStore } from "../store/useModalStore";


export const ModalApp = () => {
    const { isOpen, content, closeModal } = useModalStore();

    return (
        <Modal open={isOpen} onClose={closeModal} >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    borderRadius: 2,
                    minWidth: "500px",
                    maxHeight: "50vh",
                    overflowY: "auto",
                    "&::-webkit-scrollbar": {
                        width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "#141825",
                        borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "#545760",
                        borderRadius: "4px",
                    },
                }}
            >
                {content}
            </Box>
        </Modal>
    );
}
