/* 단일 책임의 원칙 (Single Responsibility Principle, SRP) */
/*
    하나의 객체는 단 하나의 책임을 가져야 한다
    즉, 클래스나 모듈을 변경할 이유가 단 하나 뿐이어야 한다는 원칙

    SRP는 책임이라는 개념을 정의하며 적절한 클래스의 크기를 제시합니다.
    SRP는 객체 지향설계에서 중요한 개념이고 이해하고 따르기 쉬운 개념이지만, 프로그래머가 가장 무시하는 규칙 중 하나입니다. 
    일반적인 프로그래머는 “깨끗하고 우아하게 작성된 소프트웨어"보다 “동작하기만 하는 소프트웨어"에 초점을 맞추기 때문입니다.        
*/

// /** SRP Before **/
// // 아래의 UserSettings 클래스는 하나의 클래스가 가지는 책임이 여러개가 존재
// // 1. `changeSettings`: Settings를 변경한다.
// // 2. `verifyCredentials`: 인증을 검증한다.
// class UserSettings {
//   // UserSettings 클래스 생성자
//   constructor(user) {
//     this.user = user;
//   }

//   // 사용자의 설정을 변경하는 메소드
//   changeSettings(userSettings) {
//     if (this.verifyCredentials()) {
//       //...
//     }
//   }

//   // 사용자의 인증을 검증하는 메소드
//   verifyCredentials() {
//     //...
//   }
// }

/** @@@@@ SRP After @@@@@ **/
// 1. 사용자의 **설정**을 **변경**하는 **책임**을 가진 `UserSettings` 클래스
// 2. 사용자의 **인증**을 **검증**하는 **책임**을 가진 `UserAuth` 클래스
// 책임을 분리하여 개선된 코드는 클래스마다 단 1개의 책임을 가지게 됨
class UserAuth {
  constructor(user) {
    // UserAuth 클래스 생성자
    this.user = user;
  }

  verifyCredentials() {
    // 사용자의 인증을 검증하는 메소드
    //...
  }
}

class UserSettings {
  constructor(user, userAuth) {
    // UserSettings 클래스 생성자
    this.user = user;
    this.userAuth = userAuth; // UserAuth를 생성자를 통해 주입받는다.
  }

  changeSettings(userSettings) {
    // 사용자의 설정을 변경하는 메소드
    if (this.userAuth.verifyCredentials()) {
      // 생성자에서 주입 받은 userAuth 객체의 메소드를 사용한다.
      //...
    }
  }
}

//=============================================================================================================================

/* 개방-폐쇄 원칙 (Open-Closed Principle, OCP) */
/*
    소프트웨어 엔티티 또는 개체(클래스, 모듈, 함수 등)는 확장에는 열려 있으나 변경에는 닫혀 있어야 한다.
    - 즉, 소프트웨어 개체의 행위는 확장될 수 있어야 하지만, 개체를 변경해서는 안됩니다.
    - 조금 더 쉽게 설명하자면, 기존 코드에 영향을 주지않고 소프트웨어에 새로운 기능이나 구성 요소를 추가할 수 있어야 한다는 것입니다.

    만약 요구사항을 조금 반영하는 데 소프트웨어를 엄청나게 수정해야 한다면, 소모되는 개발 코스트 또한 엄청나게 증가할 것입니다
    이러한 문제를 개선하기 위해선 개방-폐쇄 원칙을 따라야합니다.
*/

/** OCP Before **/
/*
만약 곱셈, 나눗셈, 제곱 연산 등 다양한 계산기의 기능을 추가하려면 calculator 함수 자체를 수정해야할 것. 
이런 접근 방식은 개방-폐쇄 원칙(OCP)인 “확장에는 열려 있으나 변경에는 닫혀 있어야 한다.”를 위반하게 됨.
*/
// function calculator(nums, option) {
//     let result = 0;
//     for (const num of nums) {
//       if (option === "add") result += num; // option이 add일 경우 덧셈 연산을 합니다.
//       else if (option === "sub") result -= num; // option이 sub일 경우 뺄셈 연산을 합니다.
//       // 새로운 연산(기능)을 추가 하기 위해서는 함수 내부에서 코드 수정이 필요합니다.
//     }
//     return result;
//   }

