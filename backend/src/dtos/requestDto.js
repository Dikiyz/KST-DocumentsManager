export default class RequestDto {
    id;
    user_id;
    student_name;
    doc_type_id;
    is_allow;
    timestamp;

    constructor({ id, user_id, student_name, doc_type_id, is_allow, timestamp }) {
        this.id = id;
        this.user_id = user_id;
        this.student_name = student_name;
        this.doc_type_id = doc_type_id;
        this.is_allow = is_allow;
        this.timestamp = timestamp;
    }
};