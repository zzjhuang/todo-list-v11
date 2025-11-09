import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
//定義了2個屬性 username 和 password，型別為字串string為空字串
export class LoginComponent implements OnInit {
  username: string = ''; //帳號
  password: string = ''; //密碼

  // 預設一筆帳密資料之後存到localStorage
  // private 屬性 讓此object只能在宣告的class中使用(html不行)

  private defaultCredentials = [
    {
      username: 'lilyhuang',
      password: '123456',
    },
    {
      username: 'admin',
      password: '000',
    },
  ];

  //將 Angular 的 Router 服務注入到這個元件中，並儲存為一個私有的 router 屬性，
  // 以便在元件的其他方法中（例如 login() 成功後）調用其導航功能。"
  constructor(private router: Router) {}

  ngOnInit(): void {
    // 在元件初始化後執行 //只執行一次
    this.user();
  }
  // 定義了一個名為 user 的函式。void 表示這個函式不需要返回任何值
  user(): void {
    //從localstorage中取得registeredUsers 並宣告為stored
    const stored = localStorage.getItem('registeredUsers');
    //如果stored為空值(registeredUsers不存在)
    if (stored == null) {
      //設置defaultCredentials物件到localStorage的registeredUsers中，並存為字串
      localStorage.setItem(
        'registeredUsers',
        JSON.stringify(this.defaultCredentials)
      );
      console.log('存入userdata', JSON.stringify(this.defaultCredentials));
    } else {
      console.log('已有userdata', stored);
    }
  }
  //登入功能
  //定義了一個onLogin方法
  onLogin(): void {
    // 如果username或password為空字串則回傳true並跳出提示
    //空字串、null、undefined、0、NaN都會被視為false
    // 但因為加上!否定 所以以上會變成true
    if (!this.username || !this.password) {
      alert('請填寫帳號和密碼！');
      return; //結束函式
    }
    //從localStorage中取得registeredUsers的字串(如果沒有回傳null)並宣告為storedString
    const storedString = localStorage.getItem('registeredUsers');
    // console.log('這是storedstring:', storedString);
    //如果storedstring 有值(不為null)，將storedString 轉換為物件陣列並宣告成storedCredentials，每個物件中包含:username和password (型別為String
    if (storedString !== null) {
      const storedCredentials: { username: string; password: string }[] =
        JSON.parse(storedString);
      //find() 方法會回傳"陣列"中第一個符合條件的元素值，若找不到則回傳 undefined
      // 在這裡用來檢查使用者輸入的帳號和密碼是否存在於 storedCredentials 陣列中
      const foundUser = storedCredentials.find(
        (user) =>
          user.username === this.username && user.password === this.password
      );

      if (foundUser) {
        alert('登入成功！');
        this.router.navigate(['/todo', this.username]); //帶使用者名稱
      } else {
        alert('帳號或密碼錯誤！');
      }
    }
  }
}
