Page({
  // pages/index/index.js
  data: {
    url: "https://api-nodejs-todolist.herokuapp.com/task",
    headers: {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmQ5NDQ5NjNmYjA4MDAwMTc3NzUwYjAiLCJpYXQiOjE2NTg0MDYwMzh9.OCYfRBQ3aSZlVRw2qYoVFgGYmwXA46CKJATgfRZl7Qk",
      "Content-Type": "application/json",
    },
    todos: [],
  },
  add(e) {
    this.setData({
      count: this.data.count + 1,
    });
  },
  onAddToDo() {
    this.addTodo("NULL");
  },
  onTodoChanged(e) {
    console.log(e);
    const id = e.target.dataset.id;

    this.data.todos.forEach((ele) => {
      if (ele._id == id) {
        ele.completed = !ele.completed;
        this.updateTodo({...ele, description: ele.description ? ele.description: "NULL"});
      }
    });
    this.setData({
      ...this.data,
      todos: this.data.todos,
    });
  },
  onToDoFocus(e) {
    const id = e.target.dataset.id;
    this.data.todos.forEach((ele) => {
      if (ele.id == id) ele.onFocus = true;
      else ele.onFocus = false;
    });

    this.setData({
      ...this.data,
      todos: this.data.todos,
    });
  },
  onToDoBlur(e) {
    console.log(e);
    const id = e.target.dataset.id;
    this.data.todos.forEach((ele) => {
      if (ele._id == id) {
        ele.description = e.detail.value;
        if (e.detail.value == "") ele.description = "NULL";
        this.updateTodo(ele) ; 
        ele.description = e.detail.value;
      }
    });
    this.setData({
      ...this.data,
      todos: this.data.todos,
    });
  },
  onDelete(e) {
    const id = e.target.dataset.id;
    this.deleteTodo(id) ; 
    const newData = this.data.todos.filter((ele) => ele._id !== id);
    console.log(newData);
    this.setData({
      ...this.data,
      todos: newData,
    });
  },
  getToDos() {
    my.request({
      url: this.data.url,
      headers: this.data.headers,
      success: (response) => {
        console.log(response);
        response.data.forEach(ele => {
          if (ele.description === 'NULL') ele.description = "";
        })
        this.setData({
          ...this.data,
          todos: response.data,
        });
        console.log(this.data.count);
      },
      fail: (response) => {
        console.log("Fail");
      },
    });
  },
  updateTodo(todo) {
    console.log(todo);
    my.request({
      url: this.data.url + "/" + todo._id,
      headers: this.data.headers,
      method: "PUT",
      data: {
        description: todo.description,
        completed: todo.completed,
      },
      success: (response) => {
        console.log(response);
      },
    });
  },
  deleteTodo(id) {
    my.request({
      url: this.data.url + '/' + id ,
      headers: this.data.headers,
      method: "DELETE"
    })
  },
  addTodo(description){
    my.request({
      url : this.data.url,
      method: "POST",
      headers: this.data.headers,
      data: {
        description,
      },
      success: (response) => {
        response.data.description = "";
        this.data.todos.push(response.data);
        this.setData({
          ...this.data, 
        })
      },
    });
  },
  onLoad(query) {
    this.getToDos();
  },
  onReady() {},
  onShow() {},
  onHide() {},
  onUnload() {},
});
