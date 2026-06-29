var selectedTextColor = "";
var cardBg = "";
// var time = moment().format("MMMM Do YYYY, h:mm:ss a");
// var currentUser = JSON.parse(localStorage.getItem("currentUser"));
var title = document.getElementById("title");
var description = document.getElementById("description");
var editIndex = null;
var imageInput = document.getElementById("imgInput")
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

window.onload = async function () {
  try {
    const { data, error } = await supabase.from('My Posts').select("*").order('id', { ascending: false })
    console.log(data);
    data.forEach(post => {
      // console.log(post.title);
      var posts = document.getElementById("posts")
      posts.innerHTML += `
      <div class="card mb-2">
               <div class="card-header">${post.id} ~Post</div>
               <div style="background-image:url(${post.bg_img})" class="card-body">
                 <figure>
                   <blockquote class="blockquote">
                     <p>
                       ${post.title}
                     </p>
                   </blockquote>
                   <figcaption class="blockquote-footer">
                     ${post.description}
                   </figcaption>
                 </figure>
               </div>
               <div class="ms-auto m-2">
               <button onclick="editPost(event,${post.id},'${post.description}','${post.title}','${post.bg_img}')" class="btn btn-success">Edit</button>
               <button onclick="deletePost(event,${post.id})" class="btn btn-danger">Delete</button>
               </div>
             </div>
     `
      if (error) console.log(error)

    });
  } catch (error) {
    console.log(error);
  }
}
async function post() {
  var title = document.getElementById("title")
  var description = document.getElementById("description")
  console.log(title.value, description.value);
  var  postsContainer = document.getElementById("posts")


  if (title.value.trim() && description.value.trim()) {
    if (edited) {
      try {
        const { data, error } = await supabase
          .from('My Posts')
          .update({ title: title.value, description: description.value, bg_img: cardBg })
          .eq('id', idindex)
          .select()
        console.log(data);
        if (error) {
          console.log(error);
        }
        edited=false
        idindex=null
        let postBtn = document.getElementById("postBtn")
  postBtn.innerHTML = "Post"

      } catch (error) {
        console.log(error);
      }
    }
    else {
      try {
        const { data, error } = await supabase
          .from('My Posts')
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
  var card = event.target.parentNode.parentNode
  card.remove()
  edited = true;
  idindex = id;
  let postBtn = document.getElementById("postBtn")
  postBtn.innerHTML = "Update Post"
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
//color
function applycolor(element) {
    var colorbox = document.getElementsByClassName('colorbox');
    for (var i = 0; i < colorbox.length; i++) {
        colorbox[i].classList.remove('selected');
    }
    element.classList.add('selected');
    selectedTextColor = element.style.backgroundColor;
}