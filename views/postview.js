const pathval = document.getElementById("id");
const id = parseInt(pathval.innerText);
let current_post = null;
let current_comment = null;

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
                <button type="button" onclick="goto_viewlist()" class="toparrow">
                    <img class="arrow" src="/views/images/arrow.png">
                </button>
            </div>
            <button class="topname" onclick="goto_list()">고민이 먼지</button>
            <div class="dropdown">
                <button class="dropdown_btn" id="dropdown_btn"><img class="profile" src="${user.profile}" onclick="dropdown()"></button>
                <div class="dropdown_options" id="dropdown_op">
                    <button type="button" class="go_btn" id="go_editprofile_btn" onclick="go_profile()">회원정보수정</button>
                    <button type="button" class="go_btn" id="go_editpwd_btn" onclick="go_editpwd()">비밀번호수정</button>
                    <button type="button" class="go_btn" id="go_login_btn" onclick="go_login()">로그아웃</button>
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
    //데이터 처리
    console.log(data);
    for (let i = 0; i < data.posts.length; i++) {
      const post = data.posts[i];
      if (post.id == id) {
        let viewpost_html = `
        <div class=postwriter>
                        <div class="post_top">
                            <div class="title">${post.title}</div>
                            <div class="sub">
                                <div class="sub_left">
                                    <div class="top_profilebox">
                                        <img class="profile_bottom" src="${
                                          post.profile
                                        }">
                                    </div>
                                    <div class="writername">${
                                      post.nickname
                                    }</div>
                                    <div class="time"> ${post.writetime} </div>
                                </div>
                                <div class="editbtn">
                                    <input type="button" value="수정" class="modify" ${user.email==post.email ?'' :'hidden'} onclick="modify(${
                                      post.id
                                    })">
                                    <input type="button" value="삭제" class="delete" ${user.email==post.email ?'' :'hidden'} onclick="delete_post(${
                                      post.id
                                    })">
                                </div>
                            </div>
                        </div>
                        </div>
                        <hr style = "width: 100%; background-color: black; border: 1px; height: 1px; margin: 0px; opacity: 16%;">
                        <div class="middle">
                            <img class="img" src="${post.post_image}"></div>
                            <div class=text_wrap><div class="text">${
                              post.post_text
                            }</div></div>
                            <div class="statbox">
                                <div class="stat">
                                    <div class="viewcount">${change_number(
                                      post.viewcount
                                    )}<br>조회수</div>
                                    <div class="comment">${change_number(
                                      post.comment
                                    )}<br>댓글</div>
                                </div>
                            </div>
                        </div>
                        <hr style = "width: 100%; background-color: black; border: 1px; height: 1px; margin: 0px; opacity: 16%;">
                    `;
        document
          .querySelector("#postview_wrap")
          .insertAdjacentHTML("beforeEnd", viewpost_html);
      }
      function change_number(input_num) {
        if (input_num >= 1000) {
          return Math.floor(input_num / 1000) + "k";
        } else {
          return input_num;
        }
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
    //데이터 처리
    console.log(data);
    for (let j = 0; j < data.posts.length; j++) {
      const post = data.posts[j];
      if (post.id == id) {
        if (post.comments != null) {
          for (let k = 0; k < post.comments.length; k++) {
            const comment = post.comments[k];
            let viewcomments_html = `
                    <div class="commented">
                        <div class="commented_left">
                            <div class="commented_profile">
                                <div class="top_profilebox">
                                    <img class="profile_bottom" src="${comment.comment_profile}">
                                </div>
                                <div class="writername">${comment.comment_name}</div>
                                <div class="time"> ${comment.writetime} </div>
                            </div>
                            <div class="comment_content">${comment.comment_content}</div>
                        </div>
                        <div class="commented_right">
                            <input type="button" value="수정" class="modify" ${comment.comment_email==user.email ?'' :'hidden'} onclick="modify_comment('${comment.commentid}')">
                            <input type="button" value="삭제" class="delete" id="del_comment" ${comment.comment_email==user.email ?'' :'hidden'} onclick="delete_comment(${comment.commentid})">
                        </div>
                    `;
            document
              .querySelector("#comment_wrap")
              .insertAdjacentHTML("beforeEnd", viewcomments_html);
          }
        }
      }
      function change_number(input_num) {
        if (input_num >= 1000) {
          return Math.floor(input_num / 1000) + "k";
        } else {
          return input_num;
        }
      }
    }
  });

//////  dropdown 설정

