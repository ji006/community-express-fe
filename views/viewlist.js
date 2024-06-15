let userString = window.localStorage.getItem("user");
let user = JSON.parse(userString);

let profile = document.getElementById("profile");
profile.setAttribute("src", user.profile);
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
  .then((data) => {
    // 데이터 처리
    console.log(data);
    for (let i = 0; i < data.posts.length; i++) {
      const post = data.posts[i];
      let post_html = `
                <div class="listbox" onclick='view(${post.id})';>
                <div class="writetop">
                    <div class="title">${post.title}</div>
                    <div class="num">
                        <div class="num_count"> 좋아요 ${change_number(
                          post.like
                        )} </div>
                        <div class="num_count"> 댓글 ${change_number(
                          post.comment
                        )} </div>
                        <div class="num_count"> 조회수 ${change_number(
                          post.viewcount
                        )} </div>
                        <div class="time"> ${post.writetime} </div>
                    </div>
                </div>
                <hr style = "width:100%; height:1px; border: 0px; margin: 0px; background-color: black; opacity: 16%;">
                <div class="writer">
                    <div class="boxchange"><img src="${post.profile}"></div>
                    <div class="writername">${post.nickname}</div>
                </div>
                </div>
            `;
      document
        .querySelector("#post_wrap")
        .insertAdjacentHTML("beforeEnd", post_html);
    }
  })
  .catch((error) => {
    // 에러 처리
    console.error("There was a problem with your fetch operation:", error);
  });

const change_number = (input_num) => {
  if (input_num >= 1000) {
    return Math.floor(input_num / 1000) + "k";
  } else {
    return input_num;
  }
};

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

const towrite = () => {
  window.location.assign("/writepost");
};

const view = (get_id) => {
  window.location.assign("/postview/" + get_id);
};

// window.onload = function(){
//     var p = document.getElementById("postwrite");
//     p.onclick = goto;
// }
// function goto(){
//     window.location.assign('/writepost');
// }

const goto_list = () => {
  window.location.assign("/viewlist");
};