//   console.log(calculator([2, 3, 5], "add")); // 10
//   console.log(calculator([5, 2, 1], "sub")); // -8

/** @@@@@ OCP After @@@@@ **/
// calculator 함수에서 전달받은 option 매개변수를 콜백 함수로 변경하여 새로운 계산 조건이 추가되더라도 실제 calculator 함수에서는 어떠한 변화가 발생하지 않도록 만듬
// option을 CallbackFunc로 변경
function calculator(nums, callBackFunc) {
  let result = 0;
  for (const num of nums) {
    result = callBackFunc(result, num); // option으로 분기하지 않고, Callback함수를 실행하도록 변경
  }
  return result;
}

const add = (a, b) => a + b; // 함수 표현식을 정의합니다.
const sub = (a, b) => a - b;
const mul = (a, b) => a * b;
const div = (a, b) => a / b;
console.log(calculator([2, 3, 5], add)); // add 함수 표현식을 Callback 함수로 전달합니다.
console.log(calculator([5, 2, 1], sub)); // sub 함수 표현식을 Callback 함수로 전달합니다.

//=============================================================================================================================

/* 리스코프 치환 원칙 (Liskov substitution principle, LSP) */
/*
    어플리케이션에서 객체는 프로그램의 동작에 영향을 주지 않으면서, 하위 타입의 객체로 바꿀 수 있어야 한다.
    즉, S가 T의 하위 유형이라면, 프로그램의 기능에 변화를 주지 않고서도 T 타입의 객체를 S 객체로 대체할 수 있어야한다.

    우리가 부모 클래스(Parents)와 자식 클래스(Child) 를 가지고 있다면, 이 두가지의 클래스의 객체를 서로를 바꾸더라도 해당 프로그램에서 잘못된 결과를 도출하지 않아야하는 원칙
    정사각형(Square)의 특징은? 그것은 바로 높이와 너비가 동일하다는 것
    직사각형(Rectangle)은 높이와 너비가 서로 독립적으로 변경될 수 있다는 특성을 가지고 있음.
*/

/** LSP Before **/
/*
    Square와 Rectangle클래스에서 같은 메서드를 호출하더라도 다른 결과값이 반환되는 것을 확인할 수 있다.
    높이를 7로 설정하려 하였지만, Square 클래스에서는 너비와 높이가 동일해야 하므로 결과적으로 너비가 7로 설정.
    두 클래스를 서로 교체하였을 때에도 동일한 결과 값이 도출되지 않는 것을 확인.

*/
// class Rectangle {
//     constructor(width = 0, height = 0) { // 직사각형의 생성자
//       this.width = width;
//       this.height = height;
//     }

//     setWidth(width) { // 직사각형은 높이와 너비를 독립적으로 정의한다.
//       this.width = width;
//       return this; // 자신의 객체를 반환하여 메서드 체이닝이 가능하게 합니다.
//     }

//     setHeight(height) { // 직사각형은 높이와 너비를 독립적으로 정의한다.
//       this.height = height;
//       return this; // 자신의 객체를 반환하여 메서드 체이닝이 가능하게 합니다.
//     }

//     getArea() { // 사각형의 높이와 너비의 결과값을 조회하는 메소드
//       return this.width * this.height;
//     }
//   }

//   class Square extends Rectangle { // 정사각형은 직사각형을 상속받습니다.
//     setWidth(width) { // 정사각형은 높이와 너비가 동일하게 정의된다.
//       this.width = width;
//       this.height = width;
//       return this; // 자신의 객체를 반환하여 메서드 체이닝이 가능하게 합니다.
//     }

