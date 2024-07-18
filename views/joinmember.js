const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
async function allcheck() {
  const submit_btn = document.querySelector("#submit_btn");
  if (
    (uploadfile() == true && (await check_email())) == true &&
    check_password() == true &&
    check_checkpwd() == true &&
    (await check_name()) == true
  ) {
    submit_btn.style.cssText = "background-color: #8ab3ff";
    submit_btn.disabled = false;
  } else {
    submit_btn.style.cssText = "background-color: #c7dbff";
    submit_btn.disabled = true;
  }
}

async function check_email() {
  const joinemail = document.querySelector("#email").value;
  const help_email = document.querySelector("#help_email");
  if (joinemail == "") {
    help_email.innerText = "*이메일을 입력해주세요";
    return false;
  } else if (joinemail.length < 15 || validateEmail(joinemail) == null) {
    help_email.innerText = "*올바른 이메일 주소 형식을 입력해주세요";
    return false;
  }
  res = await fetch_email();
  if (res.ok) {
    data = await res.json();
    for (let i = 0; i < data.users.length; i++) {
      const user = data.users[i];
      if (user.email == joinemail) {
        help_email.innerText = "*중복된 이메일입니다.";
        return false;
      }
    }
  }
  help_email.innerText = "";
  return true;
}
const fetch_email = () => {
  return fetch("http://localhost:8081/users",{
    credentials:'include',
  });
};
////비번 체크
const validPassword = (pw) => {
  var regexPw =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}/;
  if (!regexPw.test(pw)) {
    return null;
  }
  return true;
};
const check_password = () => {
  const joinpwd = document.querySelector("#pwd").value;
  const help_pwd = document.querySelector("#help_pwd");
  const joincheckpwd = document.querySelector("#checkpwd").value;
  if (joinpwd == "") {
    help_pwd.innerText = "*비밀번호를 입력해주세요.";
    return false;
  } else if (validPassword(joinpwd) == null) {
    help_pwd.innerText =
      "*8~20자, 대문자, 소문자, 숫자, 특수문자를 각각 1개 이상 포함 필수";
    return false;
  } else if (joinpwd != joincheckpwd) {
    help_pwd.innerText = "*비밀번호 확인과 다릅니다.";
    help_checkpwd.innerText = "*비밀번호가 다릅니다.";
    return false;
  }
  help_pwd.innerText = "";
  return true;
};
const check_checkpwd = () => {
  const joinpwd = document.querySelector("#pwd").value;
  const help_pwd = document.querySelector("#help_pwd");
  const joincheckpwd = document.querySelector("#checkpwd").value;
  const help_checkpwd = document.querySelector("#help_checkpwd");
  if (joincheckpwd == "") {
    help_checkpwd.innerText = "*비밀번호를 한번더 입력해주세요.";
    return false;
  } else if (joinpwd != joincheckpwd) {
    help_pwd.innerText = "*비밀번호 확인과 다릅니다.";
    help_checkpwd.innerText = "*비밀번호가 다릅니다.";
    return false;
  }
  help_pwd.innerText = "";
  help_checkpwd.innerText = "";
  return true;
};

async function check_name() {
  const nickname = document.querySelector("#name").value;
  const help_name = document.querySelector("#help_name");
  if (nickname == "") {
    help_name.innerText = "닉네임을 입력해주세요.";
    return false;
  } else if (nickname.search(/\s/) != -1) {
    //띄어쓰기 nickname에서 확인
    help_name.innerText = "띄어쓰기를 없애주세요.";
    return false;
  } else if (nickname.length >= 11) {
    help_name.innerText = "*닉네일은 최대 10자까지 작성 가능합니다";
    return false;
  }
  res = await fetch_name();
  if (res.ok) {
    data = await res.json();
    for (let i = 0; i < data.users.length; i++) {
      const user = data.users[i];
      if (user.nickname == nickname) {
        help_name.innerText = "*중복된 닉네임입니다.";
        return false;
      }
    }
  }
  help_name.innerText = "";
  return true;
}
const fetch_name = () => {
  return fetch("http://localhost:8081/users/",{
    credentials:'include',
  });
};
const join = () => {
  //요청 헤더 및 본문 매개변수 추가하기
  const joinemail = document.querySelector("#email").value;
  const joinpwd = document.querySelector("#pwd").value;
  const nickname = document.querySelector("#name").value;
  //   const profile_file = document.querySelector("#change");

  //   let formData = new FormData();
  //   formData.append("email", joinemail);
  //   formData.append("password", joinpwd);
  //   formData.append("nickname", nickname);
  //   formData.append("profile", profile_file.files[0]);
  //   const file = URL.createObjectURL(e.files[0]);

  fetch("http://localhost:8081/users/join", {
    credentials:'include',
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: joinemail,
      password: joinpwd,
      nickname: nickname,
      profile: "data:image/" + profile_ext + ";base64," + btoa(profile_data), //이미지 파일 가져오기
    }),
    // body:formData
  }).then((res) => {
    if (res.ok) {
      alert("회원가입 완료");
      window.location.assign("/login");
    }
  });
};

let profile_data;
let profile_ext;
const uploadfile = () => {
  const fileInput = document.getElementById("change");
  const help_profile = document.querySelector("#profile_help");
  if (fileInput.files.length == 0) {
    help_profile.innerText = "*프로필 사진을 추가해주세요";
    return false;
  }
  const file = URL.createObjectURL(fileInput.files[0]);

  document.querySelector(".profileimg").src = file;

  let fileReader = new FileReader();

  //   fileReader.readAsDataURL(e.files[0]);
  fileReader.readAsBinaryString(fileInput.files[0]);
  profile_ext = fileInput.files[0].type.split("/")[1];

  fileReader.onload = (event) => {
    //   console.log(`path: ${event.target.result}`);  // 업로드된 파일 경로
    //   image.setAttribute("src", event.target.result); // 파일 경로 지정
    profile_data = event.target.result;
  };
  help_profile.innerText = "";
  return true;
};
