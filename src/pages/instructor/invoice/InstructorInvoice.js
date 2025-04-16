import { toast } from "sonner";
import ListInvoice from "../../../component/ListInvoice";
import * as instructorService from "../../../api/apiService/instructorService";
import { useState } from "react";
function InstructorInvoice() {
    const [modalContent, setModalContent] = useState({
        title: "DELETE",
        description: "Are you sure want to delete?",
        isReject: false,
        handleRemove: (id) => handleRemoveInvoice(id),
        isOpen: false,
        handleCloseModal: () => {},
    });

    const handleRemoveInvoice = (deletedId) => {
        toast.promise(instructorService.softDeleteInvoice(deletedId), {
            loading: "Removing...",
            success: () => {
                setModalContent({ ...modalContent, isOpen: false });
                return "Remove successfully";
            },
            error: (error) => {
                return error.content;
            },
        });
    };

    return (
        <ListInvoice
            searchFunc={instructorService.searchInvoice}
            isHistoryDeletedPage={false}
            modalContent={modalContent}
            getTotalDataFunc={instructorService.getInvoices}
            setModalContent={setModalContent}
        ></ListInvoice>
    );
}

export default InstructorInvoice;
