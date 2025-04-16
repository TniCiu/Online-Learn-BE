import React, { useEffect, useState } from "react"; // This imports the useState hook
import { useParams } from "react-router-dom";
import InstructorEditCourse from "../../../instructor/course/Edit";
import InstructorCreateCourse from "../../../instructor/course/Create";

function AdminDetailCourse() {
    const id = useParams().id;
    return (
        <InstructorCreateCourse
            adminView={true}
            isEdit
            courseId={id}
        ></InstructorCreateCourse>
    );
}

export default AdminDetailCourse;
