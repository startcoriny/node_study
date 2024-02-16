/** Encapsulation(캡슐화)  - typeScript**/
class User {
    private name: string; // name 변수를 외부에서 접근을 할 수 없게 만듭니다.
    private age: number; // age 변수를 외부에서 접근을 할 수 없게 만듭니다.
  
    setName(name: string) { // Private 속성을 가진 name 변수의 값을 변경합니다.
      this.name = name;
    }
    getName() { // Private 속성을 가진 name 변수의 값을 조회합니다.
      return this.name;
    }
    setAge(age: number) { // Private 속성을 가진 age 변수의 값을 변경합니다.
      this.age = age;
    }
    getAge() { // Private 속성을 가진 age 변수의 값을 조회합니다.
      return this.age;
    }
  }
  
  const user = new User(); // user 인스턴스 생성
  user.setName('coriny');
  user.setAge(27);
  console.log(user.getName()); // coriny
  console.log(user.getAge()); // 27
  console.log(user.name); // Error: User 클래스의 name 변수는 private로 설정되어 있어 바로 접근할 수 없습니다.

// ==================================================================================

/** Inheritance(상속) **/
class Mother { // Mother 부모 클래스
    constructor(name, age, job) { // 부모 클래스 생성자
      this.name = name;
      this.age = age;
      this.tech = job;
    }
    getJob(){ return this.job; } // 부모 클래스 getJob 메서드
  }
  
  class Child extends Mother{ // Mother 클래스를 상속받은 Child 자식 클래스
    constructor(name, age, job) { // 자식 클래스 생성자
      super(name, age, job); // 부모 클래스의 생성자를 호출
    }
  }
  
  const child = new Child("coriny", "27", "developer");
  console.log(child.name); // coriny
  console.log(child.age); // 27
  console.log(child.getJob()); // 부모 클래스의 getJob 메서드 호출: developer

// ==================================================================================

  /** Abstraction(추상화) - typeScript **/
interface Human {
    name: string;
    setName(name);
    getName();
  }
  
  // 인터페이스에서 상속받은 프로퍼티와 메소드는 구현하지 않을 경우 에러가 발생합니다.
  class Employee implements Human {
    constructor(public name: string) {  }
    
    // Human 인터페이스에서 상속받은 메소드
    setName(name) { this.name = name; }
    
    // Human 인터페이스에서 상속받은 메소드
    getName() { return this.name; }
  }
  
  const employee = new Employee("");
  employee.setName("coriny"); // Employee 클래스의 name을 변경하는 setter
  console.log(employee.getName()); // Employee 클래스의 name을 조회하는 getter

  // ==================================================================================

  /** Polymorphism **/
class Person {
    constructor(name) { this.name = name; }
  
    buy() {}
  }
  
  class Employee extends Person {
    buy() { console.log(`${this.constructor.name} 클래스의 ${this.name}님이 물건을 구매하였습니다.`); }
  }
  
  class User extends Person {
    buy() { console.log(`${this.constructor.name} 클래스의 ${this.name}님이 물건을 구매하였습니다.`); }
  }
  

  //인스턴스
  const employee1 = new Employee("짱구");
  const employee2 = new Employee("철수");
  const user1 = new User("유리");
  const user2 = new User("맹구");
  
  const personsArray = [employee1, employee2, user1, user2];
  // personsArray에 저장되어 있는 Employee, User 인스턴스들의 buy 메소드를 호출합니다.
  personsArray.forEach((person) => person.buy());
  
  // Employee 클래스의 짱구님이 물건을 구매하였습니다.
  // Employee 클래스의 철수님이 물건을 구매하였습니다.
  // User 클래스의 유리님이 물건을 구매하였습니다.
  // User 클래스의 맹구님이 물건을 구매하였습니다.

  /* 다형성(Polymorphism)의 특징
     각 인스턴스의 buy 메서드를 호출하는 것은 동일하지만, Employee와 User 클래스의 buy 메서드는 서로 다른 행위를 수행하고 있는 것을 확인가능
  */