import supabase from "./supabase.js";

let edited = false;
var selectedTextColor = "";
var cardBg = "";
// var time = moment().format("MMMM Do YYYY, h:mm:ss a");
// var currentUser = JSON.parse(localStorage.getItem("currentUser"));
var title = document.getElementById("title");
var description = document.getElementById("description");
let editIndex = null;
async function searchPosts() {
    let searchInput = document.getElementById("searchInput").value;
    console.log("Searching for:", searchInput);
    try {
        //     const { data, error } = await supabase
        //   .from('post_app_table')
        //   .select("*")
        //   .ilike('title', `%${searchInput}%`)
        const { data, error } = await supabase
            .from("post_app_table")
            .select("*").order('id', { ascending: false })
            .or(`title.ilike.%${searchInput}%,description.ilike.%${searchInput}%`);
        const postsContainer = document.getElementById("posts");
        postsContainer.innerHTML = "";
        data.forEach(post => {
            postsContainer.innerHTML += `
<div class="card mb-3">

<div class="card-header d-flex justify-content-between">
    <span>~post ${post.id}</span>

    <div>
        <button class="btn  btn-sm btn-edit text-warning"
        onclick="editPost(event,${post.id},'${post.description}','${post.title}','${post.bg_img}','${post.text_color}')">
        <i class="bi bi-pencil-square"></i>
        </button>

        <button class="btn  btn-sm btn-delete text-danger"
        onclick="delpost(event,${post.id})">
         <i class="bi bi-trash"></i>
        </button>
    </div>
</div>

<div class="card-body"
style="background-image:url('${post.bg_img}');background-size:cover;background-position:center;">
<h4 style="color:${post.text_color}">
${post.title}
</h4>
<p style="color:${post.text_color}">
${post.description}
</p>
</div>

</div>
`;
        });
        console.log(data)
        if (!data.length) {
            Swal.fire({
                icon: "info",
                title: "No Results",
                text: "No posts found matching your search."
            });
            postsContainer.innerHTML = "<p class='text-center'>No posts found.</p>";
        }
        if (error) {
            console.log("Error searching posts:", error);
            return;
        }
    } catch (error) {
        console.log("Error searching posts:", error);
    }
}
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
    <span> ${post.id}~${post.email}</span>

    <div>
        <button class="btn  btn-sm"
        onclick="editPost(event,${post.id},'${post.description}','${post.title}','${post.bg_img}','${post.text_color}')">
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
<h4 style="color:${post.text_color}">
${post.title}
</h4>
<p style="color:${post.text_color}">
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
let Email;
async function post() {
    var title = document.getElementById("title")
    var description = document.getElementById("description")
    console.log(title.value, description.value);
    var posts = document.getElementById("posts")
    if (title.value.trim() && description.value.trim()) {
        try {
            const { data: { user }, error } = await supabase.auth.getUser()
            console.log(user.email);

            Email = user.email;
            if (error) {
                console.log(error);

            }
        }

        catch (error) {
            console.log(error);
        }

        if (edited) {
            try {
                const { data, error } = await supabase
                    .from('post_app_table')
                    .update({ title: title.value, description: description.value, bg_img: cardBg, text_color: selectedTextColor })
                    .eq('id', editIndex)
                    .select()
                console.log(data);
                if (error) {
                    console.log(error);
                }
                Swal.fire({
                    icon: "success",
                    title: "Updated!",
                    text: "Your post has been updated successfully.",
                });
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
                    .insert({ title: title.value, description: description.value, bg_img: cardBg, text_color: selectedTextColor, email: Email })
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
// var imageInput = document.getElementById("imgInput")
// var previewImg = document.getElementById("previewImg")
// var storedBg = localStorage.getItem("cardBg");
// if (storedBg) {
//     cardBg = storedBg;
//     previewImg.src = cardBg;
//     previewImg.style.display = "block";
// }

// imageInput.addEventListener("change", function () {
//     var file = imageInput.files[0];

//     if (file) {
//         var reader = new FileReader();
//         reader.onload = function (e) {
//             previewImg.src = e.target.result;
//             previewImg.style.display = "block";
//             cardBg = e.target.result;
//             localStorage.setItem("cardBg", cardBg);
//         };
//         reader.readAsDataURL(file);
//     }
// });
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
window.searchPosts = searchPosts;

// Theme support: toggle and persist user's preference
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    const icon = document.getElementById("themeIcon");

    if (icon) {
        if (theme === "dark") {
            // Dark mode active → Sun icon dikhao
            icon.className = "bi bi-sun-fill";
        } else {
            // Light mode active → Moon icon dikhao
            icon.className = "bi bi-moon-fill";
        }
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";

    applyTheme(current === "dark" ? "light" : "dark");
}

window.toggleTheme = toggleTheme;

(function initTheme() {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    applyTheme(theme);
})(); 