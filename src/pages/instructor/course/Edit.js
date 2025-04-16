import { useParams } from "react-router-dom";
import InstructorCreateCourse from "./Create";

function InstructorEditCourse() {
    const { id } = useParams();
    return (
        <InstructorCreateCourse
            adminView={false}
            isEdit
            courseId={id}
        ></InstructorCreateCourse>
    );
}

export default InstructorEditCourse;
