export class Index {
    todos = [
        {title: '编号 001', done: false},
        {title: '编号 002', done: false},
        {title: '编号 003', done: false},
        {title: '编号 004', done: false},
        {title: '编号 005', done: false},
        {title: '编号 006', done: false}
    ];

    remove(todo) {
        let index = this.todos.indexOf(todo);
        if (index > -1) {
            this.todos.splice(index, 1)
        }
    }
}