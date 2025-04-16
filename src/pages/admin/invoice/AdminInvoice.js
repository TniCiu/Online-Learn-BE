import { useState } from "react";
import { toast } from "sonner";
import ListInvoice from "../../../component/ListInvoice";
import * as adminService from "../../../api/apiService/adminService";
import { debounce } from "../../../util";

function AdminInvoice() {
    const [modalContent, setModalContent] = useState({
        title: "DELETE",
        description: "Are you sure want to delete?",
        isReject: false,
        handleRemove: (id) => handleRemove(id),
        isOpen: false,
        handleCloseModal: () => {},
    });
    const handleRemove = (deletedId) => {
        toast.promise(adminService.softDeleteInvoice(deletedId), {
            loading: "Removing...",
            success: () => {
                setModalContent({ ...modalContent, isOpen: false });
                return "Remove successfully";
            },
            error: (error) => {
                console.log(error);
                return "Remove failed";
            },
        });
    };
    return (
        <ListInvoice
            searchFunc={adminService.searchInvoice}
            isHistoryDeletedPage={false}
            modalContent={modalContent}
            getTotalDataFunc={adminService.getAllInvoice}
            setModalContent={setModalContent}
        ></ListInvoice>
    );
}

export default AdminInvoice;
