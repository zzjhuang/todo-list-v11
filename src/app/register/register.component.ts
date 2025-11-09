import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit {
  // 定義 username、password 和 confirmPassword，型別為字串string為空字串,並定義一個 userlist 陣列來存放使用者物件
  username: string = ''; //帳號
  password: string = ''; //密碼
  confirmPassword: string = ''; //確認密碼
  userlist: { username: string; password: string }[] = [];
  //將 Angular 的 Router 服務注入到這個元件中，並儲存為一個私有的 router 屬性，
  constructor(private router: Router) {}
  //在元件初始化後執行loadUsers方法 //只執行一次
  ngOnInit(): void {
    this.loadUsers();
  }
  //定義一個方法為loadUsers 用來驗證使用者是否已經註冊過
  loadUsers(): void {
    //宣告 storedUsers 從localStorage中取得registeredUsers的字串(如果沒有回傳null)
    const storedUsers = localStorage.getItem('registeredUsers');
    //若storedUsers有值，將其轉換為物件陣列並賦值給 userlist，所以userlist=所有已註冊的使用者資訊
    if (storedUsers) {
      this.userlist = JSON.parse(storedUsers);
      console.log('載入已註冊使用者:', this.userlist);
    }
  }

  //定義一個方法passwordMismatch 只會回傳布林值，用來檢查密碼是否一致
  passwordMismatch(): boolean {
    return this.password !== this.confirmPassword;
  }
  //註冊功能
  //定義了一個onRegister方法，如果輸入的userlist陣列中已經有相同的username，則跳出提示
  onRegister(): void {
    console.log('Registering user:', this.username);
    console.log('Registering user:', this.password);
    if (this.userlist.find((user) => user.username === this.username)) {
      alert('此帳號已被註冊，請更換帳號');
    }

    //如果輸入的帳密與userlist陣列中沒有重複，則宣告一個newuser物件放使用者輸入的帳密，並將newuser物件加入userlist陣列中
    else {
      const newUser = { username: this.username!, password: this.password! }; //非空斷言操作符
      this.userlist.push(newUser);
      //最後將更新後的userlist陣列轉換成字串存回localStorage中
      localStorage.setItem('registeredUsers', JSON.stringify(this.userlist));
      console.log('檢查一下有沒有存入新使用者:', this.userlist);
      alert('註冊成功，請返回登入頁面');

      //跳轉到登入頁面
      this.router.navigate(['/login']);
    }
    //清空表單
    this.username = ' ';
    this.password = ' ';
    this.confirmPassword = ' ';
  }
}
