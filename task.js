class Task {
    constructor(id,name,desc,date,color,url){
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.date= date;
        this.name = name;
        this.color = color;
        this.url = url;
        this.isMarked = false; //not red record /not ready for delete

    }
    toggle(){
        this.isMarked = !this.isMarked; //true change into false
    }

}
export default Task;