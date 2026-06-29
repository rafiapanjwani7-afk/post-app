import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabase_url = "https://izorczhqnqgwpbjxguoi.supabase.co"
const publish_key = "sb_publishable_WR1TFRd5ys0ycT4nl228oA_fdYnPxE-"

const supabase = createClient(supabase_url, publish_key)
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", signup);
}

async function signup(event) {
    event.preventDefault();

    console.log("Signup function called");

    const name = document.getElementById("signName").value;
    const email = document.getElementById("signEmail").value;
    const password = document.getElementById("signPassword").value;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name }
        }
    });

    console.log(data);
    console.log(error);
    if (error) {
        Swal.fire("Error", error.message, "error");
        return;
    }
    Swal.fire({
        icon: "success",
        title: "Signup Successful"
    }).then(() => {
        window.location.href = "login.html";
    });
}
// console.log(supabase);
console.log("Signup function called");

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", login);
}

async function login(event) {
    event.preventDefault();
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        Swal.fire("Error", "Please fill in all fields!", "error");
        return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    console.log(data);
    console.log(error);
    if (error) {
        Swal.fire("Error", error.message, "error");
        return;
    }

    Swal.fire({
        icon: "success",
        title: "Login Successful!"
    })
        .then(() => {
            window.location.href = "dashboard.html";
        });
}
async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        Swal.fire("Error", error.message, "error");
        return;
    }

    Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been logged out successfully!"
    }).then(() => {
        window.location.href = "login.html";
    });
}

let edited = false;
var selectedTextColor = "";
var cardBg = "";
// var time = moment().format("MMMM Do YYYY, h:mm:ss a");
// var currentUser = JSON.parse(localStorage.getItem("currentUser"));
var title = document.getElementById("title");
var description = document.getElementById("description");
let editIndex = null;
window.onload = async function () {
    const postsContainer = document.getElementById("posts");

    try {
        const { data, error } = await supabase
            .from('post_app_table')
            .select("*")
            .order('id', { ascending: false });

        if (error) {
            console.log("Supabase Error:", error);
            return;
        }

        if (!data) {
            console.log("No data found");
            return;
        }

        data.forEach(post => {
            postsContainer.innerHTML += `
<div class="card mb-3">

<div class="card-header d-flex justify-content-between">
    <span>~post ${post.id}</span>

    <div>
        <button class="btn  btn-sm"
        onclick="editPost(event,${post.id},'${post.description}','${post.title}','${post.bg_img}')">
        <i class="bi bi-pencil-square"></i>
        </button>

        <button class="btn  btn-sm"
        onclick="delpost(event,${post.id})">
         <i class="bi bi-trash"></i>
        </button>
    </div>
</div>

<div class="card-body"
style="background-image:url('${post.bg_img}');background-size:cover;background-position:center;">
<h4 style="color:${selectedTextColor}">
${post.title}
</h4>
<p style="color:${selectedTextColor}">
${post.description}
</p>
</div>

</div>
`;
        });

    } catch (err) {
        console.log("Catch Error:", err);
    }
};
async function post() {
    var title = document.getElementById("title")
    var description = document.getElementById("description")
    console.log(title.value, description.value);
    var posts = document.getElementById("posts")
    if (title.value.trim() && description.value.trim()) {
        if (edited) {
            try {
                const { data, error } = await supabase
                    .from('post_app_table')
                    .update({ title: title.value, description: description.value, bg_img: cardBg })
                    .eq('id', editIndex)
                    .select()
                console.log(data);
                if (error) {
                    console.log(error);
                }
                edited = false
                editIndex = null
                let postBtn = document.getElementById("postBtn")
                postBtn.innerHTML = "Post"

            } catch (error) {
                console.log(error);
            }
        }
        else {
            try {
                const { data, error } = await supabase
                    .from('post_app_table')
                    .insert({ title: title.value, description: description.value, bg_img: cardBg })
                    .select()
                console.log("Post data", data);
                if (error) console.log(error)
            } catch (error) {
                console.log(error);
            }
        }

        location.reload()
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Title & description can't be empty!",
        });
    }
    title.value = ""
    description.value = ""
}
function editPost(event, id, desc, title, bg_img) {
    console.log(title, desc, id);
    document.getElementById("title").value = title
    document.getElementById("description").value = desc
    console.log(title, description);
   const card = event.target.closest(".card");
    if (card) card.remove();
    edited = true;
    editIndex = id;
    let postBtn = document.getElementById("postBtn")
    postBtn.innerHTML = "Update Post"
}


function addImg(src) {
    cardBg = src;

    const images = document.querySelectorAll(".bgImg");

    images.forEach((img) => {
        img.classList.remove("addImg");

        if (img.getAttribute("src") === src) {
            img.classList.add("addImg");
        }
    });
}
async function delpost(event, id) {

    const result = await Swal.fire({
        title: "Are you sure?",
        text: "This post will be deleted permanently!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
    });

    if (!result.isConfirmed) return;

    try {
        const { data, error } = await supabase
            .from('post_app_table')
            .delete()
            .eq('id', id);

        if (error) {
            console.log(error);
            return;
        }

        Swal.fire("Deleted!", "Your post has been deleted.", "success");

       const card = event.target.closest(".card");
    if (card) card.remove();

    } catch (error) {
        console.log(error);
    }
}

//color
function applycolor(element) {
    var colorbox = document.getElementsByClassName('colorbox');
    for (var i = 0; i < colorbox.length; i++) {
        colorbox[i].classList.remove('selected');
    }
    element.classList.add('selected');
    selectedTextColor = element.style.backgroundColor;
}
window.logout = logout;
window.post = post;
window.addImg = addImg;
window.applycolor = applycolor;
window.editPost = editPost;
window.delpost = delpost;