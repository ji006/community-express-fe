fetch("http://localhost:8081/users",{

credentials:'include'
})
  .then((response) => {
    // 응답을 JSON으로 파싱
    if (!response.ok) {
      if(response.status == 401){
        window.location.assign("/login");
      }
      throw new Error("Network response was not ok");
    }
    return response.json();
  })

let userString = window.localStorage.getItem("user");
let user = JSON.parse(userString);

//profile 본인 사진으로 설정
let profile = document.getElementById("profile");
profile.setAttribute("src", user.profile);

//dropdown 설정
const dropdown_op = document.querySelector("#dropdown_op");
const dropdown_btn = document.querySelector("#dropdown_btn");

// 열기 버튼을 눌렀을 때 모달팝업이 열림
dropdown_btn.addEventListener("click", function () {
  //display 속성을 block로 변경
  if (dropdown_op.style.display == "") {
    dropdown_op.style.display = "block";
  } else if (dropdown_op.style.display == "block") {
    dropdown_op.style.display = "";
  }
});
const go_profile_btn = document.querySelector("#go_editprofile_btn");
const go_editpwd_btn = document.querySelector("#go_editpwd_btn");
const go_login_btn = document.querySelector("#go_login_btn");

go_profile_btn.addEventListener("click", () => {
  window.location.assign("/editprofile");
});
go_editpwd_btn.addEventListener("click", () => {
  window.location.assign("/editpwd");
});
go_login_btn.addEventListener("click", () => {
  window.location.assign("/logout");
});

////비번 체크
const checkPassword = (pw) => {
  var regexPw =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}/;
  if (!regexPw.test(pw)) {
    return null;
  }
  return true;
};

const check_pwd_valid = () => {
  const help_newpwd = document.querySelector("#helptext_pwd");
  const newpwd = document.querySelector("#input_newpwd").value;
  const help_checkpwd = document.querySelector("#helptext_checkpwd");
  const check_newpwd = document.querySelector("#input_checkpwd").value;
  const newpwd_btn = document.querySelector("#newpwd_btn");

  newpwd_btn.disabled = true;
  newpwd_btn.style.cssText = "background-color: #ACA0EB";

  if (newpwd == "") {
    help_newpwd.innerText = "*비밀번호를 입력해주세요.";
    return;
  } else if (checkPassword(newpwd) == null) {
    help_newpwd.innerText = "*비밀번호를 다시 입력해주세요";
    return;
  } else if (newpwd != check_newpwd) {
    help_newpwd.innerText = "*비밀번호 확인과 다릅니다.";
  }

  if (check_newpwd == "") {
    help_checkpwd.innerText = "*비밀번호를 한번 더 입력해주세요.";
    return;
  } else if (newpwd != check_newpwd) {
    help_checkpwd.innerText = "*비밀번호와 다릅니다.";
    return;
  }
  help_newpwd.innerText = "";
  help_checkpwd.innerText = "";
  newpwd_btn.disabled = false;
  newpwd_btn.style.cssText = "background-color: #7F6AEE";
};
const submit_newpwd = () => {
  const newpwd = document.querySelector("#input_newpwd").value;
  fetch("http://localhost:8081/users/" + user.id + "/editpwd", {
  credentials:'include',  
  method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: user.id,
      password: newpwd,
    }),
  }).then((res) => {
    if (res.ok) {
      const tostMessage = document.getElementById("tost_message");

      // 토스트 메시지 노출-사라짐 함수
      function tostOn() {
        tostMessage.classList.add("active");
        setTimeout(function () {
          tostMessage.classList.remove("active");
        }, 1000);
      }
      tostOn();
      setTimeout(function () {
        window.location.assign("/logout");
      }, 2000);
    }
  });
};

const goto_list = () => {
  window.location.assign("/viewlist");
};
