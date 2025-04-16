import { toast } from "sonner";
import ListInvoice from "../../../component/ListInvoice";
import * as instructorService from "../../../api/apiService/instructorService";
import { _setModelData } from "ckeditor5";
import { useState } from "react";

function InstructorHistoryDeleted() {
    const [modalContent, setModalContent] = useState({
        title: "RESTORE",
        description: "Are you sure want to restore?",
        isReject: false,
        handleRemove: (id) => handleRestoreInvoice(id),
        isOpen: false,
        handleCloseModal: () => {},
    });

    const handleRestoreInvoice = (deletedId) => {
        toast.promise(instructorService.restoreInvoieById(deletedId), {
            loading: "Restoring...",
            success: () => {
                setModalContent({ ...modalContent, isOpen: false });
                return "Restore successfully";
            },
            error: (error) => {
                console.log(error);
                return "Restore failed";
            },
        });
    };
    return (
        <ListInvoice
            searchFunc={instructorService.searchDeletedInvoice}
            isHistoryDeletedPage={true}
            modalContent={modalContent}
            getTotalDataFunc={instructorService.getDeletedInvoices}
            setModalContent={setModalContent}
        ></ListInvoice>
    );
}

export default InstructorHistoryDeleted;