//     setHeight(height) { // 정사각형은 높이와 너비가 동일하게 정의된다.
//       this.width = height;
//       this.height = height;
//       return this; // 자신의 객체를 반환하여 메서드 체이닝이 가능하게 합니다.
//     }
//   }

//   const rectangleArea = new Rectangle() // 35
//     .setWidth(5) // 너비 5
//     .setHeight(7) // 높이 7
//     .getArea(); // 5 * 7 = 35
//   const squareArea = new Square() // 49
//     .setWidth(5) // 너비 5
//     .setHeight(7) // 높이를 7로 정의하였지만, 정사각형은 높이와 너비를 동일하게 정의합니다.
//     .getArea(); // 7 * 7 = 49

/** @@@@@ LSP After @@@@@ **/
/*
    두 클래스를 모두 포함하는 인터페이스를 구현.
    Shape 라는 인터페이스(Interface) 역할을 수행하는 새로운 부모 클래스를 생성하고, Rectangle과 Square가 이를 상속받도록 코드를 수정
*/
class Shape {
  // Rectangle과 Square의 부모 클래스를 정의합니다.
  getArea() {
    // 각 도형마다 계산 방법이 다를 수 있으므로 빈 메소드로 정의합니다.
  }
}

class Rectangle extends Shape {
  // Rectangle은 Shape를 상속받습니다.
  constructor(width = 0, height = 0) {
    // 직사각형의 생성자
    super();
    this.width = width;
    this.height = height;
  }

  getArea() {
    // 직사각형의 높이와 너비의 결과값을 조회하는 메소드
    return this.width * this.height;
  }
}

class Square extends Shape {
  // Square는 Shape를 상속받습니다.
  constructor(length = 0) {
    // 정사각형의 생성자
    super();
    this.length = length; // 정사각형은 너비와 높이가 같이 때문에 width와 height 대신 length를 사용합니다.
  }

  getArea() {
    // 정사각형의 높이와 너비의 결과값을 조회하는 메소드
    return this.length * this.length;
  }
}

const rectangleArea = new Rectangle(7, 7) // 49
  .getArea(); // 7 * 7 = 49
const squareArea = new Square(7) // 49
  .getArea(); // 7 * 7 = 49

//=============================================================================================================================

/* 인터페이스 분리 원칙 (Interface segregation principle, ISP) */
/*
    특정 클라이언트를 위한 인터페이스 여러 개가 범용 인터페이스 하나보다 낫다.
    클라이언트가 필요하지 않는 기능을 가진 인터페이스에 의존해서는 안 되고, 최대한 인터페이스를 작게 유지해야합니다.
    사용자가 필요하지 않은 것들에 의존하지 않도록, 인터페이스는 작고 구체적으로 유지해야 한다는 것입니다.
    여기서 설명하는 인터페이스(interface)는 대표적으로 Java, C++ 그리고 Typescript에서 사용하는 문법.
    인터페이스는 특정 클래스가 반드시 구현해야 할 메서드와 속성을 정의하는 일종의 템플릿.
    이를 통해 서로 다른 클래스가 동일한 동작을 하는것을 유추할 수 있게 되는것.
*/
/** ISP Before **/
/*
    처음 선언된 SmartPrint 인터페이스는 print(), fax(), scan() 세 가지의 기능을 정의.
    AllInOnePrinter 클래스는 print, fax, scan 3가지의 기능이 모두 필요하지만, EconomicPrinter 클래스의 경우 print기능만 지원하는 클래스.
    만약 EconomicPrinter 클래스가 SmartPrinter 인터페이스를 상속받는다면, 필요하지 않은 fax, scan 2가지의 기능을 예외 처리를 해줘야 하는 상황이 발생.
    이후에도 fax 기능이 필요한 FacsimilePrinter 클래스가 SmartPrinter 인터페이스를 상속하면, 역시  scan 기능을 예외 처리해야 하는 문제가 발생하게 되는것.
*/
// interface SmartPrinter { // SmartPrinter가 사용할 수 있는 기능들을 정의한 인터페이스 
//     print();
  
