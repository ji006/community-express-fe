fetch("http://localhost:8081/posts",{

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
let profile = document.getElementById("profile");
profile.setAttribute("src", user.profile);
//////  dropdown 설정
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

const write_final = () => {
  const title = document.getElementById("title_get").value;
  const content = document.getElementById("content_get").value;
  const edit_btn_style = document.querySelector("#profile_edit_btn");
  const helptext = document.getElementById("helptext");

  if (title == "" || content == "") {
    // edit_btn_style.disabled = true;
    edit_btn_style.style.cssText = "background-color: #ACA0EB";
  } else {
    // edit_btn_style.disabled = false;
    helptext.innerText = "";
    edit_btn_style.style.cssText = "background-color: #7F6AEE";
  }
};
const getFormattedDateTime = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const submit_post = () => {
  const title = document.getElementById("title_get").value; // class="get_title" id="title_get"
  const content = document.getElementById("content_get").value;
  let helptext = document.getElementById("helptext");
  let image = document.querySelector(".title_img");

  if (title == "" || content == "") {
    // alert("제목, 내용을 모두 작성해주세요.");
    helptext.innerText = "*제목, 내용을 모두 작성해주세요.";
    return;
  } else {
    fetch("http://localhost:8081/posts/createpost", {
      credentials:'include',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        like: 0,
        comment: 0,
        viewcount: 0,
        writetime: getFormattedDateTime(),
        nickname: user.nickname,
        email: user.email,
        profile: user.profile,
        post_text: content,
        post_image:
          "data:image/" + profile_ext + ";base64," + btoa(profile_data), //이미지 파일 가져오기,
        comments: [],
      }),
    }).then((res) => {
      if (res.ok) {
        helptext.innerText = "";
        alert("게시글 등록 완료");
        window.location.assign("/viewlist");
      }
    });
  }
};
let profile_data;
let profile_ext;
const modify_profile = (e) => {
  // const file = URL.createObjectURL(e.files[0]);

  // document.querySelector(".titleimg").src = file;

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
