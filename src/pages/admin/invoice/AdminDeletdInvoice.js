import { useState } from "react";
import { toast } from "sonner";
import ListInvoice from "../../../component/ListInvoice";
import * as adminService from "../../../api/apiService/adminService";
import { debounce } from "../../../util";

function AdminDeletedInvoice() {
    const [modalContent, setModalContent] = useState({
        title: "RESTORE",
        description: "Are you sure want to restore?",
        isReject: false,
        handleRemove: (id) => handleRestoreInvoice(id),
        isOpen: false,
        handleCloseModal: () => {},
    });


    const handleRestoreInvoice = (deletedId) => {
        toast.promise(adminService.restoreInvoieById(deletedId), {
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
            searchFunc={adminService.searchDeletedInvoice}
            isHistoryDeletedPage={true}
            modalContent={modalContent}
            getTotalDataFunc={adminService.getAllInvoiceDeleted}
            setModalContent={setModalContent}
        ></ListInvoice>
    );
}

export default AdminDeletedInvoice;
