function signup() {
    var name = document.getElementById("signName").value;
    var email = document.getElementById("signEmail").value;
    var password = document.getElementById("signPassword").value;
    var users = JSON.parse(localStorage.getItem("userData")) || [];
    if (name === "" || email === "" || password === "") {
        Swal.fire("Error", "Please fill in all fields!", "error");
        return;
    }
    if (password.length < 6) {
        Swal.fire("Error", "Password must be at least 6 characters long!", "error");
        return;
    }
    var exists = false;
    for (var user of users) {
        if (user.email === email) {
            exists = true;
            break;
        }
    }
    if (exists) {
        Swal.fire({
            icon: "warning",
            title: "Already Exists",
            text: "This email is already registered!"
        });
        return;
    }

    var userData = {
        name: name,
        email: email,
        password: password
    }
    users.push(userData);
    localStorage.setItem("userData", JSON.stringify(users));
    Swal.fire("Success", "Signup successful!", "success");
    console.log(userData);

    window.location.href = "login.html";
}
function login() {
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;
    var users = JSON.parse(localStorage.getItem("userData")) || [];
    if (email === "" || password === "") {
        Swal.fire("Error", "Please fill in all fields!", "error");
        return;
    }
    var userData = users.find(function (user) {
        return user.email === email && user.password === password;
    });
    if (userData) {
        localStorage.setItem("currentUser", JSON.stringify(userData));
        Swal.fire({
            icon: "success",
            title: "Login Successful!",
            text: "Welcome back " + userData.name
        }).then(() => {
            window.location.href = "dashboard.html";
        });

    } else {
        Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: "Invalid email or password!"
        });
    }
}
function logout() {
    localStorage.removeItem("currentUser");
    Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been logged out successfully!"
    }).then(() => {
        window.location.href = "login.html";
    });
}
var selectedTextColor = "";
var cardBg = "";
var time = moment().format("MMMM Do YYYY, h:mm:ss a");
var currentUser = JSON.parse(localStorage.getItem("currentUser"));
var title = document.getElementById("title");
var description = document.getElementById("description");
var editIndex = null;
var imageInput = document.getElementById("imgInput")
var previewImg = document.getElementById("previewImg")
var storedBg = localStorage.getItem("cardBg");
if (storedBg) {
    cardBg = storedBg;
    previewImg.src = cardBg;
    previewImg.style.display = "block";
}

imageInput.addEventListener("change", function () {
    var file = imageInput.files[0];

    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            previewImg.src = e.target.result;
            previewImg.style.display = "block";
            cardBg = e.target.result;
            localStorage.setItem("cardBg", cardBg);
        };
        reader.readAsDataURL(file);
    }
});

function newPost() {
    var postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "";
    var allposts = JSON.parse(localStorage.getItem("posts")) || [];
    for (var i = allposts.length - 1; i >= 0; i--) {
        postsContainer.innerHTML += `
        <div class="card mb-2">
            <div class="card-header">
                ~${allposts[i].name} <br>
                <small>${allposts[i].time}</small>
            </div>
             <div class="card-body" style="background-image:url(${allposts[i].img}); background-size:cover; background-position:center;" class="img-fluid"> 
                <p style="color:${allposts[i].color};">${allposts[i].title}</p>
                <small style="color:${allposts[i].color};">${allposts[i].description}</small>
            </div>
            <div class="d-flex gap-4 ms-auto mt-1 mb-1">
                <button class="btn editBtn  p-1" onclick="editBtn(${i})">Edit</button>
                <button class="btn delBtn  p-1" onclick="delBtn(${i})">Delete</button>
            </div>
        </div>
        `;
    }
}
newPost();
function post() {
    var postTitle = document.getElementById("title");
    var postDesc = document.getElementById("description");

    var allPosts = JSON.parse(localStorage.getItem("posts")) || [];

    if (!postTitle.value.trim() || !postDesc.value.trim()) {
        Swal.fire("Error", "Title & description required!", "error");
        return;
    }
    if (editIndex !== null) {
        allPosts[editIndex].title = postTitle.value;
        allPosts[editIndex].description = postDesc.value;
        allPosts[editIndex].img = cardBg;
        allPosts[editIndex].color = selectedTextColor;
        editIndex = null;
        Swal.fire("Updated!", "Post updated successfully", "success");
    }
    else {

        var postObj = {
            title: postTitle.value,
            description: postDesc.value,
            name: currentUser.name,
            time: moment().format("MMMM Do YYYY, h:mm:ss a"),
            img: cardBg,
            color: selectedTextColor,
            likes: 0
        };

        allPosts.push(postObj);
    }

    localStorage.setItem("posts", JSON.stringify(allPosts));
    postTitle.value = "";
    postDesc.value = "";
    selectedTextColor = "";
    cardBg = "";
    previewImg.style.display = "none";
    previewImg.src = "";
    imageInput.value = "";
    newPost();
}
function editBtn(index) {
    var allPosts = JSON.parse(localStorage.getItem("posts")) || [];

    document.getElementById("title").value = allPosts[index].title;
    document.getElementById("description").value = allPosts[index].description;
     cardBg = allPosts[index].img;
    if (cardBg) {
        previewImg.src = cardBg;
      previewImg.style.display = "block";}

    editIndex = index;
    Swal.fire("Edit Mode", "Now update your post", "info");
}
function delBtn(index) {
    Swal.fire({
        title: "Are you sure?",
        text: "This post will be deleted permanently!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {

            var allPosts = JSON.parse(localStorage.getItem("posts")) || [];
            allPosts.splice(index, 1);
            localStorage.setItem("posts", JSON.stringify(allPosts));
            newPost();

            Swal.fire(
                "Deleted!",
                "Your post has been deleted.",
                "success"
            );
        }
    });

}
// IMAGE
function addImg(src) {
    cardBg = src;
    var bgImg = document.getElementsByClassName("bgImg");
    for (var i = 0; i < bgImg.length; i++) {
        console.log(bgImg[i].className);
        bgImg[i].className = "bgImg"
    }
    event.target.classList.add("addImg");
}
function applycolor(element) {
    var colorbox = document.getElementsByClassName('colorbox');
    for (var i = 0; i < colorbox.length; i++) {
        colorbox[i].classList.remove('selected');
    }
    element.classList.add('selected');
    selectedTextColor = element.style.backgroundColor;
}