const dropdown_btn = document.querySelector("#dropdown_btn");
// 열기 버튼을 눌렀을 때 모달팝업이 열림
const dropdown = () => {
  let dropdown_op = document.querySelector("#dropdown_op");
  //display 속성을 block로 변경
  if (dropdown_op.style.display == "") {
    dropdown_op.style.display = "block";
  } else if (dropdown_op.style.display == "block") {
    dropdown_op.style.display = "";
  }
};
const go_profile = () => {
  window.location.assign("/editprofile");
};
const go_editpwd = () => {
  window.location.assign("/editpwd");
};
const go_login = () => {
  window.location.assign("/logout");
};

//////  게시글 수정으로 이동
const modify = (get_id) => {
  window.location.assign("/editpost/" + get_id);
};

//////  모달창 설정
let post_modal = document.querySelector(".post_modal");

// //열기 버튼을 눌렀을 때 모달팝업이 열림
const post_modalOpen = () => {
  //display 속성을 block로 변경
  post_modal.style.display = "block";
  document.body.style.overflow = "hidden";
};
const delete_post = () => {
  post_modal.style.display = "block";
  document.body.style.overflow = "hidden";
};

//닫기 버튼을 눌렀을 때 모달팝업이 닫힘
const post_modalClose = () => {
  //display 속성을 none으로 변경
  post_modal.style.display = "none";
  document.body.style.overflow = "unset";
};

const post_modalOk = () => {
  fetch("http://localhost:8081/posts/" + current_post.id, {
    credentials:'include',
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    alert("게시물 삭제 완료");
    document.body.style.overflow = "unset";
    window.location.assign("/viewlist");
  });
};

let comment_modal = document.querySelector(".comment_modal");

const delete_comment = (commentid) => {
  const comment_modal = document.querySelector(".comment_modal");
  comment_modal.style.display = "block";
  document.body.style.overflow = "hidden";

  let comments = current_post.comments;
  let find_comment;
  for (let i = 0; i < comments.length; i++) {
    if (comments[i].commentid == commentid) {
      find_comment = comments[i];
      break;
    }
  }
  current_comment = find_comment;
};
//닫기 버튼을 눌렀을 때 모달팝업이 닫힘
const comment_modalClose = () => {
  //display 속성을 none으로 변경
  let comment_modal = document.querySelector(".comment_modal");
  comment_modal.style.display = "none";
  document.body.style.overflow = "unset";
};
const comment_modalOk = () => {
  fetch(
    "http://localhost:8081/posts/" +
      current_post.id +
      "/deletecomment/" +
      current_comment.commentid,
    {
      credentials:'include',
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((response) => {
    //모달 없애면서 댓글 삭제
    document.body.style.overflow = "unset";
    alert("댓글 삭제 완료");
    window.location.assign("/postview/" + current_post.id);
  });
};

const write_comment = () => {
  const comment_btn = document.querySelector("#submitcomment_btn");
  const commentbox = document.getElementById("incomment").value;

  if (commentbox == "") {
    comment_btn.disabled = true;
    comment_btn.style.cssText = "background-color: #c7dbff";
  } else {
    comment_btn.disabled = false;
    comment_btn.style.cssText = "background-color: #8ab3ff";
  }
};

const modify_comment = (comment_id) => {
  let comments = current_post.comments;
  let find_comment;
  for (let i = 0; i < comments.length; i++) {
    if (comments[i].commentid == comment_id) {
      find_comment = comments[i];
      break;
    }
  }
  current_comment = find_comment;
  const comment_btn = document.querySelector("#submitcomment_btn");
  const comment_box = document.querySelector("#incomment");

  comment_box.value = find_comment.comment_content;
  comment_btn.innerText = "댓글 수정";
};

const goto_viewlist = () => {
  window.location.assign("/viewlist");
};

const upload_comment = () => {
  const commentbox = document.getElementById("incomment").value;
  if (current_comment == null) {
    fetch("http://localhost:8081/posts/writecomment", {
      credentials:'include',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_id: current_post.id,
        comment_email: user.email,
        comment_profile: user.profile,
        comment_name: user.nickname,
        comment_content: commentbox,
      }),
    }).then((res) => {
      if (res.ok) {
        commentbox.innerText = "";
        alert("댓글 등록 완료");
        window.location.assign("/postview/" + current_post.id);
      }
    });
  } else {
    fetch("http://localhost:8081/posts/modifycomment", {
      credentials:'include',
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_id: current_post.id,
        comment_content: commentbox,
        commentid: current_comment.commentid,
      }),
    }).then((res) => {
      if (res.ok) {
        commentbox.innerText = "";
        alert("댓글 수정 완료");
        window.location.assign("/postview/" + current_post.id);
      }
    });
  }
};

const goto_list = () => {
  window.location.assign("/viewlist");
};
