export class GrpFollowSchedule {
    constructor(id, dept, trainProg, group) {
        this.id = id;
        this.dept = dept;
        this.trainProg = trainProg;
        this.group = group;
    }

    getGrpFollowScheduleId() {
        return this.id;
    }

    getDepartment() {
        return this.dept;
    }

    getTrainingProgram() {
        return this.trainProg;
    }

    getGroupName() {
        return this.group;
    }  

    setId(value) {
        this.id = value;
    }

    setDepartment(value) {
        this.dept = value;
    }

    setTrainingProgram(value) {
        this.trainProg = value;
    }

    setGroupName(value) {
        this.group = value;
    }
}