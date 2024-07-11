const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
const checkPassword = (pw) => {
  var regexPw =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}/;
  if (!regexPw.test(pw)) {
    return null;
  }
  return true;
};
const check_member = () => {
  const email = document.querySelector("#email1").value;
  const password = document.querySelector("#password").value;
  const login_help = document.getElementById("login_help");
  if (email == "") {
    //alert("입력하신 계정 입력정보가 정확하지 않았습니다.");
    login_help.innerText = "*올바른 이메일 주소 형식을 입력해주세요.";
    return false;
  } else if (email.length < 15) {
    //alert ("입력하신 계정 정보길이가 정확하지 않았습니다.");
    login_help.innerText = "*올바른 이메일 주소 형식을 입력해주세요.";
    return false;
  } else if (validateEmail(email) == null) {
    //alert("입력하신 계정 정보가 정확하지 않았습니다.");
    login_help.innerText = "*올바른 이메일 주소 형식을 입력해주세요.";
    return false;
  }
  if (password == "") {
    // alert("입력하신 계정 비번정보가 정확하지 않았습니다.");
    login_help.innerText = "*비밀번호를 입력해주세요";
    return false;
  } else if (checkPassword(password) == null) {
    // alert("입력하신 계정 비번정보가 정확하지 않았습니다.");
    login_help.innerText = "*비밀번호 형식이 틀립니다.";
    return false;
  }
  login_help.innerText = "";
  return true;
};
const bothcheck = () => {
  const btn_style = document.querySelector("#login_btn");
  if (check_member() == true) {
    btn_style.style.cssText = "background-color: #8ab3ff";
    btn_style.disabled = false;
  } else {
    btn_style.style.cssText = "background-color: #c7dbff";
    btn_style.disabled = true;
  }
};

//이전 코드
// const login = () => {
//   const email = document.querySelector("#email1").value;
//   const password = document.querySelector("#password").value;
//   const btn_style = document.querySelector("#login_btn");
//   btn_style.style.cssText = "background-color: #8ab3ff";
//   // setTimeout(() => {
//   //         window.location.assign('/viewlist');
//   // }, 3000);
//   fetch("http://localhost:8081/users/login")
//     .then((response) => {
//       // 응답을 JSON으로 파싱
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .then((data) => {
//       // 데이터 처리
//       console.log(data);
//       for (let i = 0; i < data.users.length; i++) {
//         const user = data.users[i];
//         if (user.email == email && user.password == password) {
//           const userString = JSON.stringify(user);
//           window.localStorage.setItem("user", userString);
//           window.location.assign("/viewlist");
//           return;
//         }
//       }
//       alert("올바르지 않은 정보입니다.");
//     })
//     .catch((error) => {
//       // 에러 처리
//       console.error("There was a problem with your fetch operation:", error);
//     });
// };

// button.addEventListener('blur', () => {
//     const dropdown = document.querySelector('.dropdown');

//     // 0.2초 뒤에 실행
//     setTimeout(() => {
//       dropdown.style.display = '';
//     }, 200);
//   });

const login = () => {
  const email = document.querySelector("#email1").value;
  const password = document.querySelector("#password").value;
  const btn_style = document.querySelector("#login_btn");
  btn_style.style.cssText = "background-color: #8ab3ff";
  fetch("http://localhost:8081/users/login", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password }),
    credentials:'include'
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    if (data) {
      // 로그인이 성공하면 세션에 사용자 정보를 저장합니다.
      // window.sessionStorage.setItem('user', JSON.stringify(data));
      const userString = JSON.stringify(data);
      window.localStorage.setItem("user", userString);
      window.location.assign("/viewlist");
    } else {
      alert("올바르지 않은 정보입니다.");
    }
  })
  .catch((error) => {
    console.error("There was a problem with your fetch operation:", error);
  });
};