//     fax();
  
//     scan();
//   }
  
//   // SmartPrinter 인터페이스를 상속받은 AllInOnePrinter 클래스
//   class AllInOnePrinter implements SmartPrinter {
//     print() { // AllInOnePrinter 클래스는 print, fax, scan 기능을 지원한다.
//       // ...
//     }
  
//     fax() { // AllInOnePrinter 클래스는 print, fax, scan 기능을 지원한다.
//       // ...
//     }
  
//     scan() { // AllInOnePrinter 클래스는 print, fax, scan 기능을 지원한다.
//       // ...
//     }
//   }
  
//   // SmartPrinter 인터페이스를 상속받은 EconomicPrinter 클래스
//   class EconomicPrinter implements SmartPrinter {
//     print() { // EconomicPrinter 클래스는 print 기능만 지원한다.
//       // ...
//     }
  
//     fax() { // EconomicPrinter 클래스는 fax 기능을 지원하지 않는다.
//       throw new Error('팩스 기능을 지원하지 않습니다.');
//     }
  
//     scan() { // EconomicPrinter 클래스는 scan 기능을 지원하지 않는다.
//       throw new Error('Scan 기능을 지원하지 않습니다.');
//     }
//   }

/** @@@@@ ISP After @@@@@ **/
/*
    SmartPrinter 인터페이스에 정의된 기능을 Printer, Fax, Scanner 인터페이스로 분리하면 
    ISP 원칙에서 “클라이언트가 필요하지 않는 기능을 가진 인터페이스에 의존해서는 안 되고, 최대한 인터페이스를 작게 유지해야한다.”에 
    해당하는 원칙을 수행하는 코드로 개선가능.
*/
interface Printer { // print 기능을 하는 Printer 인터페이스
    print();
  }
  
  interface Fax { // fax 기능을 하는 Fax 인터페이스
    fax();
  }
  
  interface Scanner { // scan 기능을 하는 Scanner 인터페이스
    scan();
  }
  
  
  // AllInOnePrinter클래스는 print, fax, scan 기능을 지원하는 Printer, Fax, Scanner 인터페이스를 상속받았다.
  class AllInOnePrinter implements Printer, Fax, Scanner {
    print() { // Printer 인터페이스를 상속받아 print 기능을 지원한다.
      // ...
    }
  
    fax() { // Fax 인터페이스를 상속받아 fax 기능을 지원한다.
      // ...
    }
  
    scan() { // Scanner 인터페이스를 상속받아 scan 기능을 지원한다.
      // ...
    }
  }
  
  // EconomicPrinter클래스는 print 기능을 지원하는 Printer 인터페이스를 상속받았다.
  class EconomicPrinter implements Printer {
    print() { // EconomicPrinter 클래스는 print 기능만 지원한다.
      // ...
    }
  }
  
  // FacsimilePrinter클래스는 print, fax 기능을 지원하는 Printer, Fax 인터페이스를 상속받았다.
  class FacsimilePrinter implements Printer, Fax {
    print() { // FacsimilePrinter 클래스는 print, fax 기능을 지원한다.
      // ...
    }
  
    fax() { // FacsimilePrinter 클래스는 print, fax 기능을 지원한다.
      // ...
    }
  }

//=============================================================================================================================

