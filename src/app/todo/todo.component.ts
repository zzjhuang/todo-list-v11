import { Component, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// 定義待辦事項的介面  ((介面:定義物件的結構)) 並導出
export interface TodoItem {
  id: number;
  title: string;
  dueDate: Date;
  category: string;
  description: string;
  priority: string;
  setupTime: Date;
  done: boolean;
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
})
export class TodoComponent implements OnInit {
  //定義各型別
  username: string = ''; //由router取得的 使用者名稱
  today: Date = new Date(); //今日日期..用於直接渲染在畫面上
  isModalOpen: boolean = false; // 燈箱開啟的狀態 預設為關
  allTodoItem: TodoItem[] = []; //建立一個空陣列用於存放所有待辦
  activeTab: string = 'pending'; // 預設顯示未完成頁籤
  todoToEdit: TodoItem | null = null; // 儲存要編輯的待辦事項
  filterType: string = ''; //篩選器
  selectedCategory: string = ''; //分類篩選 (儲存用戶選擇的篩選方式)
  selectedPriority: string = ''; //優先度篩選
  sortType: string = ''; //排序依據 建立日/截止日/優先度
  sortOrder: string = 'asc'; //排序方式  預設升序

  //private 只能在此元件使用
  //注入 ActivatedRoute 服務。這個服務用於讀取當前路由的資訊
  //注入 Router 服務。這個服務用於導航到不同的路由
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // console.log('預設燈箱關閉');
    // .params發出（emit）當前路由中包含的參數物件(取得路由參數中的 username)
    this.route.params.subscribe((params) => {
      //subscribe()  訂閱 observable 取得參數
      // 當參數改變時會觸發回調函式//只有在呼叫 subscribe() 之後，Observable 才會真正開始執行
      // Observable 是一種用於處理非同步資料流的設計模式
      this.username = params['username'];
      if (!this.username) {
        return;
      }
      console.log('從路由取得用戶名:', this.username);
      // 確保 localStorage 中有當前用戶資訊
      localStorage.setItem('username', this.username);

      //取得用戶的代辦清單
      this.loadLatestTodo();
    });
  }

  //登入
  login() {
    this.router.navigate(['/login']);
  }
  // 登出功能
  //還需要修改  <-----改成禁用上一頁
  logout(): void {
    localStorage.removeItem('username');
    this.username = ' '; // 清空當前用戶名
    this.allTodoItem = []; // 清空待辦事項
    this.router.navigate(['/todo']);
    console.log(
      'username:',
      localStorage.getItem('username'),
      '確認一下有沒有刪'
    );
  }

  //優先度轉換成number 用於排序
  //定義一個方法 getPriorityValue 參數型別為字串，回傳值為number
  private getPriorityValue(priority: string): number {
    const priorityMap: { [key: string]: number } = {
      low: 1,
      normal: 2,
      high: 3,
    };
    return priorityMap[priority];
  }
  //套用排序
  private applySorting(todos: TodoItem[]): TodoItem[] {
    if (!this.sortType) return todos;
    //[...todos]展開運算符 複製todos陣列並用sort排序
    // a 和 b 是陣列中的兩個元素 回傳值決定排序順序：
    // < 0 : a 排在 b 前面
    // = 0 : a 和 b 順序不變
    // > 0 : a 排在 b 後面
    return [...todos].sort((a, b) => {
      //宣告一個變數作為存放a-b的值
      let comparison = 0;
      //排序依據:截止日期
      if (this.sortType === 'dueDate') {
        const dueDateA = new Date(a.dueDate).getTime();
        const dueDateB = new Date(b.dueDate).getTime();
        comparison = dueDateA - dueDateB;
      }
      //排序依據:優先度
      else if (this.sortType === 'priority') {
        const priorityA = this.getPriorityValue(a.priority);
        const priorityB = this.getPriorityValue(b.priority);
        comparison = priorityA - priorityB;
      }
      //其他 ((預設依據發表日期))
      else {
        const setupTimeA = new Date(a.setupTime).getTime();
        const setupTimeB = new Date(b.setupTime).getTime();
        comparison = setupTimeA - setupTimeB;
      }
      //回傳值(comparison) 當sortorder(排序方式)是desc(降序)時將comparison冠上負值
      return this.sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  //載入待辦事項
  loadLatestTodo(): void {
    const allTodoData = localStorage.getItem('todoData');

    if (allTodoData) {
      const parsedData = JSON.parse(allTodoData);
      console.log('所有待辦事項資料:', parsedData);

      this.allTodoItem = parsedData[this.username!] || [];

      if (this.allTodoItem.length === 0) {
        console.log(`用戶 ${this.username} 尚無待辦事項`);
      }
    } else {
      // 沒有資料時清空陣列 防止切換用戶時看到別人的資料
      this.allTodoItem = [];
      console.log('localStorage 中無待辦事項資料');
    }

    console.log(`${this.username} 的待辦事項:`, this.allTodoItem);
  }

  // 取得未完成的待辦事項
  getPendingTodos(): TodoItem[] {
    if (!this.allTodoItem) {
      return [];
    }
    //宣告一個filteredTods  值為經filter()篩選的待辦事項陣列，篩選條件為!item.done
    let filteredTodos = this.allTodoItem.filter((item) => !item.done);

    // 根據篩選類型進行篩選
    //如果是分類篩選器且有選值
    if (this.filterType === 'category' && this.selectedCategory) {
      //重新給filteredTodos賦值，篩選出與篩選器同樣的分類
      filteredTodos = filteredTodos.filter(
        (item) => item.category === this.selectedCategory
      );
    } else if (
      //如果是優先度篩選器且有選值
      this.filterType === 'priority' &&
      this.selectedPriority
    ) {
      //篩選出與篩選器同樣的分類
      filteredTodos = filteredTodos.filter(
        (item) => item.priority === this.selectedPriority
      );
    }
    //最後回傳套用排序的被篩選後代辦事項陣列
    return this.applySorting(filteredTodos);
  }
  // 取得已完成的待辦事項
  getCompletedTodos(): TodoItem[] {
    if (!this.allTodoItem) {
      return [];
    }

    let filteredTodos = this.allTodoItem.filter((item) => item.done);

    // 根據篩選類型進行篩選
    if (this.filterType === 'category' && this.selectedCategory) {
      filteredTodos = filteredTodos.filter(
        (item) => item.category === this.selectedCategory
      );
    }

    if (this.filterType === 'priority' && this.selectedPriority) {
      filteredTodos = filteredTodos.filter(
        (item) => item.priority === this.selectedPriority
      );
    }
    //最後回傳套用排序的被篩選後代辦事項陣列

    return this.applySorting(filteredTodos);
  }

  // 新增待辦事項
  addTodo(): void {
    if (!this.username) {
      alert('請先登入以新增待辦事項');
      this.router.navigate(['/login']);
      return;
    }
    if (this.isModalOpen) {
      this.closeModal();
      return;
    }
    this.todoToEdit = null; // 清空編輯資料，避免錯誤
    this.isModalOpen = true;
    console.log('打開燈箱');
  }

  //刪除待辦事項
  removeTodo(item: TodoItem): void {
    console.log('嘗試刪除待辦事項:', item);

    //confirm 彈出確認對話框 確認傳回true 取消返回false
    if (confirm(`確認刪除待辦事項: ${item.title}?`)) {
      //findIndex() 找第一個符合條件的元素索引位置  //找不到回傳-1
      const index = this.allTodoItem.findIndex((todo) => todo === item);
      if (index !== -1) {
        this.allTodoItem.splice(index, 1);
        console.log('待辦事項已刪除:', item);
        //還需刪除localstorage中的資料
        this.updateTodoInStorage();
      }
    }
  }
  //修改待辦事項
  updateTodo(item: TodoItem): void {
    console.log('修改待辦事項:', item);
    this.todoToEdit = item; // 設定要編輯的待辦事項
    this.isModalOpen = true; // 打開燈箱
    //開啟燈箱後帶todoToEdit進去燈箱元件
  }

  //更新 localStorage 中的待辦事項資料
  updateTodoInStorage(): void {
    const allTodoData = localStorage.getItem('todoData');
    let todoData: { [username: string]: TodoItem[] } = {};

    if (allTodoData) {
      todoData = JSON.parse(allTodoData);
    }
    // 更新當前用戶的待辦事項陣列
    todoData[this.username!] = this.allTodoItem;
    //存回 localStorage
    localStorage.setItem('todoData', JSON.stringify(todoData));
    console.log('已更新 localStorage 中的待辦事項');
  }

  // 完成待辦事項(切換完成狀態)
  toggleTodoDone(item: TodoItem): void {
    item.done = !item.done;
    this.updateTodoInStorage();

    console.log(
      `待辦事項 "${item.title}" 狀態已更新為:`,
      item.done ? '已完成' : '未完成'
    );
  }

  // 關閉燈箱
  closeModal(): void {
    this.isModalOpen = false; // 只有父層才能修改這個狀態
    console.log('父層監聽到關閉事件，燈箱狀態設為:', this.isModalOpen);
    this.todoToEdit = null; // 清空編輯資料
    this.loadLatestTodo(); //再次載入待辦清單
  }
}
