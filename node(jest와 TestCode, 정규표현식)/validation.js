// validation.js

/*  정규 표현식
    /^ / : 문자열의 시작과 끝을 의미
    [a-z0-9.-] : 소문자 a부터z, 숫자 0부터1, .과-중 하나를 의미
    + : 앞의 패턴이 하나 이상 반복됨을 나타냄
    $ : 문자열의 끝을 의미함
    gi : gi플래그라고함. 
         • g : Global플래그, 문자열 내의 모든 패턴을 찾도록함
         • i : Case-insensitive플래그, 대소문자를 구별하지 않음
    .test() : 주어진 문자열이 정규표현식과 일치하는지 여부를 반환
    ! : 논리 부정 연산
*/

export const isEmail = (value) => {
  const email = value || "";
  const [localPart, domain, ...etc] = email.split("@");

  if (!localPart || !domain || etc.length) {
    return false;
  } else if (email.includes(" ")) {
    return false;
  } else if (email[0] === "-") {
    return false;
  } else if (!/^[a-z0-9+_-]+$/gi.test(localPart)) {
    return false;
  } else if (!/^[a-z0-9.-]+$/gi.test(domain)) {
    return false;
  }

  return true;
};
