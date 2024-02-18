// validation.spec.js

// 프로젝트 초기화 yarn init -y
// 모듈 설치 yarn add -D jest
// package.json - scripts설정
// "scripts": {"test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"}

// 테스트 코드는 위에서 에러가 나면 그 밑의 테스트로 내려가지 않음.
// 위에서 에러가 난것부터 하나씩 잡고 내려 가야함.

import { isEmail } from "./validation";

test('입력한 이메일 주소에는 "@" 문자가 1개만 있어야 이메일 형식이다.', () => {
  expect(isEmail("my-email@domain.com")).toEqual(true); // 하나만 있으면 true
  expect(isEmail("my-email@@@@domain.com")).toEqual(false); // @가 많으면 false
  expect(isEmail("my-emaildomain.com")).toEqual(false); // 없으면 false
});

test("입력한 이메일 주소에 공백(스페이스)이 존재하면 이메일 형식이 아니다.", () => {
  expect(isEmail("my-email@domain.com")).toEqual(true); // 하나만 있으면 true
  expect(isEmail("my email@domain.com")).toEqual(false); // @가 많으면 false
});

test("입력한 이메일 주소 맨 앞에 하이픈(-)이 있으면 이메일 형식이 아니다.", () => {
  expect(isEmail("my-email@domain.com")).toEqual(true); // 하나만 있으면 true
  expect(isEmail("-my-email@domain.com")).toEqual(false); // @가 많으면 false
});

test("입력한 이메일 주소중, 로컬 파트(골뱅이 기준 앞부분)에는 영문 대소문자와 숫자, 특수문자는 덧셈기호(+), 하이픈(-), 언더바(_) 3개 외에 다른 값이 존재하면 이메일 형식이 아니다.", () => {
  expect(isEmail("_good-Email+test99@domain.com")).toEqual(true);
  expect(isEmail("my$bad-Email9999@domain.com")).toEqual(false);
});

test("입력한 이메일 주소중, 도메인(골뱅이 기준 뒷부분)에는 영문 대소문자와 숫자, 하이픈(-) 외에 다른 값이 존재하면 이메일 형식이 아니다.", () => {
  expect(isEmail("my-email@my-Domain99.com")).toEqual(true);
  expect(isEmail("my-email@my_Domain99.com")).toEqual(false);
  expect(isEmail("my-email@my$Domain99.com")).toEqual(false);
});
