var CardBg ;
function post(){
    var title = document.getElementById("title")
    var description = document.getElementById("Description")
    console.log(title.value , description.value);
    var posts =document.getElementById("posts")
    if(title.value.trim() && description.value.trim()){
        posts.innerhtml +=
        `   <div class="card mb-2">
              <div class="card-header">~Post</div>
              <div style="background-image:url(${CardBg})" class="card-body">
                <figure>
                  <blockquote class="blockquote">
                    <p>
                      ${title.value}
                    </p>
                  </blockquote>
                  <figcaption class="blockquote-footer">
                    ${description.value}
                  </figcaption>
                </figure>
              </div>
            </div>
    `
    }
    
}