/* 의존성 역전 원칙 (Dependency Inversion Principle, DIP) */
/*
    프로그래머는 추상화에 의존해야지, 구체화에 의존하면 안된다.
    즉, 높은 계층의 모듈(도메인)이 저수준의 모듈(하부구조)에 직접 의존해서는 안된다.
    프로그래머는 구체적인 것에 의존하기보다는 추상적인 것에 의존해야 한다.
    고수준 계층의 모듈(도메인)은 저수준 계층의 모듈(하부구조)에 의존해서는 안된다. 둘 다 추상화에 의존해야 한다.
    추상화는 세부 사항에 의존하지 않아야 하며, 세부 사항이 추상화에 의존해야 한다.

    만약 이런 추상화 없이 고수준 계층의 모듈이 저수준 계층의 모듈을 의존하게 되면
    사소한 변경 사항에도 고수준 계층의 코드를 변경해야할 것이고, 소모되는 개발 코스트또한 증가할 것이다.
*/

/** DIP Before **/
/*
  Xml 파일을 파싱하기 위해 XmlFormatter클래스를 불러와 parseXml 메소드를 호출.
  Json 파일을 파싱하기 위해 JsonFormatter클래스를 불러와 parseJson 메소드를 호출.
  이렇게, 각 파일 확장자에 따라 다른 클래스와 다른 메서드를 사용하면, 이는 구체적인 구현에 의존하고 있는 상황
*/
// import { readFile } from 'node:fs/promises';

// class XmlFormatter {
//   parseXml(content) {
//     // Xml 파일을 String 형식으로 변환합니다.
//   }
// }

// class JsonFormatter {
//   parseJson(content) {
//     // JSON 파일을 String 형식으로 변환합니다.
//   }
// }

// class ReportReader {

//   async read(path) {
//     const fileExtension = path.split('.').pop(); // 파일 확장자

//     if (fileExtension === 'xml') {
//       const formatter = new XmlFormatter(); // xml 파일 확장자일 경우 XmlFormatter를 사용한다.

//       const text = await readFile(path, (err, data) => data);
//       return formatter.parseXml(text); // xmlFormatter클래스로 파싱을 할 때 parseXml 메소드를 사용한다.

//     } else if (fileExtension === 'json') {
//       const formatter = new JsonFormatter(); // json 파일 확장자일 경우 JsonFormatter를 사용한다.

//       const text = await readFile(path, (err, data) => data);
//       return formatter.parseJson(text); // JsonFormatter클래스로 파싱을 할 때 parseJson 메소드를 사용한다.
//     }
//   }
// }

// const reader = new ReportReader();
// const report = await reader.read('report.xml');
// // or
// // const report = await reader.read('report.json');

/** @@@@@ DIP After @@@@@ **/
/*
    XmlFormatter와 JsonFormatter 클래스가 동일한 인터페이스인 Formatter 를 상속받도록 수정.
    ReportReader 클래스는 Formatter 인터페이스의 parse 메서드만 의존하게 됩니다.
    또한, 의존성 주입(Dependency Injection, DI) 패턴을 사용하여 ReportReader클래스가 Formatter를 직접 생성하는 것이 아니라, 생성자를 통해 Formatter 인스턴스를 주입받도록 수정.
*/
import { readFile } from 'node:fs/promises';

class Formatter { // 인터페이스지만, Javascript로 구현하기 위해 클래스로 선언합니다.
  parse() {  }
}

class XmlFormatter extends Formatter {
  parse(content) {
    // Xml 파일을 String 형식으로 변환합니다.
  }
}

class JsonFormatter extends Formatter {
  parse(content) {
    // JSON 파일을 String 형식으로 변환합니다.
  }
}

class ReportReader {
  constructor(formatter) { // DI 패턴을 적용하여, Formatter를 생성자를 통해 주입받습니다.
    this.formatter = formatter;
  }

  async read(path) {
    const text = await readFile(path, (err, data) => data);
    return this.formatter.parse(text); // 추상화된 formatter로 데이터를 파싱합니다.
  }
}

const reader = new ReportReader(new XmlFormatter());
const report = await reader.read('report.xml');
// or
// const reader = new ReportReader(new JsonFormatter());
// const report = await reader.read('report.json');