let userString = window.localStorage.getItem("user");
let current_user = JSON.parse(userString);

fetch("http://localhost:8081/users/" + current_user.id,{
  credentials:'include',
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
  .then((data) => {
    // 데이터 처리
    console.log(data);
    for (let i = 0; i < data.users.length; i++) {
      const user = data.users[i];
      if (user.id == current_user.id) {
        let edit_html = `
        <h4 class="logintext">이메일*</h4>
        <div class="email">${user.email}</div>
        <h4 class="logintext">닉네임*</h4>
        <input type="name" placeholder="닉네임" value="${user.nickname}" class="inlogin" id="nickname_input">
        <h6 class="helptext" id="help_edit">* helper text</h6>
        <input type="button" value="수정하기" class="editprofile" id="edit_btn" onclick="submit_edit()">
        <input type="button" value="회원 탈퇴" class="withdraw" id="withdraw" onclick="withdraw_modalOpen()">
            `;
        document
          .querySelector("#editprofile_box")
          .insertAdjacentHTML("beforeEnd", edit_html);
      }
    }
  });

//profile 탑 부분 본인 사진으로 설정
let profile = document.getElementById("profile");
profile.setAttribute("src", current_user.profile);

//profile 변경 부분 본인 사진으로 설정
let back_profile = document.getElementById("back_profile");
back_profile.setAttribute("src", current_user.profile);

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

// 바깥 부분 클릭하면 dropdown 사라짐
// dropdown_btn.addEventListener('click', () => {
//     dropdown_op.style.display = 'block';
// });

// dropdown_btn.addEventListener('blur', () => {
//     dropdown_op.style.display = '';
// });

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

//////버튼 누르면 닉네임 확인
async function submit_edit() {
  const help_edit = document.querySelector("#help_edit");
  const nick = document.querySelector("#nickname_input").value;
  const editbtn = document.querySelector("#edit_btn");
  if (nick == "") {
    editbtn.style.cssText = "background-color: #aca0eb";
    help_edit.innerText = "닉네임을 입력해주세요.";
    return;
  } else if (nick.length >= 11) {
    editbtn.style.cssText = "background-color: #aca0eb";
    help_edit.innerText = "*닉네일은 최대 10자까지 작성 가능합니다";
    return;
  }
  let response = await fetch("http://localhost:8081/users/",{
    credentials:'include',
  });
  if (!response.ok) {
    if(response.status == 401){
      window.location.assign("/login");
    }
    throw new Error("Network response was not ok");
  }
  let data = await response.json();
  console.log(data);
  for (let i = 0; i < data.users.length; i++) {
    const user = data.users[i];
    if (user.nickname == nick) {
      if (user.id != current_user.id) {
        editbtn.style.cssText = "background-color: #aca0eb";
        help_edit.innerText = "*중복된 닉네임입니다.";
        return;
      }
    }
  }
  // .then((response) => {
  //     // 응답을 JSON으로 파싱
  //     if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //     }
  //     return response.json();
  // })
  // .then((data) => {
  //     // 데이터 처리
  //     console.log(data);
  //     for(let i=0; i<data.users.length; i++){
  //         const user = data.users[i];
  //         if(user.nickname==nick){
  //             editbtn.style.cssText  = 'background-color: #aca0eb';
  //             help_edit.innerText="*중복된 닉네임입니다.";
  //             return false;
  //         }
  //     }

  // })

  fetch("http://localhost:8081/users/" + current_user.id + "/editprofile", {
    credentials:'include',
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: current_user.id,
      nickname: nick,
      profile: "data:image/" + profile_ext + ";base64," + btoa(profile_data), //이미지 파일 가져오기
    }),
  }).then((res) => {
    if (res.ok) {
      help_edit.innerText = "";
      editbtn.style.cssText = "background-color: #7F6AEE";
      const tostMessage = document.getElementById("tost_message");

      //2. 토스트 메시지 노출-사라짐 함수 작성
      const tostOn = () => {
        tostMessage.classList.add("active");
        setTimeout(function () {
          tostMessage.classList.remove("active");
        }, 1000);
      };
      setTimeout(function () {
        tostOn();
      }, 1000);

      setTimeout(function () {
        window.location.assign("/logout");
      }, 3000);
    }
  });
}
const withdraw_modal = document.querySelector(".withdraw_modal");

//열기 버튼을 눌렀을 때 모달팝업이 열림
const withdraw_modalOpen = () => {
  //display 속성을 block로 변경
  withdraw_modal.style.display = "block";
  document.body.style.overflow = "hidden";
};
//닫기 버튼을 눌렀을 때 모달팝업이 닫힘
const withdraw_modalClose = () => {
  //display 속성을 none으로 변경
  withdraw_modal.style.display = "none";
  document.body.style.overflow = "unset";
};
const withdraw_modalOk = () => {
  fetch("http://localhost:8081/users/" + current_user.id, {
    credentials:'include',
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    //모달 없애면서 댓글 삭제
    document.body.style.overflow = "unset";
    alert("회원 탈퇴 완료");
    window.location.assign("/logout");
  });
  document.body.style.overflow = "unset";
  //모달 없애고 게시물 삭제 -> 게시물 리스트로 돌아가기
  window.location.assign("/logout");
};

let profile_data;
let profile_ext;
const modify_profile = (e) => {
  const file = URL.createObjectURL(e.files[0]);

  document.querySelector(".profileimg").src = file;

  let fileReader = new FileReader();

  //   fileReader.readAsDataURL(e.files[0]);
  fileReader.readAsBinaryString(e.files[0]);
  profile_ext = e.files[0].type.split("/")[1];

  fileReader.onload = (event) => {
    //   console.log(`path: ${event.target.result}`);  // 업로드된 파일 경로
    //   image.setAttribute("src", event.target.result); // 파일 경로 지정
    profile_data = event.target.result;
  };
};
const goto_list = () => {
  window.location.assign("/viewlist");
};
