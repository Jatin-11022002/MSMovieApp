const token = localStorage.getItem('token')
const BASE_URL = 'http://localhost:3000';
const HOME_URL = BASE_URL + '/movies/home?email=admin123';
const delay = 300;
const main = document.getElementById('main');
const pagination = document.getElementById('pagination');
const loader = document.getElementById('loader');
const search = document.getElementById('search');
var currentPage = 1
var previousPage = 0
var NextPage = 2
var dirname

showHome();

function showHome(page = 1) {
    getMovies(HOME_URL, 'home', 'home', page);
}

async function getMovies(url, frame, parm, page = 1) {
    loading(true)
    var result = await fetch(url + `&page=${page}&token=${token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(data => {
        console.log(data)
        loading(false);
        showMovies(data, frame, parm, page);
    })

}

function showMovies(data, frame, parm, page, enablePagination = true) {
    // var name, path, liked,watched ,overview;
    dirname =data.dirname
   
    var count = parseInt(data.count);

    var prev = '',
        next = ''
    currentPage = page;
    if ((page - 1) <1) {
        prev = 'disabled'
    }
    if ((page + 1) > parseInt(count / 5)) {
        next = 'disabled'
        
    }
    main.innerHTML = '';
    var html = '';
    if (frame === 'home') {
        if (page === 1) {
            var newMovies = data.newmovies;
            html += ` <div class="tag" id="latest">
            Latest Releases
         </div>`

            for (var movie in newMovies) {
                html += movieCard(newMovies[movie]);

            }
        }

        var tags = data.tags[0];
        for (var tag in tags) {
            html += ` <div class="tag" >
           More From "${tag}"  <button class ="btn" onclick="showMore('${tag}',event)">show more</button>
         </div>`
            var movies = tags[tag];
            for (var movie in movies) {
                html += movieCard(movies[movie]);

            }
        }
    } else if (frame === 'search') {
        html = ` <div class="tag">
Search results for "${data.value}"
</div>`
        var movies = data.movies;
        for (var movie in movies) {

            html += movieCard(movies[movie]);
        }

    } else if (frame === 'movie') {
        enablePagination = false;
        var {
            id,
            name,
            overview,
            liked,
            path,
            watched,
            genre
        } = data.movie;
        var list = '';
        var liked =data.liked;
        var rating = isNaN(parseInt((liked * 100) / watched)) ? 0 : parseInt((liked * 100) / watched)
        data.tags.map((tag) => {
            list += `<span class= "tag-list">${tag}</span>`
        })
        html = `<div class = "card-wrapper">
        <div class = "card">
        
            <div class = "img-showcase">
              <img src = "${path}" >
              </div>
              </div>
              <div class = "product-detail">
              <p>Name: <span>${name}</span></p>
              <p class="description">Overview:<span> ${overview}</span></p>
              <p>Genre: <span>${genre}</span></p>
              <p>Liked: <span>${rating}%</span></p>
              <p>tags: ${list}</p><p> Like/Unlike: <span>
              <img id = "unlike"class= "like ${(liked)?'toggle-display':''}"onclick= "liked(true,'${id}')" src= "../icons/like-regular-36.png">
              <img id ="like" class= "like ${(liked)?'':'toggle-display'}"onclick= "liked(false,'${id}')" src= "../icons/like-solid-36.png">
                </span></p>
              </div>
        </div>
        `

        var recommend = data.recommend[0];
        if (recommend && recommend.length > 0) {
            html += `<div class="tag" >
            Similar Recommended Movies
          </div>`
            recommend.map((movie) => {
                html += movieCard(movie);
            });
        }

    }
    var paginationHTML = '';
    if (enablePagination) {
        var paginationHTML = `<div class= '${prev}' id="prev"onclick="paginate('${parm}','prev',event)">Prev</div>
        <div class="page">Page <span class="page-num">${currentPage}</span></div>
        <div class='${next}' id="next" onclick="paginate('${parm}','next',event)">Next</div>`

    }
    pagination.innerHTML = paginationHTML;
    main.innerHTML = html;


}

function paginate(parm, action, event) {

    if (action === 'next') {
        currentPage++;
    } else {
        currentPage--;
    }
    if (parm === 'home') {
        showHome(currentPage);
    } else {
        var entity = document.getElementById('filter').value;
        showMore(parm, event, currentPage,entity)
    }
}

function movieCard(movie) {
    var html = '';
    var {
        id,
        name,
        path,
        liked,
        watched,
        overview
    } = movie;
    var rating = isNaN(parseInt((liked * 100) / watched)) ? 0 : parseInt((liked * 100) / watched)
    html += `<div class="movie" onclick ="showMovie('${id}',event)">
    <img src="${path}" alt="Image">"

    <div class="movie-info">
        <h3>${name}</h3>
        <span class="green">liked: ${rating}%</span>
    </div>
    <div class="overview">
        <h3>Overview</h3>${overview}
    </div>
</div>`
    return html;
}


function showMore(tag, e, page = 1,entity='tags') {
    var url = BASE_URL + `/movies/search?entity=${entity}&value=${tag}`
    frame = 'search';
    getMovies(url, frame, tag, page);
    e.preventDefault();
   
}

function showMovie(id, e) {
    e.preventDefault();

   
    var url = BASE_URL + `/movies/${id}?`
    var frame = 'movie'
    getMovies(url, frame);

}

function debounce() {
    var value = document.getElementById('search').value;
   
   if(value==''){showHome();}
}
search.addEventListener('keyup', (e) => {
    e.preventDefault();

    
    var entity = document.getElementById('filter').value;
    var value = document.getElementById('search').value;
    if (value === '') {
        showHome();
        return;
    }
    if(e.key == "Enter"){
    var url = '';
    var frame = '';
    var page = 1;
     //  url = BASE_URL + 
     var url = BASE_URL + `/movies/search?entity=${entity}&value=${value}`
     frame = 'search';
     getMovies(url, frame,value, page);
    }

})
async function liked (liked,movieId){
    var like = document.getElementById('like');
    var unlike = document.getElementById('unlike');
    if(liked){
        like.classList.remove("toggle-display");
        unlike.classList.add("toggle-display")
    }else{
        unlike.classList.remove("toggle-display");
        like.classList.add("toggle-display")
    }
    var result = await fetch(BASE_URL+`/movies/movie/like`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token:token,
            liked:liked,
            movieId:movieId
        })
    }).then(res => res.json()).then(data => {
        console.log(data)
    })


}
var logout = document.getElementById('logout')
logout.addEventListener('click', (e) => {
    e.preventDefault();
localStorage.removeItem('token');
window.location.href =  `${BASE_URL}\\`

})
function loading(flag){
if(flag){
    main.innerHTML = '';
    loader.classList.remove('toggle-display');
    pagination.classList.add('toggle-display');
}else{
    loader.classList.add('toggle-display');
    pagination.classList.remove('toggle-display');
}

}