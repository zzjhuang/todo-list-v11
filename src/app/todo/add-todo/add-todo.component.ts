import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { TodoItem } from '../todo.component'; //從父元件todo.component引入介面

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
})
export class AddTodoComponent implements OnInit {
  //toISOString返回一个 ISO格式的字符串： YYYY-MM-DDTHH，split 分割字串為 YYYY-MM-DD/HH
  today = new Date().toISOString().split('T')[0]; //今天日期 系統自動產生，格式YYYY-MM-DD
  todoTitle: string = ''; //標題 *
  todoDueDate: Date = new Date(); //截止日期
  categories: string[] = ['工作', '娛樂', '生活']; //分類選項
  todoCategory: string = '請選擇分類'; //分類
  todoDescription: string = ''; //描述
  todoPriority: string = 'normal'; //優先級 預設normal
  todoSetupTime: Date = new Date(); //表單建立時間 系統自動產生
  todoDone: boolean = false; //是否完成 預設false

  // 宣告一個輸出事件modalClose 給父層
  // EventEmitter<void>：表示這個物件是一個事件發射器，且在發射時不帶任何資料 (void)。
  @Output() modalClose = new EventEmitter<void>();
  constructor() {}
  //接收從父元件傳來的todoitem資料，預設為空值
  @Input() todoToEdit: TodoItem | null = null;
  ngOnInit(): void {}
  ngOnChanges(): void {
    //當修改模式時(有收到來自父元件的todoitem) 代入欲修改的資料到form中
    if (this.todoToEdit) {
      this.todoTitle = this.todoToEdit.title;
      this.todoDueDate = this.todoToEdit.dueDate;
      this.todoCategory = this.todoToEdit.category;
      this.todoDescription = this.todoToEdit.description;
      this.todoPriority = this.todoToEdit.priority;
      this.todoDone = this.todoToEdit.done;
    }
  }

  // 提交表單 與儲存資料在localstorage
  onSubmit(): void {
    //若標題、截止日期、分類欄位其中有未填寫的，跳出提示並結束函式
    if (
      this.todoTitle.trim() === '' ||
      this.todoDueDate === null ||
      this.todoCategory === '請選擇分類'
    ) {
      alert('請完整填寫標題、截止日期及分類欄位');
      return;
    }
    //宣告currentUser變數，從localstorage取得username， 且用!非空斷言操作符，確保不為null
    const currentUser = localStorage.getItem('username')!;
    // 宣告todoItem物件，符合TodoItem介面
    const todoItem: TodoItem = {
      title: this.todoTitle,
      dueDate: this.todoDueDate,
      category: this.todoCategory,
      description: this.todoDescription,
      priority: this.todoPriority,
      setupTime: this.todoSetupTime,
      done: this.todoDone,
      id: Date.now(),
    };

    // 宣告allTodoData變數，從localstorage取得'todoData'字串
    const allTodoData = localStorage.getItem('todoData');
    // 宣告todoData物件，鍵為字串(用戶名):TodoItem陣列
    let todoData: { [username: string]: TodoItem[] } = {};
    //如果alltodoData 有值，將allTodoData從json字串轉回物件，並賦值給todoData
    if (allTodoData) {
      todoData = JSON.parse(allTodoData);
    }

    // 如果當前用戶還沒有待辦事項陣列，建立一個 用戶名為key，值為空的陣列
    if (!todoData[currentUser]) {
      todoData[currentUser] = [];
    }

    // 如果有從父元件中取得todoToEdit(有值)
    if (this.todoToEdit) {
      // 編輯模式
      //findIndex() 尋找符合條件的陣列索引位置，這邊用ID比對找到該比欲修改的資料
      const index = todoData[currentUser].findIndex(
        (item) => item.id === this.todoToEdit!.id
      );
      //-1代表沒找到相同ID 不等於-1 代表有找到，這時候更新原有資料
      if (index !== -1) {
        todoData[currentUser][index] = todoItem;
      }
    } else {
      // 新增模式：將新待辦事項加入當前用戶的陣列
      todoData[currentUser].push(todoItem);
    }

    // 將todoData物件轉回json字串，並存入localstorage的'todoData'鍵中
    localStorage.setItem('todoData', JSON.stringify(todoData));

    console.log('存入tododata', JSON.stringify(todoItem));
    console.log(`${currentUser} 的待辦事項:`, todoData[currentUser]);

    console.log('待辦事項已新增！關閉燈箱');
    this.onClose(); //呼叫關閉燈箱方法
  }

  // 關閉燈箱
  onClose(): void {
    console.log('通知父層去關閉燈箱');
    //發送一個名為 modalClose 的事件（訊號）給父元件，父元件中有事件綁定監聽，會接收到這個事件並執行綁定好的方法
    this.modalClose.emit();
  }
}
