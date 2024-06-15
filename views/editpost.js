const pathval = document.getElementById("id");
const id = parseInt(pathval.innerText);
let current_post = null;

let userString = window.localStorage.getItem("user");
let user = JSON.parse(userString);
fetch("http://localhost:8081/posts/" + id,{
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
    for (let i = 0; i < data.posts.length; i++) {
      const post = data.posts[i];
      if (post.id == id) {
        current_post = post;
        let top_html = `
            <div class="topbox">
            <div class="btnwrap">
                <button type="button" onclick="goto_postview(${post.id})" class="toparrow">
                    <img class="arrow" src="/views/images/arrow.png">
                </button>
            </div>
            <button class="topname" onclick="goto_list()">아무 말 대잔치</button>
            <div class="dropdown" >
                <button class="dropdown_btn" id="dropdown_btn "onclick="dropdown_btn()"><img class="profile" src="${user.profile}"></button>
                <div class="dropdown_options" id="dropdown_op">
                    <button type="button" class="go_btn" onclick="go_profile_btn()">회원정보수정</button>
                    <button type="button" class="go_btn" onclick="go_editpwd_btn()">비밀번호수정</button>
                    <button type="button" class="go_btn" onclick="go_login_btn()">로그아웃</button>
                </div>
            </div>
        </div>
            `;
        document
          .querySelector("#top_wrap")
          .insertAdjacentHTML("beforeEnd", top_html);
      }
    }
  });
fetch("http://localhost:8081/posts/" + id,{
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
    for (let i = 0; i < data.posts.length; i++) {
      const post = data.posts[i];
      if (post.id == id) {
        let editpost_html = `
                    <div class="title">제목*</div>
                    <hr style = "width: 100%; background-color: black; border: 1px; height: 1px; margin: 0px; opacity: 16%;">
                    <textarea class="before_title" style="resize: none;" maxlength="26" id="beforetitle">${post.title}</textarea>
                    <hr style = "width: 100%; background-color: black; border: 1px; height: 1px; margin: 0px; opacity: 16%;">
                    <div class="title">내용*</div>
                    <hr style = "width: 100%; background-color: black; border: 1px; height: 1px; margin: 0px; opacity: 16%;">
                    <textarea class="before_content" id="beforecontent" style="resize: none;">${post.post_text}
                    </textarea>
                    <hr style = "width: 100%; background-color: black; border: 1px; height: 1px; margin: 0px; opacity: 16%;">
                    <div class="uploadimg_box"> 
                        <div class="helptext" id="help">* helper text</div>   
                        <div class="upload">
                            <div class="title_img">이미지</div>
                            <input type="file" id="change" accept="image/*" onchange="modify_profile(this)">
                        </div>
                    </div>
                    <div class="modifybtn">
                        <input type="button" value="수정하기" class="editprofile" onclick="modify_upload(${post.id})">
                    </div>
            `;
        document
          .querySelector("#wrap_edit")
          .insertAdjacentHTML("beforeEnd", editpost_html);
      }
    }
  });

// 열기 버튼을 눌렀을 때 모달팝업이 열림
const dropdown_btn = () => {
  //display 속성을 block로 변경
  const dropdown_op = document.querySelector("#dropdown_op");
  if (dropdown_op.style.display == "") {
    dropdown_op.style.display = "block";
  } else if (dropdown_op.style.display == "block") {
    dropdown_op.style.display = "";
  }
};

const go_profile_btn = () => {
  window.location.assign("/editprofile");
};
const go_editpwd_btn = () => {
  window.location.assign("/editpwd");
};
const go_login_btn = () => {
  window.location.assign("/logout");
};

const goto_postview = (get_id) => {
  window.location.assign("/postview/" + get_id);
};

//////  게시글 수정 완료 후 게시글 상세보기 이동
const modify_upload = (get_id) => {
  let title = document.querySelector("#beforetitle").value;
  let content = document.querySelector("#beforecontent").value;
  let helptext = document.querySelector("#help");

  fetch("http://localhost:8081/posts/" + current_post.id + "/editpost", {
    credentials:'include',
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: get_id,
      title: title,
      post_text: content,
      post_image: "data:image/" + profile_ext + ";base64," + btoa(profile_data), //이미지 파일 가져오기,
    }),
  }).then((res) => {
    if (res.ok) {
      helptext.innerText = "";
      alert("게시물 수정 완료");
      window.location.assign("/postview/" + current_post.id);
    }
  });
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
